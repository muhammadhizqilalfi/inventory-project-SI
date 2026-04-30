import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddWarehouseButton from "@/app/components/AddWarehouseModal";
import AddRackButton from "@/app/components/AddRackModal";

export default async function WarehousePage() {
  // Mengambil data gudang beserta jumlah lokasi rak di dalamnya
  const warehouses = await prisma.warehouse.findMany({
    include: {
      _count: {
        select: { locations: true },
      },
      locations: {
        include: {
          inventories: true,
          _count: {
            select: { inventories: true },
          },
        },
      },
    },
  });
  

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Gudang</h1>
          <p className="text-sm text-gray-500">
            Kelola hierarki gudang, zona, dan rak penyimpanan.
          </p>
        </div>
        <AddWarehouseButton />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Warehouse Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {warehouse.name}
                </h2>
                <p className="text-sm text-gray-500">{warehouse.location}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <span className="block font-bold text-gray-700">
                    {warehouse._count.locations}
                  </span>
                  <span className="text-gray-500">Total Titik Lokasi</span>
                </div>
              </div>
            </div>

            {/* Storage Locations Table (The Hierarchy) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 bg-white border-b">
                    <th className="px-6 py-3 font-semibold">Zona</th>
                    <th className="px-6 py-3 font-semibold">Rak</th>
                    <th className="px-6 py-3 font-semibold">Bin / Slot</th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Total SKU
                    </th>
                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {warehouse.locations.map((loc) => {
                    const totalQty = loc.inventories.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
                    return (
                      <tr
                        key={loc.id}
                        className="hover:bg-blue-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                            {loc.zone || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {loc.rack || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {loc.bin || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">
                              {totalQty}{" "}
                              <span className="text-[10px] text-gray-400 font-normal underline">
                                PCS
                              </span>
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {loc._count.inventories} SKU
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/warehouses/location/${loc.id}`}
                            className="text-blue-600 hover:underline text-xs font-bold"
                          >
                            Detail Stok
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {warehouse.locations.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-400 text-sm"
                      >
                        Belum ada lokasi rak yang terdaftar di gudang ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <AddRackButton
                warehouseId={warehouse.id}
                warehouseName={warehouse.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
