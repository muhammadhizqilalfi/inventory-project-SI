"use client";

import { useState } from "react";
import { createStockTransfer } from "./actions";

export default function TransferForm({ locations, products }: { locations: any[], products: any[] }) {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLoc === toLoc) return alert("Lokasi asal dan tujuan tidak boleh sama!");

    const res = await createStockTransfer({
      fromLocationId: fromLoc,
      toLocationId: toLoc,
      items: items
    });

    if ('success' in res && res.success) {
      alert("Transfer Berhasil!");
      window.location.reload(); // Refresh untuk melihat perubahan stok
    } else {
      alert("Error: " + ('error' in res ? res.error : 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Asal Lokasi</label>
          <select className="w-full border p-2 rounded" onChange={(e) => setFromLoc(e.target.value)} required>
            <option value="">Pilih Asal</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.warehouse.name} - {loc.zone}{loc.rack}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tujuan Lokasi</label>
          <select className="w-full border p-2 rounded" onChange={(e) => setToLoc(e.target.value)} required>
            <option value="">Pilih Tujuan</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.warehouse.name} - {loc.zone}{loc.rack}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Pilih Barang</label>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <select 
              className="flex-1 border p-2 rounded"
              onChange={(e) => {
                const n = [...items];
                n[idx].productId = e.target.value;
                setItems(n);
              }}
              required
            >
              <option value="">Produk</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input 
              type="number" className="w-20 border p-2 rounded" placeholder="Qty"
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

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">
        Pindahkan Barang
      </button>
    </form>
  );
}