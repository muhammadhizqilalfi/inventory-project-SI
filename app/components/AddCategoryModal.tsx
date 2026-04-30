"use client";
import { useState } from "react";
import { addCategory } from "@/app/admin/products/category-action"; // Import action untuk tambah kategori

export default function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addCategory(formData);
    setLoading(false);
    setIsOpen(false);
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
    >
      + Kategori
    </button>
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Tambah Kategori</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kategori</label>
            <input 
              name="name" 
              required 
              autoFocus
              className="w-full p-2.5 border text-gray-600 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Contoh: Elektronik, Makanan, dll" 
            />
          </div>

          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold disabled:opacity-50"
            >
              {loading ? "Menyimpan" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}