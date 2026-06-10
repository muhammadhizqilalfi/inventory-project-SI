export default function StockMovementReportPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-sky-700">Reports</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Stock Movement
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan laporan pergerakan stok inbound, outbound, dan transfer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Inbound", "Outbound", "Transfer"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Area laporan siap digunakan untuk memantau movement gudang.
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        Modul laporan movement mengikuti navigasi yang sudah tersedia.
      </div>
    </div>
  );
}
