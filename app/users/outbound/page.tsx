import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OutboundActions from "@/app/components/OutboundActions";
import { deleteSalesOrder } from "./actions";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";

export const dynamic = "force-dynamic";

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

export default async function OutboundPage() {
  const orders = await prisma.salesOrder.findMany({
    include: {
      items: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const summary = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: Boxes,
      tone: "text-slate-700 bg-slate-50 ring-slate-200",
    },
    {
      title: "Pending Orders",
      value: orders.filter((order) => order.status === "PENDING").length,
      icon: Clock3,
      tone: "text-amber-700 bg-amber-50 ring-amber-100",
    },
    {
      title: "Shipped Orders",
      value: orders.filter((order) => order.status === "SHIPPED").length,
      icon: Truck,
      tone: "text-blue-700 bg-blue-50 ring-blue-100",
    },
    {
      title: "Completed Orders",
      value: orders.filter((order) => order.status === "COMPLETED").length,
      icon: CheckCircle2,
      tone: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Logistics</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Outbound
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Kelola sales order, pengiriman barang, dan status outbound gudang.
          </p>
        </div>

        <Link
          href="/users/outbound/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          New Sales Order
          <ArrowUpRight size={16} />
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${item.tone}`}
                >
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {orders.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <PackageCheck size={22} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            Belum ada outbound order
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Buat sales order baru untuk mulai mencatat barang keluar.
          </p>
          <Link
            href="/users/outbound/create"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            New Sales Order
          </Link>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Sales Orders</h2>
            <p className="mt-1 text-sm text-slate-500">
              Daftar order outbound terbaru dan status pemrosesannya.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                  <th className="px-6 py-4 font-semibold">Order</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="text-sm transition-colors hover:bg-sky-50/40"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>
                      <p
                        title={order.id}
                        className="mt-1 text-xs font-medium text-slate-400"
                      >
                        ID: {order.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">
                        {order.customerName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {order.items.length} item
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {order.date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <OutboundActions
                        id={order.id}
                        deleteAction={async () => {
                          "use server";
                          const result = await deleteSalesOrder(order.id);
                          return {
                            success: result.success,
                            message: result.message ?? "",
                          };
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
