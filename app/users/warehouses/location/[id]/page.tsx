import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExportButton from "@/app/components/ExportButton";

export const dynamic = "force-dynamic";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const location = await prisma.storageLocation.findUnique({
    where: { id },
    include: {
      warehouse: true,
      inventories: {
        include: {
          product: {
            include: { category: true },
          },
          batch: true,
        },
      },
    },
  });

  if (!location) {
    return notFound();
  }

  return (
    <div className="w-full space-y-6">
      <nav className="flex gap-2 text-sm text-slate-500">
        <Link href="/users/warehouses" className="hover:text-sky-700">
          Gudang
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-800">
          {location.warehouse.name}
        </span>
      </nav>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 bg-slate-50/70 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">Detail Lokasi</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {location.zone} - {location.rack}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Bin / Slot:{" "}
              <span className="font-semibold text-sky-700">{location.bin}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ExportButton
              data={location.inventories}
              fileName={`Stok_${location.zone}_${location.rack}`}
              type="inventory"
              title={`Laporan Stok: ${location.warehouse.name} - ${location.zone}`}
            />

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Total Variasi SKU
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {location.inventories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-white text-xs uppercase text-slate-500">
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Batch / Expiry</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Stok Fisik
                </th>
                <th className="px-6 py-4 text-right font-semibold">Reserved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {location.inventories.map((inv) => (
                <tr
                  key={inv.id}
                  className="transition-colors hover:bg-sky-50/40"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {inv.product.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {inv.product.barcode || "No Barcode"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {inv.product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {inv.batch ? (
                      <div>
                        <p className="font-medium text-slate-700">
                          {inv.batch.batchNumber}
                        </p>
                        <p className="text-[11px] text-amber-600">
                          Exp:{" "}
                          {inv.batch.expiryDate
                            ? new Date(
                                inv.batch.expiryDate,
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No Batch Data
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        inv.quantity <= 10 ? "text-red-600" : "text-slate-900"
                      }`}
                    >
                      {inv.quantity}
                    </span>
                    <span className="ml-1 text-[11px] text-slate-400">
                      {inv.product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-amber-700">
                    {inv.reservedQuantity}
                  </td>
                </tr>
              ))}
              {location.inventories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Lokasi ini kosong (tidak ada stok terdaftar).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
