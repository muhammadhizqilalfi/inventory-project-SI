import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExportButton from "@/app/components/ExportButton";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Params adalah Promise di Next.js terbaru
}) {
  const { id } = await params;

  // Ambil data lokasi beserta inventori di dalamnya
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
    <div className="w-full p-6">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-4 gap-2">
        <Link href="/admin/warehouses" className="hover:text-blue-600">
          Gudang
        </Link>
        <span>&gt;</span>
        <span className="text-gray-800 font-medium">
          {location.warehouse.name}
        </span>
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Info */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Detail Lokasi: {location.zone} - {location.rack}
              </h1>
              <p className="text-gray-500">
                Bin / Slot:{" "}
                <span className="font-mono font-bold text-blue-600">
                  {location.bin}
                </span>
              </p>
            </div>

            {/* Perbaikan di sini: Cukup kirim data dan type */}
            <div className="flex items-center gap-4">
              <ExportButton
                data={location.inventories}
                fileName={`Stok_${location.zone}_${location.rack}`}
                type="inventory"
                title={`Laporan Stok: ${location.warehouse.name} - ${location.zone}`}
              />

              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-center">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Total Variasi SKU
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {location.inventories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Barang di Lokasi Ini */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b text-xs uppercase text-gray-400">
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Batch / Expiry</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Stok Fisik
                </th>
                <th className="px-6 py-4 font-semibold text-right">Reserved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {location.inventories.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      {inv.product.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {inv.product.barcode || "No Barcode"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {inv.product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {inv.batch ? (
                      <div>
                        <p className="font-medium text-gray-700">
                          {inv.batch.batchNumber}
                        </p>
                        <p className="text-[10px] text-red-500">
                          Exp:{" "}
                          {inv.batch.expiryDate
                            ? new Date(
                                inv.batch.expiryDate,
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No Batch Data
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-bold ${inv.quantity <= 10 ? "text-red-500" : "text-gray-800"}`}
                    >
                      {inv.quantity}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1 font-normal">
                      {inv.product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-orange-600 font-medium">
                    {inv.reservedQuantity}
                  </td>
                </tr>
              ))}
              {location.inventories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <p>Lokasi ini kosong (tidak ada stok terdaftar).</p>
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
