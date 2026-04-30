"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/admin/products/actions";
import EditProductModal from "./EditProductModal";

export default function ProductActions({ product, categories }: { product: any, categories: any[] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting product';
      alert(message); // Bisa diganti dengan toast notification nanti
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex justify-end gap-3">
      <EditProductModal product={product} categories={categories} />
      
      {/* Tombol Pemicu Modal Hapus */}
      <button 
        onClick={() => setShowDeleteModal(true)}
        className="text-red-500 hover:text-red-700 font-medium transition-colors"
      >
        Hapus
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              {/* Icon Peringatan */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.632c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500 mt-2">
                Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-800">{product.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Produk"}
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