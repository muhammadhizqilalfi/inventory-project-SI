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

  // Inisialisasi data item berdasarkan apa yang dipesan di PO
  const [formItems, setFormItems] = useState(
    po.items.map((item: any) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity - item.receivedQty, // Default: sisa yang belum diterima
      qcStatus: "PASSED",
      locationId: "",
    })),
  );

  const handleProcessReceipt = async () => {
    // Validasi: Lokasi harus dipilih untuk barang yang PASSED
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
      // ✅ GANTI FETCH DENGAN PEMANGGILAN SERVER ACTION LANGSUNG
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
        className="text-blue-600 hover:underline font-medium"
      >
        Terima Barang
      </button>

      {/* Backdrop & Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Proses Penerimaan Barang
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  PO ID: {po.id.substring(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-black transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6">
              {formItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-gray-50/50 items-end"
                >
                  {/* Info Produk */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Nama Produk
                    </label>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {item.productName}
                    </p>
                  </div>

                  {/* Input Qty */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Jumlah Datang
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formItems];
                        newItems[idx].quantity = parseInt(e.target.value) || 0;
                        setFormItems(newItems);
                      }}
                    />
                  </div>

                  {/* QC Status */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Status QC
                    </label>
                    <select
                      className={`w-full p-2 text-sm border rounded-lg outline-none font-bold ${
                        item.qcStatus === "PASSED"
                          ? "text-green-600"
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

                  {/* Lokasi Rak (Putaway) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Lokasi Simpan
                    </label>
                    <select
                      disabled={item.qcStatus !== "PASSED"}
                      className="w-full p-2 text-sm border rounded-lg outline-none disabled:bg-gray-200"
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

            {/* Footer Aksi */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                disabled={loading}
                onClick={handleProcessReceipt}
                className="px-8 py-2 bg-[#D32F2F] text-white rounded-xl font-bold text-sm shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
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
