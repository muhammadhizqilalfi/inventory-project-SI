"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardList,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Repeat2,
  Tags,
  Users,
  Warehouse,
  X,
} from "lucide-react";

const menu = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Master Data",
    items: [
      { name: "Produk & Kategori", href: "/admin/products", icon: Tags },
      { name: "Gudang & Lokasi", href: "/admin/warehouses", icon: Warehouse },
      { name: "Supplier", href: "/admin/suppliers", icon: Handshake },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      { name: "Stock On Hand", href: "/admin/inventory", icon: Boxes },
      { name: "Stock Transfer", href: "/admin/transfer", icon: Repeat2 },
    ],
  },
  {
    title: "Logistics",
    items: [
      { name: "Inbound", href: "/admin/inbound", icon: ArrowDownToLine },
      { name: "Outbound", href: "/admin/outbound", icon: ArrowUpFromLine },
    ],
  },
  {
    title: "System",
    items: [
      { name: "User Management", href: "/admin/users", icon: Users },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm("Apakah anda yakin ingin keluar?")) {
      try {
        const res = await fetch("/api/logout", {
          method: "POST",
        });

        if (res.ok) {
          router.push("/login");
          router.refresh();
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
            <Boxes size={18} />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950">Inventra</p>
            <p className="text-xs text-slate-500">Inventory system</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
              <Boxes size={21} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                Inventra
              </h1>
              <p className="text-xs text-slate-500">Warehouse operations</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {menu.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase text-slate-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-sky-600" : "text-slate-400"}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs font-medium text-slate-500">Workspace</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
              Operasional Gudang
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
