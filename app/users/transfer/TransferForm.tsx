"use client";

import { useState, useEffect } from "react";
import { createStockTransfer, getProductsByLocation } from "./actions";

interface AvailableProduct {
  productId: string;
  name: string;
  availableQty: number;
  batchId: string | null;
}

export default function TransferForm({ locations }: { locations: any[] }) {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [loading, setLoading] = useState(false);

  const [availableProducts, setAvailableProducts] = useState<
    AvailableProduct[]
  >([]);
  const [items, setItems] = useState([
    { productId: "", quantity: 1, batchId: "" },
  ]);

  useEffect(() => {
    async function updateProducts() {
      if (!fromLoc) {
        setAvailableProducts([]);
        setItems([{ productId: "", quantity: 1, batchId: "" }]);
        return;
      }

      const productsInLocation = await getProductsByLocation(fromLoc);
      setAvailableProducts(productsInLocation);
      setItems([{ productId: "", quantity: 1, batchId: "" }]);
    }

    updateProducts();
  }, [fromLoc]);

  const addItem = () =>
    setItems([...items, { productId: "", quantity: 1, batchId: "" }]);

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLoc === toLoc)
      return alert("Lokasi asal dan tujuan tidak boleh sama!");

    for (const item of items) {
      const matched = availableProducts.find(
        (p) => p.productId === item.productId,
      );
      if (matched && item.quantity > matched.availableQty) {
        alert(
          `Jumlah transfer untuk ${matched.name} melebihi stok tersedia (${matched.availableQty} unit)!`,
        );
        return;
      }
    }

    setLoading(true);
    const res = await createStockTransfer({
      fromLocationId: fromLoc,
      toLocationId: toLoc,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        batchId: i.batchId || null,
      })),
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
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Buat Stock Transfer
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pilih lokasi asal, tujuan, lalu item yang akan dipindahkan.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Asal Lokasi (Source)
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            value={fromLoc}
            onChange={(e) => setFromLoc(e.target.value)}
            required
          >
            <option value="">Pilih Lokasi Asal</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.warehouse.name} - {loc.zone}/{loc.rack}/{loc.bin}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tujuan Lokasi (Destination)
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            value={toLoc}
            onChange={(e) => setToLoc(e.target.value)}
            required
          >
            <option value="">Pilih Lokasi Tujuan</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.warehouse.name} - {loc.zone}/{loc.rack}/{loc.bin}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-semibold text-slate-800">
            Item Yang Ingin Dipindahkan
          </label>
          <button
            type="button"
            disabled={!fromLoc}
            onClick={addItem}
            className="text-left text-sm font-semibold text-sky-700 transition hover:text-sky-900 disabled:opacity-40"
          >
            + Tambah Baris
          </button>
        </div>

        {!fromLoc && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Pilih lokasi asal terlebih dahulu untuk memuat produk yang tersedia.
          </p>
        )}

        {fromLoc && availableProducts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-red-100 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            Tidak ada produk dengan stok aktif di lokasi asal ini.
          </p>
        )}

        {fromLoc &&
          availableProducts.length > 0 &&
          items.map((item, idx) => {
            const selectedProd = availableProducts.find(
              (p) => p.productId === item.productId,
            );
            return (
              <div
                key={idx}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[1fr_140px_44px]"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                    Produk
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    value={item.productId}
                    onChange={(e) => {
                      const matched = availableProducts.find(
                        (p) => p.productId === e.target.value,
                      );
                      const n = [...items];
                      n[idx].productId = e.target.value;
                      n[idx].batchId = matched?.batchId || "";
                      setItems(n);
                    }}
                    required
                  >
                    <option value="">Pilih Produk...</option>
                    {availableProducts.map((p) => (
                      <option
                        key={`${p.productId}-${p.batchId}`}
                        value={p.productId}
                      >
                        {p.name} {p.batchId ? `(Batch: ${p.batchId})` : "(No Batch)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase text-slate-400">
                      Qty
                    </label>
                    {selectedProd && (
                      <span className="text-xs font-semibold text-slate-500">
                        Stok: {selectedProd.availableQty}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={selectedProd ? selectedProd.availableQty : undefined}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
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
                    className="flex h-11 w-full items-center justify-center self-end rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-red-50 hover:text-red-600 md:w-11"
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <button
        type="submit"
        disabled={loading || !fromLoc || availableProducts.length === 0}
        className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? "Memproses Pemindahan..." : "Pindahkan Barang"}
      </button>
    </form>
  );
}
