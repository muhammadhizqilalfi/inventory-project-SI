"use client";
import { useState } from "react";
import { updateProduct } from "@/app/admin/products/actions";

export default function EditProductModal({ product, categories }: { product: any, categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleEdit(formData: FormData) {
    await updateProduct(product.id, formData);
    setIsOpen(false);
  }

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-800 font-medium">
      Edit
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Edit Produk</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form action={handleEdit} className="p-6 space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Produk</label>
            <input name="name" defaultValue={product.name} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
              <select name="categoryId" defaultValue={product.categoryId} className="w-full p-2 border rounded-lg outline-none">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
              <input name="unit" defaultValue={product.unit} className="w-full p-2 border rounded-lg outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barcode</label>
            <input name="barcode" defaultValue={product.barcode || ""} className="w-full p-2 border rounded-lg outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Stock Alert</label>
            <input name="minStock" type="number" defaultValue={product.minStock} className="w-full p-2 border rounded-lg outline-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-black rounded-lg">Batal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}