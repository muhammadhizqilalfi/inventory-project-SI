"use client";
import { useState } from "react";
import { createPO } from "@/app/admin/inbound/actions";

export default function POForm({ suppliers, products }: any) {
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await createPO({ supplierId, items });
    if (res.success) {
      alert("PO Berhasil Dibuat!");
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
      <h2 className="font-bold text-gray-700 border-b pb-2">Manual PO Input</h2>
      
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Supplier</label>
        <select 
          className="w-full p-2 bg-gray-50 text-gray-600 rounded border-none focus:ring-2 focus:ring-[#D32F2F]"
          onChange={(e) => setSupplierId(e.target.value)}
          required
        >
          <option value="">Pilih Supplier</option>
          {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Products</label>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <select 
              className="flex-1 p-2 bg-gray-50 text-gray-600 rounded text-sm border-none"
              onChange={(e) => {
                const n = [...items];
                n[idx].productId = e.target.value;
                setItems(n);
              }}
              required
            >
              <option value="">Pilih Produk</option>
              {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input 
              type="number" 
              className="w-20 p-2 bg-gray-50 text-gray-500 rounded text-sm border-none"
              placeholder="Qty"
              onChange={(e) => {
                const n = [...items];
                n[idx].quantity = parseInt(e.target.value);
                setItems(n);
              }}
              required
            />
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
      >
        Simpan Purchase Order
      </button>
    </form>
  );
}