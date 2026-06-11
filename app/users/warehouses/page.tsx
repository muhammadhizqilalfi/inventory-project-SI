import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddWarehouseButton from "@/app/components/AddWarehouseModal";
import AddRackButton from "@/app/components/AddRackModal";

export const dynamic = "force-dynamic";

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
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Master Data</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Manajemen Gudang
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola hierarki gudang, zona, dan rak penyimpanan.
          </p>
        </div>
        <AddWarehouseButton />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {warehouse.name}
                </h2>
                <p className="text-sm text-slate-500">{warehouse.location}</p>
              </div>
              <div className="flex gap-4 text-sm sm:text-right">
                <div>
                  <span className="block text-2xl font-semibold text-slate-950">
                    {warehouse._count.locations}
                  </span>
                  <span className="text-slate-500">Total Titik Lokasi</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-white text-xs uppercase text-slate-500">
                    <th className="px-6 py-3 font-semibold">Zona</th>
                    <th className="px-6 py-3 font-semibold">Rak</th>
                    <th className="px-6 py-3 font-semibold">Bin / Slot</th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Total SKU
                    </th>
                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warehouse.locations.map((loc) => {
                    const totalQty = loc.inventories.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
                    return (
                      <tr
                        key={loc.id}
                        className="transition-colors hover:bg-sky-50/40"
                      >
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold uppercase text-sky-700 ring-1 ring-sky-100">
                            {loc.zone || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {loc.rack || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {loc.bin || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {totalQty}{" "}
                              <span className="text-[10px] font-normal text-slate-400">
                                PCS
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {loc._count.inventories} SKU
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/users/warehouses/location/${loc.id}`}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
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
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        Belum ada lokasi rak yang terdaftar di gudang ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-right">
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
