import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  Database,
  FileText,
  Handshake,
  Layers3,
  LineChart,
  PackageCheck,
  Repeat2,
  ShieldCheck,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

const features = [
  {
    title: "Produk & Kategori",
    description: "Kelola SKU, barcode, satuan, kategori, dan batas minimum stok.",
    icon: Layers3,
  },
  {
    title: "Gudang & Lokasi",
    description: "Atur gudang, zona, rak, dan bin agar penyimpanan lebih rapi.",
    icon: Warehouse,
  },
  {
    title: "Supplier Management",
    description: "Simpan data pemasok untuk mendukung proses purchase order.",
    icon: Handshake,
  },
  {
    title: "Inbound & Outbound",
    description: "Pantau barang masuk dan keluar dalam alur operasional gudang.",
    icon: Truck,
  },
  {
    title: "Stock Transfer",
    description: "Pindahkan barang antar lokasi dengan pencatatan yang jelas.",
    icon: Repeat2,
  },
  {
    title: "Reports & Monitoring",
    description: "Lihat ringkasan stok, pergerakan barang, dan kondisi inventory.",
    icon: BarChart3,
  },
];

const benefits = [
  "Monitoring stok real-time",
  "Mengurangi pencatatan manual",
  "Mempermudah audit inventaris",
  "Meningkatkan efisiensi operasional",
  "Pelacakan perpindahan barang",
  "Dashboard terpusat",
];

const modules = [
  { title: "Inventory", icon: Boxes, meta: "Stock on hand, batch, reserved" },
  { title: "Logistics", icon: Truck, meta: "Inbound, outbound, receipt" },
  { title: "Supplier", icon: Handshake, meta: "Vendor and purchase order" },
  { title: "Warehouse", icon: Building2, meta: "Gudang, zona, rak, bin" },
  { title: "Reporting", icon: FileText, meta: "Movement and monitoring" },
  { title: "User Management", icon: Users, meta: "Role and access control" },
];

const stats = [
  { value: "99%", label: "Data Accuracy" },
  { value: "24/7", label: "Inventory Visibility" },
  { value: "5+", label: "Operational Modules" },
  { value: "100%", label: "Web Based" },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                <Boxes size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Inventra
                </p>
                <p className="text-xs text-slate-500">Warehouse dashboard</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live stock
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-[150px_1fr]">
            <aside className="hidden rounded-2xl border border-slate-200 bg-white p-3 sm:block">
              {["Dashboard", "Inventory", "Inbound", "Reports"].map(
                (item, index) => (
                  <div
                    key={item}
                    className={`mb-1 rounded-xl px-3 py-2 text-xs font-medium ${
                      index === 1
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                        : "text-slate-500"
                    }`}
                  >
                    {item}
                  </div>
                ),
              )}
            </aside>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["Total SKU", "1,284"],
                  ["Low Stock", "18"],
                  ["Inbound", "42"],
                  ["Reserved", "310"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <p className="text-[11px] font-medium text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Stock Movement
                      </p>
                      <p className="text-xs text-slate-500">7 hari terakhir</p>
                    </div>
                    <LineChart size={18} className="text-sky-600" />
                  </div>
                  <div className="flex h-36 items-end gap-2">
                    {[52, 68, 46, 80, 62, 88, 70].map((height, index) => (
                      <div key={index} className="flex flex-1 items-end gap-1">
                        <span
                          className="w-full rounded-t-md bg-sky-500"
                          style={{ height: `${height}%` }}
                        />
                        <span
                          className="w-full rounded-t-md bg-slate-300"
                          style={{ height: `${Math.max(height - 22, 18)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Recent Items
                  </p>
                  <div className="mt-3 space-y-3">
                    {["Safety Helmet", "Packing Box", "Cable Roll"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              {item}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Rack A-{index + 1}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            OK
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
              <Boxes size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Inventra</p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Warehouse Operations
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-sky-700">
              Features
            </a>
            <a href="#modules" className="transition hover:text-sky-700">
              Modules
            </a>
            <a href="#about" className="transition hover:text-sky-700">
              About
            </a>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Masuk Dashboard
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1 text-sm font-medium text-sky-700 shadow-sm">
              <Database size={15} />
              Inventory management system
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Kelola Inventaris Gudang dengan Lebih Cepat dan Terstruktur
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Platform manajemen inventaris modern untuk memantau stok,
              inbound, outbound, supplier, dan laporan operasional dalam satu
              sistem.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Masuk Dashboard
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Pelajari Fitur
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Fitur Utama Inventra
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Modul inti yang membantu operasional gudang berjalan lebih
              terkendali dari master data sampai laporan.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-100 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-sky-700">Benefits</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Mengapa Menggunakan Inventra?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Inventra dirancang untuk memberi tim gudang satu sumber data yang
              mudah dibaca, mudah diaudit, dan siap digunakan harian.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <ShieldCheck size={16} />
                </div>
                <p className="text-sm font-medium leading-6 text-slate-700">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-700">Modules</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Sistem Operasional dalam Satu Platform
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Setiap modul dibuat seperti bagian dari aplikasi internal
              perusahaan yang digunakan untuk pekerjaan gudang sehari-hari.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article
                  key={module.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {module.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {module.meta}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-sky-700 ring-1 ring-slate-200">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-3/4 rounded-full bg-sky-500" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-950 px-6 py-12 text-center shadow-sm sm:px-10">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-300 ring-1 ring-white/10">
            <PackageCheck size={24} />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Mulai Kelola Inventaris dengan Lebih Efisien
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Gunakan Inventra untuk membantu pencatatan stok, perpindahan barang,
            dan monitoring gudang dalam sistem web terpusat.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Masuk Dashboard
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Hubungi Admin
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">Inventra</p>
            <p className="mt-1">Warehouse Operations Platform</p>
          </div>
          <p>Sistem Informasi Kelompok 14</p>
        </div>
      </footer>
    </main>
  );
}
