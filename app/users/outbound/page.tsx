import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OutboundActions from "@/app/components/OutboundActions";
import { deleteSalesOrder } from "./actions";

export const dynamic = "force-dynamic";

export default async function OutboundPage() {
  const orders = await prisma.salesOrder.findMany({
    include: {
      items: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Outbound</h1>

        <Link
          href="/users/outbound/create"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          New Sales Order
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Items</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.items.length}</td>
              <td>
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
  );
}
