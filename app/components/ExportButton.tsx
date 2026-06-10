"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonProps {
  data: any[];
  fileName: string;
  type: "inventory" | "users" | "warehouse"; // Gunakan type sebagai pengganti fungsi
  title?: string;
}

export default function ExportButton({ data, fileName, type, title }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Logika pemetaan data dilakukan di sisi Client
  const getMappedData = () => {
    return data.map((item) => {
      switch (type) {
        case "inventory":
          return {
            "Nama Produk": item.product?.name || "-",
            "Barcode": item.product?.barcode || "-",
            "Kategori": item.product?.category?.name || "-",
            "Batch": item.batch?.batchNumber || "-",
            "Stok": item.quantity,
            "Unit": item.product?.unit || "-",
          };
        case "warehouse":
          return {
            "Nama Gudang": item.name,
            "Lokasi": item.location,
          };
        default:
          return item;
      }
    });
  };

  const exportToExcel = () => {
    const mapped = getMappedData();
    const worksheet = XLSX.utils.json_to_sheet(mapped);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    setIsOpen(false);
  };

  const exportToCSV = () => {
    const mapped = getMappedData();
    const worksheet = XLSX.utils.json_to_sheet(mapped);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    setIsOpen(false);
  };

  const exportToPDF = () => {
    const mapped = getMappedData();
    const doc = new jsPDF();
    doc.text(title || "Laporan Inventra", 14, 15);
    
    const tableColumn = Object.keys(mapped[0] || {});
    const tableRows = mapped.map((item) => Object.values(item));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows as any[][],
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`${fileName}.pdf`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 rounded-xl border border-sky-600 bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Laporan
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          <button onClick={exportToExcel} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
            <span>Microsoft Excel</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">.XLSX</span>
          </button>
          <button onClick={exportToCSV} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
            <span>Data Mentah</span>
            <span className="text-[10px] bg-gray-100 text-gray-700 px-1 rounded font-bold">.CSV</span>
          </button>
          <button onClick={exportToPDF} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
            <span className="font-medium">Dokumen Siap Cetak</span>
            <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-bold">.PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
