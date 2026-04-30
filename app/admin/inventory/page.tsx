// app/admin/inventory/page.tsx
import { prisma } from "@/lib/prisma";

export default async function StockOnHandPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventories: {
        include: {
          location: { include: { warehouse: true } },
          batch: true
        }
      }
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock On Hand</h1>
          <p className="text-sm text-gray-500">Pantau ketersediaan stok fisik di seluruh lokasi penyimpanan.</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase text-gray-400 font-semibold">
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Lokasi & Rak</th>
              <th className="px-6 py-4">Batch / Expired</th>
              <th className="px-6 py-4 text-center">Stok Fisik</th>
              <th className="px-6 py-4 text-center">Tersedia</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.flatMap(product => 
              product.inventories.map((inv) => {
                const available = inv.quantity - inv.reservedQuantity;
                const isLowStock = available <= product.minStock;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category.name} • {product.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {inv.location.warehouse.name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {inv.location.zone}-{inv.location.rack}-{inv.location.bin}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {inv.batch ? (
                        <div>
                          <p>{inv.batch.batchNumber}</p>
                          <p className="text-[10px] text-orange-500">
                            Exp: {inv.batch.expiryDate?.toLocaleDateString() || '-'}
                          </p>
                        </div>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">
                      {inv.quantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${available < 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {available}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                          LOW STOCK
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}