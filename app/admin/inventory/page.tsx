import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StockOnHandPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventories: {
        include: {
          location: { include: { warehouse: true } },
          batch: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-sky-700">Inventory</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Stock On Hand
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau ketersediaan stok fisik di seluruh lokasi penyimpanan.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Lokasi & Rak</th>
                <th className="px-6 py-4 font-semibold">Batch / Expired</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Stok Fisik
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  Tersedia
                </th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.flatMap((product) =>
                product.inventories.map((inv) => {
                  const available = inv.quantity - inv.reservedQuantity;
                  const isLowStock = available <= product.minStock;

                  return (
                    <tr
                      key={inv.id}
                      className="transition-colors hover:bg-sky-50/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {product.category.name} / {product.unit}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {inv.location.warehouse.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {inv.location.zone}-{inv.location.rack}-
                          {inv.location.bin}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {inv.batch ? (
                          <div>
                            <p>{inv.batch.batchNumber}</p>
                            <p className="text-[11px] text-amber-600">
                              Exp:{" "}
                              {inv.batch.expiryDate?.toLocaleDateString() ||
                                "-"}
                            </p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-900">
                        {inv.quantity}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-sm font-semibold ${
                            available < 5 ? "text-red-600" : "text-emerald-700"
                          }`}
                        >
                          {available}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isLowStock && (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-100">
                            LOW STOCK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
