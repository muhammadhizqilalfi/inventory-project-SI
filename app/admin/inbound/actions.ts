"use server";

import { prisma } from "@/lib/prisma";
import { QCStatus } from "@prisma/client";

export async function createPO(data: {
  supplierId: string;
  items: { productId: string; quantity: number }[];
}) {
  try {
    const po = await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
    // Kembalikan struktur yang konsisten agar tidak error di frontend
    return { success: true, poId: po.id, error: null };
  } catch (error: any) {
    console.error("Create PO Error:", error);
    return { success: false, poId: null, error: error.message };
  }
}

export async function processReceipt(data: {
  poId: string;
  items: {
    productId: string;
    quantity: number;
    qcStatus: QCStatus;
    locationId: string;
    batchId?: string | null;
  }[];
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Buat Header Penerimaan
      const receipt = await tx.goodsReceipt.create({
        data: {
          poId: data.poId,
          status: "COMPLETED",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              qcStatus: item.qcStatus,
            })),
          },
        },
      });

      for (const item of data.items) {
        // 2. Update receivedQty di PO
        await tx.purchaseOrderItem.updateMany({
          where: { purchaseOrderId: data.poId, productId: item.productId },
          data: { receivedQty: { increment: item.quantity } },
        });

        // 3. JIKA Lolos QC (PASSED), masukkan ke Inventory
        if (item.qcStatus === "PASSED") {
          // Ganti string kosong atau undefined menjadi null agar konsisten di DB
          const finalBatchId = item.batchId || null;

          const existingInventory = await tx.inventory.findFirst({
            where: {
              productId: item.productId,
              locationId: item.locationId,
              batchId: finalBatchId,
            },
          });

          if (existingInventory) {
            // 2. Jika ada, update quantity-nya
            await tx.inventory.update({
              where: { id: existingInventory.id },
              data: { quantity: { increment: item.quantity } },
            });
          } else {
            // 3. Jika tidak ada, buat data baru
            await tx.inventory.create({
              data: {
                productId: item.productId,
                locationId: item.locationId,
                batchId: finalBatchId,
                quantity: item.quantity,
              },
            });
          }

          // 4. Catat Stock Movement (tetap sama)
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              toLocationId: item.locationId,
              type: "IN",
              quantity: item.quantity,
              referenceId: receipt.id,
            },
          });
        }
      }

      return { success: true, error: null };
    });
  } catch (error: any) {
    console.error("Inbound Error:", error);
    return {
      success: false,
      error: error.message || "Gagal memproses penerimaan",
    };
  }
}
