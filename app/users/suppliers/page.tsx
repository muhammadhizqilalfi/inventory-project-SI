import { prisma } from "@/lib/prisma";
import AddSupplierModal from "@/app/components/AddSupplierModal";
import SupplierAction from "@/app/components/SupplierActions";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      _count: {
        select: { purchaseOrders: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Master Data</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Daftar Supplier
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manajemen mitra pemasok barang inventaris
          </p>
        </div>
        <AddSupplierModal />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <th className="px-6 py-4 font-semibold">Nama Supplier</th>
              <th className="px-6 py-4 font-semibold">Kontak / Info</th>
              <th className="px-6 py-4 font-semibold">Alamat</th>
              <th className="px-6 py-4 font-semibold text-center">
                Total Pesanan (PO)
              </th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="transition-colors hover:bg-sky-50/40"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{supplier.name}</p>
                  <p className="text-xs text-slate-400">
                    ID: {supplier.id.slice(0, 8)}...
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {supplier.contact || (
                    <span className="text-slate-400">
                      Tidak ada kontak
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="line-clamp-1 text-sm text-slate-700">
                    {supplier.address || "-"}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    {supplier._count.purchaseOrders} PO
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <SupplierAction supplier={supplier} />
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Belum ada supplier yang terdaftar.
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
