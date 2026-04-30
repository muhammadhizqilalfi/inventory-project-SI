import { prisma } from "@/lib/prisma";
import AddSupplierModal from "@/app/components/AddSupplierModal";
import SupplierAction from "@/app/components/SupplierActions";

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
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Supplier</h1>
          <p className="text-sm text-gray-500">
            Manajemen mitra pemasok barang inventaris
          </p>
        </div>
        <AddSupplierModal />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-400">
              <th className="px-6 py-4 font-semibold">Nama Supplier</th>
              <th className="px-6 py-4 font-semibold">Kontak / Info</th>
              <th className="px-6 py-4 font-semibold">Alamat</th>
              <th className="px-6 py-4 font-semibold text-center">
                Total Pesanan (PO)
              </th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{supplier.name}</p>
                  <p className="text-xs text-gray-400 tracking-tight">
                    ID: {supplier.id.slice(0, 8)}...
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {supplier.contact || (
                    <span className="text-gray-300 italic">
                      Tidak ada kontak
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {supplier.address || "-"}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
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
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Belum ada supplier yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
