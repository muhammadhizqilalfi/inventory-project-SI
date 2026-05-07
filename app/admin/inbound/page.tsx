import { prisma } from "@/lib/prisma";
import POForm from "@/app/components/POForm";
import ReceiptModal from "@/app/components/ReceiptModal";

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
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Inbound Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <POForm suppliers={suppliers} products={products} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold mb-4 text-gray-700">Daftar Purchase Order</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3">ID PO</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Item</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {poList.map((po) => (
                <tr key={po.id} className="border-b text-gray-600">
                  <td className="p-3 font-mono text-xs">{po.id.substring(0, 8)}</td>
                  <td className="p-3 font-medium">{po.supplier.name}</td>
                  <td className="p-3">{po._count.items} Items</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      po.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <ReceiptModal po={po} locations={locations} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}