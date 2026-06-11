"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSalesOrder(formData: FormData) {
  const orderNumber = `OID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const customerName = formData.get("customerName") as string;

  const itemCount = Number(formData.get("itemCount"));

  const items = [];

  for (let i = 0; i < itemCount; i++) {
    const productId = formData.get(`productId-${i}`) as string;

    const quantity = Number(formData.get(`quantity-${i}`));

    if (!productId || quantity <= 0) continue;

    items.push({
      productId,
      quantity,
    });
  }

  const order = await prisma.salesOrder.create({
    data: {
      orderNumber,
      customerName,
      status: "PENDING",

      items: {
        create: items,
      },
    },
  });

  redirect(`/users/outbound/${order.id}`);
}

export async function generatePicklist(salesOrderId: string) {
  const existingPicklist = await prisma.picklist.findFirst({
    where: {
      salesOrderId,
    },
  });

  if (existingPicklist) {
    return {
      success: false,
      message: "Picklist sudah pernah dibuat",
    };
  }

  const order = await prisma.salesOrder.findUnique({
    where: {
      id: salesOrderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return {
      success: false,
      message: "Sales Order tidak ditemukan",
    };
  }

  const picklist = await prisma.picklist.create({
    data: {
      salesOrderId,
      status: "PENDING",
    },
  });

  for (const item of order.items) {
    let remainingQty = item.quantity;

    const inventories = await prisma.inventory.findMany({
      where: {
        productId: item.productId,
        quantity: {
          gt: 0,
        },
      },
      orderBy: {
        quantity: "desc",
      },
    });

    const totalAvailable = inventories.reduce(
      (sum, inv) => sum + inv.quantity,
      0,
    );

    if (totalAvailable < item.quantity) {
      return {
        success: false,
        message: `Stok produk ${item.productId} tidak mencukupi`,
      };
    }

    for (const inventory of inventories) {
      if (remainingQty <= 0) break;

      const qtyToPick = Math.min(remainingQty, inventory.quantity);

      await prisma.picklistItem.create({
        data: {
          picklistId: picklist.id,
          productId: item.productId,
          locationId: inventory.locationId,
          quantity: qtyToPick,
          pickedQty: 0,
        },
      });

      remainingQty -= qtyToPick;
    }
  }

  await prisma.salesOrder.update({
    where: {
      id: salesOrderId,
    },
    data: {
      status: "PICKING",
    },
  });

  return picklist;
}

export async function updatePickedQty(
  picklistItemId: string,
  pickedQty: number,
) {
  await prisma.picklistItem.update({
    where: {
      id: picklistItemId,
    },
    data: {
      pickedQty,
    },
  });
}

export async function completePicking(picklistId: string) {
  const picklist = await prisma.picklist.findUnique({
    where: {
      id: picklistId,
    },
    include: {
      items: true,
    },
  });

  if (!picklist) {
    return {
      success: false,
      message: "Picklist not found",
    };
  }

  if (picklist.status === "COMPLETED") {
    return {
      success: false,
      message: "Picking sudah selesai",
    };
  }

  const incomplete = picklist.items.some(
    (item) => item.pickedQty < item.quantity,
  );

  if (incomplete) {
    return {
      success: false,
      message: "Masih ada item yang belum dipenuhi jumlah pick-nya",
    };
  }

  await prisma.picklist.update({
    where: {
      id: picklistId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  await prisma.salesOrder.update({
    where: {
      id: picklist.salesOrderId,
    },
    data: {
      status: "PACKING",
    },
  });
}

export async function confirmPickItem(picklistItemId: string, qty: number) {
  const item = await prisma.picklistItem.findUnique({
    where: {
      id: picklistItemId,
    },
  });

  if (!item) {
    return {
      success: false,
      message: "Picklist item tidak ditemukan",
    };
  }

  const newQty = item.pickedQty + qty;

  await prisma.picklistItem.update({
    where: {
      id: picklistItemId,
    },
    data: {
      pickedQty: newQty > item.quantity ? item.quantity : newQty,
    },
  });
}

export async function readyToShip(salesOrderId: string) {
  await prisma.salesOrder.update({
    where: {
      id: salesOrderId,
    },
    data: {
      status: "SHIPPED",
    },
  });
}

export async function shipOrder(salesOrderId: string, trackingNo: string) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.salesOrder.findUnique({
      where: {
        id: salesOrderId,
      },
      include: {
        items: true,
        picklists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Sales Order tidak ditemukan",
      };
    }

    if (order.status !== "PACKING") {
      return {
        success: false,
        message: "Sales Order belum siap untuk dikirim",
      };
    }

    const now = new Date();

    const datePart =
      String(now.getDate()).padStart(2, "0") +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getFullYear()).slice(-2);

    const randomId = crypto.randomUUID().slice(0, 6).toUpperCase();

    const trackingNumber = `TRK-${datePart}-${randomId}`;

    const shipment = await tx.shipment.create({
      data: {
        salesOrderId,
        trackingNo: trackingNumber,
        status: "SHIPPED",
        shippedAt: new Date(),
      },
    });

    for (const item of order.items) {
      const inventory = await tx.inventory.findFirst({
        where: {
          productId: item.productId,
        },
      });

      if (!inventory) {
        return {
          success: false,
          message: `Inventory untuk produk ${item.productId} tidak ditemukan`,
        };
      }

      await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      await tx.shipmentItem.create({
        data: {
          shipmentId: shipment.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          type: "OUT",
          referenceId: shipment.id,
        },
      });
    }

    await tx.salesOrder.update({
      where: {
        id: salesOrderId,
      },
      data: {
        status: "SHIPPED",
      },
    });

    return shipment;
  });
}

export async function createShipment(
  salesOrderId: string,
  trackingNo: string,
  courier: string,
) {
  const shipment = await prisma.shipment.create({
    data: {
      salesOrderId,
      trackingNo,
      courier,
      status: "SHIPPED",
      shippedAt: new Date(),
    },
  });

  await prisma.salesOrder.update({
    where: {
      id: salesOrderId,
    },
    data: {
      status: "SHIPPED",
    },
  });

  return shipment;
}

export async function markDelivered(shipmentId: string) {
  const shipment = await prisma.shipment.update({
    where: {
      id: shipmentId,
    },
    data: {
      status: "DELIVERED",
      deliveredAt: new Date(),
    },
  });

  await prisma.salesOrder.update({
    where: {
      id: shipment.salesOrderId,
    },
    data: {
      status: "COMPLETED",
    },
  });
}

export async function deleteSalesOrder(id: string) {
  const order = await prisma.salesOrder.findUnique({
    where: { id },
    include: {
      picklists: true,
      shipments: true,
    },
  });

  if (!order) {
    return {
      success: false,
      message: "Sales Order tidak ditemukan",
    };
  }

  if (order.picklists.length > 0 || order.shipments.length > 0) {
    return {
      success: false,
      message: "Sales Order sudah diproses dan tidak bisa dihapus",
    };
  }

  await prisma.salesOrder.delete({
    where: {
      id,
    },
  });

  revalidatePath("/users/outbound");

  return { success: true };
}
