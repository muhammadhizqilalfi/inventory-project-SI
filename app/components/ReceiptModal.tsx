"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processReceipt } from "@/app/admin/inbound/actions";

interface ReceiptModalProps {
  po: any;
  locations: any[];
}

export default function ReceiptModal({ po, locations }: ReceiptModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formItems, setFormItems] = useState(
    po.items.map((item: any) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity - item.receivedQty,
      qcStatus: "PASSED",
      locationId: "",
    })),
  );

  const handleProcessReceipt = async () => {
    const invalidItem = formItems.find(
      (i: { qcStatus: string; locationId: any }) =>
        i.qcStatus === "PASSED" && !i.locationId,
    );

    if (invalidItem) {
      alert(`Mohon pilih lokasi simpan untuk ${invalidItem.productName}`);
      return;
    }

    setLoading(true);
    try {
      const result = await processReceipt({
        poId: po.id,
        items: formItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          qcStatus: item.qcStatus,
          locationId: item.locationId,
        })),
      });

      if (result.success) {
        alert("Penerimaan barang berhasil diproses!");
        setIsOpen(false);
        router.refresh();
      } else {
        const errorMessage =
          "error" in result
            ? result.error
            : "Terjadi kesalahan tidak diketahui";
        alert("Gagal: " + errorMessage);
      }
    } catch (error) {
      console.error("Error processing receipt:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
      >
        Terima Barang
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Proses Penerimaan Barang
                </h2>
                <p className="mt-1 text-xs font-medium uppercase text-slate-400">
                  PO ID: {po.id.substring(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                x
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-6">
              {formItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 items-end gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-4"
                >
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Nama Produk
                    </label>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.productName}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Jumlah Datang
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formItems];
                        newItems[idx].quantity = parseInt(e.target.value) || 0;
                        setFormItems(newItems);
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Status QC
                    </label>
                    <select
                      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 ${
                        item.qcStatus === "PASSED"
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                      value={item.qcStatus}
                      onChange={(e) => {
                        const newItems = [...formItems];
                        newItems[idx].qcStatus = e.target.value;
                        setFormItems(newItems);
                      }}
                    >
                      <option value="PASSED">PASSED (Lolos)</option>
                      <option value="FAILED">FAILED (Gagal)</option>
                      <option value="NEEDS_INSPECTION">INSPEKSI</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                      Lokasi Simpan
                    </label>
                    <select
                      disabled={item.qcStatus !== "PASSED"}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
                      value={item.locationId}
                      onChange={(e) => {
                        const newItems = [...formItems];
                        newItems[idx].locationId = e.target.value;
                        setFormItems(newItems);
                      }}
                    >
                      <option value="">Pilih Rak...</option>
                      {locations.map((loc: any) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.warehouse.name} - {loc.zone}/{loc.rack}/{loc.bin}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                disabled={loading}
                onClick={handleProcessReceipt}
                className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Konfirmasi Penerimaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
