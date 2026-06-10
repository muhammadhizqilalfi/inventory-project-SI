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
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 className="font-semibold text-slate-900">Manual PO Input</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pilih supplier dan barang yang akan dipesan.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Supplier
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            <option value="">Pilih Supplier</option>
            {suppliers.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Products
          </label>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_88px] gap-2">
              <select
                className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                onChange={(e) => {
                  const n = [...items];
                  n[idx].productId = e.target.value;
                  setItems(n);
                }}
                required
              >
                <option value="">Pilih Produk</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
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
          className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          Simpan Purchase Order
        </button>
      </div>
    </form>
  );
}
