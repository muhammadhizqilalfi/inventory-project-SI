"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  {
    title: "Dashboard",
    items: [{ name: "Overview", href: "/admin" }],
  },
  {
    title: "Master Data",
    items: [
      { name: "Kategori", href: "/admin/categories" },
      { name: "Suppliers", href: "/admin/suppliers" },
      { name: "Produk", href: "/admin/products" },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { name: "Masuk", href: "/admin/inbound" },
      { name: "Keluar", href: "/admin/outbound" },
    ],
  },
  {
    title: "System",
    items: [{ name: "Manajemen Pengguna", href: "/admin/users" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="font-bold text-gray-700 text-3xl">Inventra</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-700 font-bold"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 py-6 space-y-6 overflow-y-auto mt-2">
        {menu.map((section, i) => (
          <div key={i}>
            {!collapsed && (
              <p className="text-xs text-gray-700 px-3 mb-2 uppercase">
                {section.title}
              </p>
            )}

            {section.items.map((item, j) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={j}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-light mb-1 transition
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {/* Icon placeholder */}
                  <span></span>

                  {!collapsed && item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}