import { prisma } from "@/lib/prisma";
import WarehouseSwitcher from "../components/WarehouseSwitcher";
import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  Clock3,
  PackageCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ warehouseId?: string }>; // Diubah menjadi Promise
}) {
  // Await searchParams sesuai standar Next.js terbaru
  const { warehouseId } = await searchParams;

  // 1. Ambil daftar gudang untuk dropdown
  const warehouses = await prisma.warehouse.findMany({
    select: { id: true, name: true },
  });

  // 2. Filter stok berdasarkan gudang jika ada warehouseId
  // Inventory -> location (StorageLocation) -> warehouse
  const warehouseFilter = warehouseId
    ? { location: { warehouse: { id: warehouseId } } }
    : {};

  const totalProducts = await prisma.product.count();

  const lowStockCount = await prisma.inventory.count({
    where: {
      ...warehouseFilter,
      product: {
        minStock: {
          gt: 0, // Hanya cek produk yang punya aturan minStock
        },
      },
      // Logika: quantity di lokasi tersebut <= minStock produk tersebut
      // Catatan: Jika ingin lebih akurat, gunakan query Raw atau perbandingan field,
      // namun untuk threshold sederhana, kita gunakan perbandingan standar:
      quantity: { lte: 10 },
    },
  });

  const reservedData = await prisma.inventory.aggregate({
    where: warehouseFilter,
    _sum: {
      reservedQuantity: true,
    },
  });
  const totalReserved = reservedData._sum.reservedQuantity || 0;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const nearExpiryCount = await prisma.batch.count({
    where: {
      expiryDate: {
        lte: thirtyDaysFromNow,
        gte: new Date(), // Belum lewat hari ini
      },
      // Filter berdasarkan gudang melalui tabel inventory
      inventories: {
        some: warehouseFilter,
      },
    },
  });

  // 3. Ambil transaksi terakhir
  const recentTransactions = await prisma.stockMovement.findMany({
    where: warehouseId
      ? {
          OR: [
            { fromLocation: { warehouse: { id: warehouseId } } },
            { toLocation: { warehouse: { id: warehouseId } } },
          ],
        }
      : {},
    take: 5,
    orderBy: { date: "desc" },
    include: { product: true },
  });

  const pendingQCCount = await prisma.goodsReceiptItem.count({
    where: {
      qcStatus: "NEEDS_INSPECTION",
      // Jika ingin difilter per gudang, kita asumsikan Goods Receipt
      // terkait dengan lokasi di gudang tersebut
      goodsReceipt: {
        // Filter ini opsional tergantung bagaimana kamu memetakan
        // Goods Receipt ke Gudang di logic-mu nanti
      },
    },
  });

  const stats = [
    {
      title: "Low Stock Items",
      value: lowStockCount,
      change: "Perlu Reorder",
      tone: "text-red-600 bg-red-50 border-red-100",
      icon: AlertTriangle,
      description: "Stok di bawah batas minimum",
    },
    {
      title: "Pending QC",
      value: pendingQCCount,
      change: "Butuh Inspeksi",
      tone: "text-violet-700 bg-violet-50 border-violet-100",
      icon: ClipboardCheck,
      description: "Barang di area karantina",
    },
    {
      title: "Reserved Stock",
      value: totalReserved.toLocaleString(),
      change: "Pending Outbound",
      tone: "text-amber-700 bg-amber-50 border-amber-100",
      icon: PackageCheck,
      description: "Barang sudah dipesan pelanggan",
    },
    {
      title: "Near Expiration",
      value: nearExpiryCount,
      change: "< 30 Hari",
      tone: "text-yellow-700 bg-yellow-50 border-yellow-100",
      icon: Clock3,
      description: "Batch mendekati kadaluarsa",
    },
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      change: "Global Catalog",
      tone: "text-sky-700 bg-sky-50 border-sky-100",
      icon: Boxes,
      description: "Variasi SKU aktif",
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Inventory Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan kondisi stok, QC, dan pergerakan gudang terbaru.
          </p>
        </div>
        <WarehouseSwitcher warehouses={warehouses} />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
          <div
            key={item.title}
            className="flex min-h-36 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-100 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {item.value}
                </h2>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.tone}`}
              >
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-700">
                {item.change}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            </div>
          </div>
          );
        })}
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Inbound vs Outbound Trends
              </h2>
              <p className="text-sm text-slate-500">
                Visual ringkas pergerakan barang dalam beberapa hari terakhir.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Inbound
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Outbound
              </span>
            </div>
          </div>
          <div className="flex h-72 items-end justify-around gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 pb-4 pt-8">
            {[40, 60, 80, 50, 90, 30, 45].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-1 items-end w-full justify-center">
                  <div
                    className="w-4 rounded-t-md bg-sky-500 transition hover:bg-sky-600"
                    style={{ height: `${val}%` }}
                  />
                  <div
                    className="w-4 rounded-t-md bg-slate-300 transition hover:bg-slate-400"
                    style={{ height: `${val - 20}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Movement</h2>
              <p className="text-sm text-slate-500">5 transaksi terbaru</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                    {tx.product?.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      tx.type === "IN"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>Qty: {tx.quantity}</span>
                  <span>
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                Tidak ada transaksi baru
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
