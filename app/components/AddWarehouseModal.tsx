"use client";
import { useState } from "react";
import { createWarehouse } from "@/app/admin/warehouses/actions";

export default function AddWarehouseButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createWarehouse(formData);
    setLoading(false);

    if (result.success) {
      setIsOpen(false); // Tutup modal jika berhasil
    } else {
      alert(result.error);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + Tambah Gudang
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tambah Gudang Baru</h2>
            
            {/* Gunakan form action */}
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Gudang</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="Contoh: Gudang Utama Jakarta" 
                  className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Lokasi Kota</label>
                <input 
                  name="location"
                  type="text" 
                  required
                  placeholder="Contoh: Jakarta Timur" 
                  className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                  {loading ? "Menyimpan..." : "Simpan Gudang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}