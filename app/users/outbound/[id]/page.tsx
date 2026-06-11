import { prisma } from "@/lib/prisma";
import {
  completePicking,
  shipOrder,
  generatePicklist,
  updatePickedQty,
  markDelivered,
} from "../actions";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
  APPROVED: "bg-sky-50 text-sky-700 ring-sky-100",
  PICKING: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  PACKING: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  PARTIAL: "bg-orange-50 text-orange-700 ring-orange-100",
  SHIPPED: "bg-blue-50 text-blue-700 ring-blue-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
  INSPECTION: "bg-violet-50 text-violet-700 ring-violet-100",
  REJECTED: "bg-red-50 text-red-700 ring-red-100",
  CREATED: "bg-slate-100 text-slate-600 ring-slate-200",
  READY_TO_SHIP: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        statusStyles[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

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
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-950">
          Sales Order tidak ditemukan
        </h1>
        <Link
          href="/users/outbound"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Kembali ke Outbound
        </Link>
      </div>
    );
  }

  const picklist = order.picklists[0];
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/users/outbound"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-sky-700"
      >
        <ArrowLeft size={16} />
        Kembali ke Outbound
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">Sales Order</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {order.orderNumber}
            </h1>
            <p title={order.id} className="mt-1 text-sm text-slate-500">
              ID: {order.id.slice(0, 8)} · {order.customerName}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Order Date
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {order.date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Item Count
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {order.items.length} item
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Total Quantity
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {totalQuantity} unit
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Box size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Order Items</h2>
            <p className="text-sm text-slate-500">
              Produk yang tercatat pada sales order ini.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 text-center font-semibold">Qty</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Fulfilled
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.product.unit}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {item.fulfilledQty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
              <ClipboardList size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Picking</h2>
              <p className="text-sm text-slate-500">
                Generate picklist dan update qty fisik yang sudah dipilih.
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await generatePicklist(id);
            }}
          >
            <button
              disabled={!!picklist}
              className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              Generate Picklist
            </button>
          </form>
        </div>

        <div className="mt-5 space-y-5">
          {order.picklists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No picklist generated
            </div>
          ) : (
            order.picklists.map((picklist) => (
              <div
                key={picklist.id}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p title={picklist.id} className="text-sm font-semibold text-slate-800">
                    Picklist #{picklist.id.slice(0, 8)}
                  </p>
                  <StatusBadge status={picklist.status} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-white text-xs uppercase text-slate-500">
                        <th className="px-5 py-3 font-semibold">Product</th>
                        <th className="px-5 py-3 text-center font-semibold">
                          Qty
                        </th>
                        <th className="px-5 py-3 font-semibold">Picked</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {picklist.items.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="px-5 py-4 font-medium text-slate-800">
                            {item.product.name}
                          </td>
                          <td className="px-5 py-4 text-center text-slate-600">
                            {item.quantity}
                          </td>

                          <td className="px-5 py-4">
                            <form
                              className="flex max-w-xs items-center gap-2"
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
                                className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
                              />

                              <button
                                disabled={picklist.status === "COMPLETED"}
                                className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500"
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
              </div>
            ))
          )}
        </div>

        <form
          className="mt-5 flex justify-end"
          action={async () => {
            "use server";
            if (!picklist) return;
            await completePicking(picklist.id);
          }}
        >
          <button
            disabled={!picklist || picklist.status === "COMPLETED"}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            Complete Picking
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <Truck size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Shipment</h2>
            <p className="text-sm text-slate-500">
              Buat pengiriman dan tandai delivery saat barang sudah diterima.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {order.shipments.length === 0 ? (
            <form
              action={async () => {
                "use server";
                await shipOrder(id, "TRACKING-NO-123");
              }}
            >
              <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Create Shipment
              </button>
            </form>
          ) : (
            <div className="grid gap-4">
              {order.shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p title={shipment.id} className="font-semibold text-slate-900">
                        Shipment #{shipment.id.slice(0, 8)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Tracking No: {shipment.trackingNo || "-"}
                      </p>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>

                  {shipment.status === "SHIPPED" && (
                    <form
                      className="mt-4"
                      action={async () => {
                        "use server";

                        await markDelivered(shipment.id);
                      }}
                    >
                      <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        <CheckCircle2 size={16} />
                        Mark Delivered
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {order.status === "COMPLETED" && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} />
            Outbound order selesai diproses.
          </div>
        </div>
      )}
    </div>
  );
}
