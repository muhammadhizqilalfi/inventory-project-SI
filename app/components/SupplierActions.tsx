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
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setShowEditModal(true)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
      >
        Edit
      </button>

      <button
        onClick={() => setShowDeleteModal(true)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
      >
        Hapus
      </button>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 text-left backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Edit Supplier
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                ID: {supplier.id}
              </p>
            </div>

            <form
              className="p-6"
              action={async (formData) => {
                const res = await updateSupplier(supplier.id, formData);
                if (res.success) setShowEditModal(false);
                else alert(res.error);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nama Supplier
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={supplier.name}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kontak
                  </label>
                  <input
                    name="contact"
                    defaultValue={supplier.contact || ""}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    defaultValue={supplier.address || ""}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  {supplier.name}
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
                {isDeleting ? "Menghapus..." : "Hapus Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
