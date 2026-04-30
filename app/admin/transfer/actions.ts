"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStockTransfer(data: {
  fromLocationId: string;
  toLocationId: string;
  items: { productId: string; quantity: number; batchId?: string | null }[];
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Buat Header Dokumen Transfer
      const transfer = await tx.stockTransfer.create({
        data: {
          fromLocationId: data.fromLocationId,
          toLocationId: data.toLocationId,
          status: "COMPLETED",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      for (const item of data.items) {
        const activeBatchId = item.batchId ?? null;

        // 2. Cari stok di lokasi asal
        const sourceInv = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            locationId: data.fromLocationId,
            batchId: activeBatchId,
          },
        });

        if (!sourceInv || sourceInv.quantity < item.quantity) {
          throw new Error(`Stok tidak cukup di lokasi asal.`);
        }

        // 3. Kurangi stok asal
        await tx.inventory.update({
          where: { id: sourceInv.id },
          data: { quantity: { decrement: item.quantity } },
        });

        // 4. Tambah/Upsert stok tujuan (Fixing the TS Error)
        await tx.inventory.upsert({
          where: {
            productId_locationId_batchId: {
              productId: item.productId,
              locationId: data.toLocationId,
              batchId: activeBatchId as string, 
            },
          },
          update: { quantity: { increment: item.quantity } },
          create: {
            productId: item.productId,
            locationId: data.toLocationId,
            batchId: activeBatchId,
            quantity: item.quantity,
          },
        });

        // 5. Riwayat Movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            fromLocationId: data.fromLocationId,
            toLocationId: data.toLocationId,
            type: "TRANSFER",
            quantity: item.quantity,
            referenceId: transfer.id,
          },
        });
      }

      revalidatePath("/admin/inventory");
      return { success: true };
    });
  } catch (error: any) {
    return { error: error.message };
  }
}