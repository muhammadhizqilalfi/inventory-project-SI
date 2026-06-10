import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StartOpnameButton from "@/app/components/StartOpnameButton";

export const dynamic = "force-dynamic";

export default async function StockOpnamePage() {
  const opnames = await prisma.stockOpname.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Inventory</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Stock Opname
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Koreksi stok fisik secara berkala.
          </p>
        </div>
        <StartOpnameButton />
      </div>

      <div className="grid gap-4">
        {opnames.map((opname) => (
          <div key={opname.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">Sesi Opname #{opname.id.slice(0,8)}</p>
              <p className="mt-1 text-xs text-slate-400">{opname.date.toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase text-slate-400">Item Dihitung</p>
                <p className="text-sm font-semibold text-slate-800">{opname._count.items} SKU</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                opname.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
              }`}>
                {opname.status}
              </span>
              <Link href={`/admin/opname/${opname.id}`} className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50">
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
        {opnames.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-slate-400">Belum ada riwayat opname.</p>
          </div>
        )}
      </div>
    </div>
  );
}
