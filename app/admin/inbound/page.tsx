import { prisma } from "@/lib/prisma";
import POForm from "@/app/components/POForm";
import ReceiptModal from "@/app/components/ReceiptModal";

export const dynamic = "force-dynamic";

export default async function InboundPage() {
  const suppliers = await prisma.supplier.findMany();
  const products = await prisma.product.findMany();
  
  const locations = await prisma.storageLocation.findMany({
    include: { warehouse: true }
  });

  const poList = await prisma.purchaseOrder.findMany({
    include: { 
      supplier: true, 
      items: { include: { product: true } },
      _count: { select: { items: true } } 
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-sky-700">Logistics</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Inbound Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Buat purchase order dan proses penerimaan barang ke lokasi simpan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="lg:col-span-1">
          <POForm suppliers={suppliers} products={products} />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">Daftar Purchase Order</h2>
            <p className="mt-1 text-sm text-slate-500">
              PO terbaru beserta status penerimaan barang.
            </p>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">ID PO</th>
                <th className="px-6 py-4 font-semibold">Supplier</th>
                <th className="px-6 py-4 font-semibold">Item</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {poList.map((po) => (
                <tr key={po.id} className="text-slate-600 transition-colors hover:bg-sky-50/40">
                  <td className="px-6 py-4 text-xs font-medium">{po.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{po.supplier.name}</td>
                  <td className="px-6 py-4">{po._count.items} Items</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      po.status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ReceiptModal po={po} locations={locations} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
