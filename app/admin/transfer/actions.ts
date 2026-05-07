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
        // Normalisasi batchId agar sinkron dengan database (null jika kosong/undefined)
        const activeBatchId = item.batchId || null;

        // 2. Cari stok di lokasi asal (menggunakan findFirst agar bisa mencari NULL)
        const sourceInv = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            locationId: data.fromLocationId,
            batchId: activeBatchId,
          },
        });

        // Validasi Ketersediaan
        if (!sourceInv || sourceInv.quantity < item.quantity) {
          throw new Error(
            `Stok produk tidak ditemukan atau tidak cukup (Tersedia: ${sourceInv?.quantity || 0}, Diminta: ${item.quantity})`
          );
        }

        // 3. Kurangi stok asal
        await tx.inventory.update({
          where: { id: sourceInv.id },
          data: { quantity: { decrement: item.quantity } },
        });

        // 4. Update/Tambah stok tujuan (MENGGANTI UPSERT YANG ERROR)
        const destinationInv = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            locationId: data.toLocationId,
            batchId: activeBatchId,
          },
        });

        if (destinationInv) {
          // Jika produk sudah ada di lokasi tujuan, tambahkan quantity
          await tx.inventory.update({
            where: { id: destinationInv.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          // Jika belum ada, buat record inventory baru
          await tx.inventory.create({
            data: {
              productId: item.productId,
              locationId: data.toLocationId,
              batchId: activeBatchId,
              quantity: item.quantity,
            },
          });
        }

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
      return { success: true, error: null };
    });
  } catch (error: any) {
    console.error("Transfer Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getProductsByLocation(locationId: string) {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        locationId: locationId,
        quantity: { gt: 0 },
      },
      include: {
        product: true,
      },
    });

    return inventoryItems.map((inv) => ({
      // Gunakan ID unik dari Inventory sebagai kunci di UI jika perlu
      productId: inv.productId,
      name: inv.product.name,
      availableQty: inv.quantity,
      batchId: inv.batchId,
    }));
  } catch (error) {
    console.error("Gagal mengambil produk berdasarkan lokasi:", error);
    return [];
  }
}