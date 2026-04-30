"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CategoryFilter({ categories }: { categories: any[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("category", id);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select 
      onChange={(e) => handleFilter(e.target.value)}
      defaultValue={searchParams.get("category") || ""}
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">Semua Kategori</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
}