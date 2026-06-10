"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function WarehouseSwitcher({ warehouses }: { warehouses: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWarehouse = searchParams.get("warehouseId") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id) {
      router.push(`/admin?warehouseId=${id}`);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label className="text-sm font-medium text-slate-500">Lokasi Gudang</label>
      <select
        value={currentWarehouse}
        onChange={handleChange}
        className="block rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
      >
        <option value="">Semua Gudang</option>
        {warehouses.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
