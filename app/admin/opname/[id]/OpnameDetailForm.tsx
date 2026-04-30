"use client";

import { useState } from "react";
import { completeOpname } from "@/app/admin/opname/actions";
import { useRouter } from "next/navigation";

export default function OpnameDetailForm({ opname }: { opname: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Simpan data input dalam state
  const [items, setItems] = useState(
    opname.items.map((item: any) => ({
      inventoryId: item.inventoryId,
      actualQty: item.actualQty,
      systemQty: item.systemQty,
      productName: item.inventory.product.name,
      locationName: `${item.inventory.location.zone}-${item.inventory.location.rack}`,
    }))
  );

  const handleQtyChange = (inventoryId: string, val: string) => {
    const newVal = parseInt(val) || 0;
    setItems(items.map((item: any) => 
      item.inventoryId === inventoryId ? { ...item, actualQty: newVal } : item
    ));
  };

  const handleSubmit = async () => {
    if (!confirm("Selesaikan opname? Stok akan disesuaikan secara otomatis.")) return;
    
    setIsSubmitting(true);
    const result = await completeOpname(opname.id, items);
    
    if (result.success) {
      router.push("/admin/opname");
      router.refresh();
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">Produk & Lokasi</th>
              <th className="px-6 py-4 text-center">Qty Sistem</th>
              <th className="px-6 py-4 text-center">Qty Fisik (Aktual)</th>
              <th className="px-6 py-4 text-center">Selisih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any) => {
              const diff = item.actualQty - item.systemQty;
              return (
                <tr key={item.inventoryId} className="text-sm">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.locationName}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-gray-500">
                    {item.systemQty}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      value={item.actualQty}
                      disabled={opname.status === "COMPLETED" || isSubmitting}
                      onChange={(e) => handleQtyChange(item.inventoryId, e.target.value)}
                      className="w-20 border rounded-md p-1 text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${diff === 0 ? 'text-gray-400' : diff > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {opname.status === "PENDING" && (
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-sm font-bold text-gray-500"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-sm font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Selesaikan & Sesuaikan Stok"}
          </button>
        </div>
      )}
    </div>
  );
}