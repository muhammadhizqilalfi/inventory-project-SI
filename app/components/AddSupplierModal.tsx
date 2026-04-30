"use client";

import { useState } from "react";
import { createSupplier } from "@/app/admin/suppliers/actions";

export default function AddSupplierModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button 
        onClick={() => {
          setIsOpen(true);
          setError(null);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
      >
        + Tambah Supplier
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Supplier Baru</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form action={async (formData) => {
              const res = await createSupplier(formData);
              if (res?.error) {
                setError(res.error);
              } else {
                setIsOpen(false);
                setError(null);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Supplier</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                    placeholder="PT. Nama Supplier" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Kontak (Telp/Email)</label>
                  <input 
                    name="contact" 
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                    placeholder="0812... / email@provider.com" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Alamat</label>
                  <textarea 
                    name="address" 
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                    placeholder="Jl. Alamat Lengkap No. 123..." 
                    rows={3} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all"
                >
                  Simpan Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}