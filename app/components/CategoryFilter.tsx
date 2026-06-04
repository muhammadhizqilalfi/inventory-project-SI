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
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 md:w-auto"
    >
      <option value="">Semua Kategori</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
}
