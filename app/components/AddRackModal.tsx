"use client";
import { useState } from "react";
import { createLocation } from "@/app/admin/warehouses/actions";

export default function AddRackButton({ warehouseId, warehouseName }: { warehouseId: string, warehouseName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createLocation(formData);
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        + Tambah Lokasi Rak
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl text-left">
            <h2 className="text-xl font-bold text-gray-800">Tambah Lokasi Rak</h2>
            <p className="text-sm text-gray-500 mb-4">Gudang: {warehouseName}</p>
            
            <form action={handleSubmit} className="space-y-4">
              {/* Hidden input untuk melempar ID gudang */}
              <input type="hidden" name="warehouseId" value={warehouseId} />
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Zona (Contoh: Cold Storage / Zone A)</label>
                <input name="zone" type="text" required className="w-full border p-2 rounded-lg mt-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Rak (Contoh: R-01)</label>
                  <input name="rack" type="text" required className="w-full border p-2 rounded-lg mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Bin / Slot (Contoh: B-10)</label>
                  <input name="bin" type="text" required className="w-full border p-2 rounded-lg mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Lokasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}