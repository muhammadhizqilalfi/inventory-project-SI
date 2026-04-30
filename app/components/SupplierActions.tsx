"use client";

import { useState } from "react";
import { updateSupplier, deleteSupplier } from "@/app/admin/suppliers/actions";

interface Supplier {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
}

export default function SupplierActions({ supplier }: { supplier: Supplier }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteSupplier(supplier.id);
    
    if (res?.error) {
      alert(res.error);
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex justify-end gap-4">
      {/* --- TRIGGER EDIT --- */}
      <button 
        onClick={() => setShowEditModal(true)}
        className="text-blue-500 hover:text-blue-700 font-medium text-xs transition-colors"
      >
        Edit
      </button>

      {/* --- TRIGGER DELETE --- */}
      <button 
        onClick={() => setShowDeleteModal(true)}
        className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
      >
        Hapus
      </button>

      {/* --- MODAL EDIT --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4 text-left">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Edit Supplier</h2>
            <p className="text-xs text-gray-500 mb-6 font-mono">ID: {supplier.id}</p>
            
            <form action={async (formData) => {
              const res = await updateSupplier(supplier.id, formData);
              if (res.success) setShowEditModal(false);
              else alert(res.error);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nama Supplier</label>
                  <input 
                    name="name" 
                    required 
                    defaultValue={supplier.name}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Kontak</label>
                  <input 
                    name="contact" 
                    defaultValue={supplier.contact || ""}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Alamat</label>
                  <textarea 
                    name="address" 
                    defaultValue={supplier.address || ""}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50" 
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 transition-all">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE (Style Konfirmasi) --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.632c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-800">{supplier.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Supplier"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full sm:flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}