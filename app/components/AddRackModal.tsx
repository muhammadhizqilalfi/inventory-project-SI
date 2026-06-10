"use client";

import { useState } from "react";
import { createLocation } from "@/app/admin/warehouses/actions";

export default function AddRackButton({
  warehouseId,
  warehouseName,
}: {
  warehouseId: string;
  warehouseName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createLocation(formData);
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-sky-700"
      >
        + Tambah Lokasi Rak
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Tambah Lokasi Rak
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Gudang: {warehouseName}
              </p>
            </div>

            <form action={handleSubmit} className="space-y-4 p-6">
              <input type="hidden" name="warehouseId" value={warehouseId} />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Zona
                </label>
                <input
                  name="zone"
                  type="text"
                  required
                  placeholder="Contoh: Cold Storage / Zone A"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rak
                  </label>
                  <input
                    name="rack"
                    type="text"
                    required
                    placeholder="R-01"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bin / Slot
                  </label>
                  <input
                    name="bin"
                    type="text"
                    required
                    placeholder="B-10"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
