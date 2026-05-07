"use client";

import { useState, useEffect } from "react";
import { createStockTransfer, getProductsByLocation } from "./actions";

// PERBAIKAN: Interface disesuaikan dengan return value dari getProductsByLocation
interface AvailableProduct {
  productId: string; // Mengubah 'id' menjadi 'productId'
  name: string;
  availableQty: number;
  batchId: string | null;
}

export default function TransferForm({ locations }: { locations: any[] }) {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [items, setItems] = useState([{ productId: "", quantity: 1, batchId: "" }]);

  useEffect(() => {
    async function updateProducts() {
      if (!fromLoc) {
        setAvailableProducts([]);
        setItems([{ productId: "", quantity: 1, batchId: "" }]);
        return;
      }
      
      const productsInLocation = await getProductsByLocation(fromLoc);
      // Data sekarang sinkron karena interface sudah menggunakan 'productId'
      setAvailableProducts(productsInLocation);
      setItems([{ productId: "", quantity: 1, batchId: "" }]);
    }
    
    updateProducts();
  }, [fromLoc]);

  const addItem = () => setItems([...items, { productId: "", quantity: 1, batchId: "" }]);
  
  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLoc === toLoc) return alert("Lokasi asal dan tujuan tidak boleh sama!");

    for (const item of items) {
      // PERBAIKAN: Menggunakan productId untuk pencarian
      const matched = availableProducts.find(p => p.productId === item.productId);
      if (matched && item.quantity > matched.availableQty) {
        alert(`Jumlah transfer untuk ${matched.name} melebihi stok tersedia (${matched.availableQty} unit)!`);
        return;
      }
    }

    setLoading(true);
    const res = await createStockTransfer({
      fromLocationId: fromLoc,
      toLocationId: toLoc,
      items: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        batchId: i.batchId || null
      }))
    });

    setLoading(false);

    if (res.success) {
      alert("Transfer Berhasil!");
      window.location.reload();
    } else {
      alert("Error: " + (res.error || "Gagal memproses transfer"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-bold text-gray-800 text-lg">Buat Stock Transfer</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Asal Lokasi (Source)</label>
          <select 
            className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none" 
            value={fromLoc}
            onChange={(e) => setFromLoc(e.target.value)} 
            required
          >
            <option value="">-- Pilih Lokasi Asal --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.warehouse.name} - {loc.zone}/{loc.rack}/{loc.bin}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tujuan Lokasi (Destination)</label>
          <select 
            className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none" 
            value={toLoc}
            onChange={(e) => setToLoc(e.target.value)} 
            required
          >
            <option value="">-- Pilih Lokasi Tujuan --</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.warehouse.name} - {loc.zone}/{loc.rack}/{loc.bin}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Yang Ingin Dipindahkan</label>
          <button 
            type="button" 
            disabled={!fromLoc}
            onClick={addItem} 
            className="text-blue-600 text-xs font-bold hover:underline disabled:opacity-40"
          >
            + Tambah Baris
          </button>
        </div>

        {!fromLoc && (
          <p className="text-xs text-gray-400 italic py-2 text-center">Silakan pilih lokasi asal terlebih dahulu untuk memuat produk yang tersedia.</p>
        )}

        {fromLoc && availableProducts.length === 0 && (
          <p className="text-xs text-red-500 italic py-2 text-center">Tidak ada produk dengan stok aktif di lokasi asal ini.</p>
        )}

        {fromLoc && availableProducts.length > 0 && items.map((item, idx) => {
          // PERBAIKAN: Menggunakan productId untuk mencocokkan produk terpilih
          const selectedProd = availableProducts.find(p => p.productId === item.productId);
          return (
            <div key={idx} className="flex gap-3 items-end bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              
              <div className="flex-1">
                <label className="block text-[9px] font-semibold text-gray-400 uppercase mb-1">Produk</label>
                <select 
                  className="w-full bg-white border rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                  value={item.productId}
                  onChange={(e) => {
                    const matched = availableProducts.find(p => p.productId === e.target.value);
                    const n = [...items];
                    n[idx].productId = e.target.value;
                    n[idx].batchId = matched?.batchId || "";
                    setItems(n);
                  }}
                  required
                >
                  <option value="">Pilih Produk...</option>
                  {availableProducts.map((p) => (
                    // PERBAIKAN: Key unik menggunakan productId + batchId untuk menghindari duplikasi key
                    <option key={`${p.productId}-${p.batchId}`} value={p.productId}>
                      {p.name} {p.batchId ? `(Batch: ${p.batchId})` : "(No Batch)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-28">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[9px] font-semibold text-gray-400 uppercase">Qty</label>
                  {selectedProd && (
                    <span className="text-[9px] font-bold text-gray-500">Stok: {selectedProd.availableQty}</span>
                  )}
                </div>
                <input 
                  type="number" 
                  min="1"
                  max={selectedProd ? selectedProd.availableQty : undefined}
                  className="w-full bg-white border rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-600 outline-none" 
                  placeholder="0"
                  value={item.quantity}
                  onChange={(e) => {
                    const n = [...items];
                    n[idx].quantity = parseInt(e.target.value) || 1;
                    setItems(n);
                  }}
                  required 
                />
              </div>

              {items.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeItem(idx)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors h-10 flex items-center justify-center border border-gray-200 bg-white"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button 
        type="submit" 
        disabled={loading || !fromLoc || availableProducts.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? "Memproses Pemindahan..." : "Pindahkan Barang"}
      </button>
    </form>
  );
}