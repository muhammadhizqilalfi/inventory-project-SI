"use server";

import { prisma } from "@/lib/prisma";
import { QCStatus, OrderStatus } from "@prisma/client";

export async function createPO(data: {
  supplierId: string;
  items: { productId: string; quantity: number }[];
}) {
  try {
    const po = await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        status: OrderStatus.PENDING,
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
    batchNumber?: string;
    expiryDate?: Date;
  }[];
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const hasFailed = data.items.some(
        (item) => item.qcStatus === QCStatus.FAILED,
      );

      const hasInspection = data.items.some(
        (item) => item.qcStatus === QCStatus.NEEDS_INSPECTION,
      );

      // 1. Buat Header Penerimaan
      const receipt = await tx.goodsReceipt.create({
        data: {
          poId: data.poId,
          status: hasInspection ? "PENDING" : "COMPLETED",
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
        if (item.qcStatus === "PASSED") {
          await tx.purchaseOrderItem.updateMany({
            where: {
              purchaseOrderId: data.poId,
              productId: item.productId,
            },
            data: {
              receivedQty: {
                increment: item.quantity,
              },
            },
          });

          const now = new Date();

          const datePart =
            String(now.getDate()).padStart(2, "0") +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getFullYear()).slice(-2);

          const randomId = crypto.randomUUID().slice(0, 4).toUpperCase();

          const batchNumber = `${datePart}-${randomId}`;

          let finalBatchId: string | null = null;

          const batch = await tx.batch.create({
            data: {
              productId: item.productId,
              batchNumber,
              expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
            },
          });

          finalBatchId = batch.id;

          const existingInventory = await tx.inventory.findFirst({
            where: {
              productId: item.productId,
              locationId: item.locationId,
              batchId: finalBatchId,
            },
          });

          if (existingInventory) {
            await tx.inventory.update({
              where: {
                id: existingInventory.id,
              },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
          } else {
            await tx.inventory.create({
              data: {
                productId: item.productId,
                locationId: item.locationId,
                batchId: finalBatchId,
                quantity: item.quantity,
              },
            });
          }

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

      // Ambil semua item PO terbaru
      const poItems = await tx.purchaseOrderItem.findMany({
        where: {
          purchaseOrderId: data.poId,
        },
      });

      // Hitung status PO
      const totalItems = poItems.length;

      const completedItems = poItems.filter(
        (item) => item.receivedQty >= item.quantity,
      ).length;

      let status: OrderStatus = OrderStatus.PENDING;

      if (hasFailed) {
        status = OrderStatus.REJECTED;
      } else if (hasInspection) {
        status = OrderStatus.INSPECTION;
      } else if (completedItems === totalItems) {
        status = OrderStatus.COMPLETED;
      } else if (poItems.some((item) => item.receivedQty > 0)) {
        status = OrderStatus.PARTIAL;
      }

      // Update status PO
      await tx.purchaseOrder.update({
        where: {
          id: data.poId,
        },
        data: {
          status,
        },
      });

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
