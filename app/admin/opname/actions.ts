"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Fungsi untuk membuat sesi (sudah dibuat tadi)
export async function createOpnameSession() {
  try {
    const currentInventory = await prisma.inventory.findMany();
    const newOpname = await prisma.$transaction(async (tx) => {
      const opname = await tx.stockOpname.create({
        data: { status: "PENDING" },
      });

      const opnameItems = currentInventory.map((inv) => ({
        stockOpnameId: opname.id,
        inventoryId: inv.id,
        systemQty: inv.quantity,
        actualQty: inv.quantity,
        adjustmentQty: 0,
      }));

      await tx.stockOpnameItem.createMany({ data: opnameItems });
      return opname;
    });

    revalidatePath("/admin/opname");
    redirect(`/admin/opname/${newOpname.id}`);
  } catch (error) {
    console.error(error);
    return { error: "Gagal membuat sesi opname" };
  }
}

// INI YANG KURANG: Tambahkan 'export' pada fungsi completeOpname
export async function completeOpname(opnameId: string, items: any[]) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus item awal (draft) untuk diisi dengan hasil final
      // Atau bisa juga melakukan update, tapi create ulang lebih bersih untuk snapshot final
      await tx.stockOpnameItem.deleteMany({ where: { stockOpnameId: opnameId } });

      for (const item of items) {
        const inventory = await tx.inventory.findUnique({
          where: { id: item.inventoryId },
        });

        if (!inventory) continue;

        const adjustmentQty = item.actualQty - item.systemQty;

        // 2. Simpan Item Opname Final
        await tx.stockOpnameItem.create({
          data: {
            stockOpnameId: opnameId,
            inventoryId: item.inventoryId,
            systemQty: item.systemQty,
            actualQty: item.actualQty,
            adjustmentQty: adjustmentQty,
          },
        });

        // 3. Update Inventory Fisik
        await tx.inventory.update({
          where: { id: item.inventoryId },
          data: { quantity: item.actualQty },
        });

        // 4. Catat ke StockMovement jika ada selisih
        if (adjustmentQty !== 0) {
          await tx.stockMovement.create({
            data: {
              productId: inventory.productId,
              toLocationId: inventory.locationId,
              type: "ADJUSTMENT",
              quantity: Math.abs(adjustmentQty),
              referenceId: opnameId,
            },
          });
        }
      }

      // 5. Update Status Sesi
      await tx.stockOpname.update({
        where: { id: opnameId },
        data: { status: "COMPLETED" },
      });
    });

    revalidatePath("/admin/opname");
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menyelesaikan opname" };
  }
}