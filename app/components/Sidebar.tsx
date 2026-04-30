"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react"; // Opsional: jika kamu pakai lucide-react

const menu = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: "LayoutDashboard" }],
  },
  {
    title: "Master Data",
    items: [
      { name: "Produk & Kategori", href: "/admin/products" },
      { name: "Gudang & Lokasi", href: "/admin/warehouses" },
      { name: "Supplier", href: "/admin/suppliers" },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      { name: "Stock On Hand", href: "/admin/inventory" },
      { name: "Stock Transfer", href: "/admin/transfer" },
      { name: "Stock Opname", href: "/admin/opname" },
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
      { name: "Stock Movement", href: "/admin/reports/movement" },
      { name: "User Management", href: "/admin/users" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Tambahkan logika logout kamu di sini (misal hapus session/cookie)
    if (confirm("Apakah anda yakin ingin keluar?")) {
      console.log("Logging out...");
      // window.location.href = "/login"; 
    }
  };

  return (
    <div className="h-screen w-64 flex flex-col bg-white border-r shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h1 className="font-bold text-gray-800 text-2xl tracking-tight">Inventra</h1>
      </div>

      {/* Menu - flex-1 membuat area ini mengambil sisa ruang yang ada */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {menu.map((section, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold text-gray-400 px-3 mb-2 uppercase tracking-widest">
              {section.title}
            </p>

            {section.items.map((item, j) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={j}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Logout Section */}
      <div className="p-4 border-t bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg justify-center font-bold text-red-600 hover:bg-red-50 transition-colors text-sm"
        >
          {/* Kamu bisa ganti icon ini dengan SVG atau icon library */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}