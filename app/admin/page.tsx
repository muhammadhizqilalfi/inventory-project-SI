import { prisma } from "@/lib/prisma";
import WarehouseSwitcher from "../components/WarehouseSwitcher";

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

  return (
    <div className="w-full">
      {/* Header dengan Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-700">
          Dashboard Overview
        </h1>
        <WarehouseSwitcher warehouses={warehouses} />
      </div>

      {/* Cards */}
      <div className="grid w-full grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Low Stock Items",
            value: lowStockCount,
            change: "Perlu Reorder",
            color: "text-red-500",
            description: "Stok di bawah batas minimum",
          },
          {
            title: "Pending QC",
            value: pendingQCCount,
            change: "Butuh Inspeksi",
            color: "text-purple-600",
            description: "Barang di area karantina",
          },
          {
            title: "Reserved Stock",
            value: totalReserved.toLocaleString(),
            change: "Pending Outbound",
            color: "text-orange-500",
            description: "Barang sudah dipesan pelanggan",
          },
          {
            title: "Near Expiration",
            value: nearExpiryCount,
            change: "< 30 Hari",
            color: "text-yellow-600",
            description: "Batch mendekati kadaluarsa",
          },
          {
            title: "Total Products",
            value: totalProducts.toLocaleString(),
            change: "Global Catalog",
            color: "text-blue-500",
            description: "Variasi SKU aktif",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">
                {item.title}
              </p>
              <h2 className="text-3xl font-bold text-gray-800">{item.value}</h2>
            </div>
            <div className="mt-3">
              <div
                className={`text-xs font-bold ${item.color} flex items-center gap-1`}
              >
                <span>{item.change}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Visual */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-gray-700 font-semibold mb-6">
            Inbound vs Outbound Trends
          </h2>
          <div className="h-64 flex items-end justify-around gap-2 px-4">
            {[40, 60, 80, 50, 90, 30, 45].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-1 items-end w-full justify-center">
                  <div
                    className="w-4 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                    style={{ height: `${val}%` }}
                  />
                  <div
                    className="w-4 bg-gray-200 rounded-t-sm transition-all hover:bg-gray-300"
                    style={{ height: `${val - 20}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Movements */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-700 font-semibold">Live Movements</h2>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col border-b border-gray-50 pb-3 last:border-none"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-37.5">
                    {tx.product?.name}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      tx.type === "IN"
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Qty: {tx.quantity}</span>
                  <span className="italic">
                    {/* PERBAIKAN: Menggunakan tx.date, bukan tx.createdAt */}
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-10">
                Tidak ada transaksi baru
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
