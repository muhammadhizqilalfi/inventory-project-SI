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
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500 font-medium">Lokasi Gudang:</label>
      <select
        value={currentWarehouse}
        onChange={handleChange}
        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm outline-none"
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