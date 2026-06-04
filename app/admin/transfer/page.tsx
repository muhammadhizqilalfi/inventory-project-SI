import { prisma } from "@/lib/prisma";
import TransferForm from "./TransferForm";

export const dynamic = "force-dynamic";

export default async function TransferPage() {
  const locations = await prisma.storageLocation.findMany({
    include: { warehouse: true }
  });
  
  const products = await prisma.product.findMany();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-sky-700">Inventory</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Stock Transfer
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pindahkan barang antar lokasi penyimpanan secara presisi.
        </p>
      </div>

      <div className="max-w-full text-slate-600">
        <TransferForm locations={locations} />
      </div>
    </div>
  );
}
