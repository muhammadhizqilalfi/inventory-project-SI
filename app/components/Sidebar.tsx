"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: "LayoutDashboard" }],
  },
  {
    title: "Master Data",
    items: [
      { name: "Produk & Kategori", href: "/admin/products" },
      { name: "Gudang & Lokasi", href: "/admin/warehouses" }, // Tambahan: Untuk Zone/Rack/Bin
      { name: "Supplier", href: "/admin/suppliers" },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      { name: "Stock On Hand", href: "/admin/inventory" }, // Lihat stok per lokasi/batch
      { name: "Stock Transfer", href: "/admin/transfer" }, // Fitur pindah gudang
      { name: "Stock Opname", href: "/admin/opname" },    // Fitur hitung fisik
    ],
  },
  {
    title: "Logistics",
    items: [
      { name: "Inbound (PO & QC)", href: "/admin/inbound" },
      { name: "Outbound (Shipping)", href: "/admin/outbound" },
    ],
  },
  {
    title: "Reports & System",
    items: [
      { name: "Stock Movement", href: "/admin/reports/movement" }, // Audit trail
      { name: "User Management", href: "/admin/users" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 flex flex-col bg-white border-r shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="font-bold text-gray-700 text-2xl">Inventra</h1>
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 py-6 space-y-6 overflow-y-auto">
        {menu.map((section, i) => (
          <div key={i}>
            <p className="text-xs text-gray-500 px-3 mb-2 uppercase">
              {section.title}
            </p>

            {section.items.map((item, j) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={j}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span></span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}