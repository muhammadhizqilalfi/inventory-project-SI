"use client";

import { useState } from "react";
import { completeOpname } from "@/app/admin/opname/actions";
import { useRouter } from "next/navigation";

export default function OpnameDetailForm({ opname }: { opname: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState(
    opname.items.map((item: any) => ({
      inventoryId: item.inventoryId,
      actualQty: item.actualQty,
      systemQty: item.systemQty,
      productName: item.inventory.product.name,
      locationName: `${item.inventory.location.zone}-${item.inventory.location.rack}`,
    })),
  );

  const handleQtyChange = (inventoryId: string, val: string) => {
    const newVal = parseInt(val) || 0;
    setItems(
      items.map((item: any) =>
        item.inventoryId === inventoryId
          ? { ...item, actualQty: newVal }
          : item,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!confirm("Selesaikan opname? Stok akan disesuaikan secara otomatis."))
      return;

    setIsSubmitting(true);
    const result = await completeOpname(opname.id, items);

    if (result.success) {
      router.push("/admin/opname");
      router.refresh();
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk & Lokasi</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Qty Sistem
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  Qty Fisik (Aktual)
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  Selisih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item: any) => {
                const diff = item.actualQty - item.systemQty;
                return (
                  <tr key={item.inventoryId} className="text-sm">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {item.locationName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-500">
                      {item.systemQty}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        value={item.actualQty}
                        disabled={
                          opname.status === "COMPLETED" || isSubmitting
                        }
                        onChange={(e) =>
                          handleQtyChange(item.inventoryId, e.target.value)
                        }
                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`font-semibold ${
                          diff === 0
                            ? "text-slate-400"
                            : diff > 0
                              ? "text-emerald-700"
                              : "text-red-600"
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {opname.status === "PENDING" && (
        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-sky-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Selesaikan & Sesuaikan Stok"}
          </button>
        </div>
      )}
    </div>
  );
}
