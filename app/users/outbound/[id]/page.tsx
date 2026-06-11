import { prisma } from "@/lib/prisma";
import {
  completePicking,
  shipOrder,
  generatePicklist,
  updatePickedQty,
  markDelivered,
} from "../actions";

export default async function OutboundDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.salesOrder.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      picklists: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      shipments: true,
    },
  });

  if (!order) {
    return <div>Not Found</div>;
  }

  const picklist = order.picklists[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales Order</h1>

      <div>Status: {order.status}</div>

      <form
        action={async () => {
          "use server";
          await generatePicklist(id);
        }}
      >
        <button
          disabled={!!picklist}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
        >
          Generate Picklist
        </button>
      </form>

      <div className="rounded border p-4">
        <h2 className="mb-4 text-lg font-semibold">Picking</h2>

        {order.picklists.length === 0 ? (
          <p>No picklist generated</p>
        ) : (
          order.picklists.map((picklist) => (
            <div key={picklist.id} className="space-y-2">
              <div>Status: {picklist.status}</div>

              <table className="w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Picked</th>
                  </tr>
                </thead>

                <tbody>
                  {picklist.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>

                      <td>
                        <form
                          action={async (formData) => {
                            "use server";

                            await updatePickedQty(
                              item.id,
                              Number(formData.get("pickedQty")),
                            );
                          }}
                        >
                          <input
                            name="pickedQty"
                            type="number"
                            defaultValue={item.pickedQty}
                            disabled={picklist.status === "COMPLETED"}
                            className="border p-1"
                          />

                          <button
                            disabled={picklist.status === "COMPLETED"}
                            className="rounded bg-sky-500 px-2 py-1 text-white disabled:bg-slate-300"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <form
        action={async () => {
          "use server";
          if (!picklist) return;
          await completePicking(picklist.id);
        }}
      >
        <button
          disabled={!picklist || picklist.status === "COMPLETED"}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
        >
          Complete Picking
        </button>
      </form>

      <div className="rounded border p-4">
        <h2 className="mb-4 text-lg font-semibold">Shipment</h2>

        {order.shipments.length === 0 ? (
          <form
            action={async () => {
              "use server";
              await shipOrder(id, "TRACKING-NO-123");
            }}
          >
            <button className="rounded bg-purple-500 px-4 py-2 text-white">
              Create Shipment
            </button>
          </form>
        ) : (
          order.shipments.map((shipment) => (
            <div key={shipment.id} className="space-y-2">
              <div>Shipment #{shipment.id}</div>

              <div>Status: {shipment.status}</div>

              <div>Tracking No: {shipment.trackingNo}</div>

              {shipment.status === "SHIPPED" && (
                <form
                  action={async () => {
                    "use server";

                    await markDelivered(shipment.id);
                  }}
                >
                  <button className="rounded bg-green-500 px-4 py-2 text-white">
                    Mark Delivered
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
