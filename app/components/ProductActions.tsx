"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/admin/products/actions";
import EditProductModal from "./EditProductModal";

export default function ProductActions({
  product,
  categories,
}: {
  product: any;
  categories: any[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error deleting product";
      alert(message);
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex justify-end gap-2">
      <EditProductModal product={product} categories={categories} />

      <button
        onClick={() => setShowDeleteModal(true)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
      >
        Hapus
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
                !
              </div>

              <h3 className="text-lg font-semibold text-slate-950">
                Konfirmasi Hapus
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hapus{" "}
                <span className="font-semibold text-slate-800">
                  {product.name}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
