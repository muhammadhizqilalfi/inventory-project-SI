import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StartOpnameButton from "@/app/components/StartOpnameButton";

export default async function StockOpnamePage() {
  const opnames = await prisma.stockOpname.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock Opname</h1>
          <p className="text-sm text-gray-500">Koreksi stok fisik secara berkala.</p>
        </div>
        <StartOpnameButton />
      </div>

      <div className="grid gap-4">
        {opnames.map((opname) => (
          <div key={opname.id} className="bg-white p-4 border rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-gray-800">Sesi Opname #{opname.id.slice(0,8)}</p>
              <p className="text-xs text-gray-400">{opname.date.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">Item Dihitung</p>
                <p className="text-sm font-bold">{opname._count.items} SKU</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                opname.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {opname.status}
              </span>
              <Link href={`/admin/opname/${opname.id}`} className="text-blue-600 font-bold text-xs hover:underline">
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
        {opnames.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
            <p className="text-gray-400">Belum ada riwayat opname.</p>
          </div>
        )}
      </div>
    </div>
  );
}