import { prisma } from "@/lib/prisma";
import TransferForm from "./TransferForm";

export default async function TransferPage() {
  const locations = await prisma.storageLocation.findMany({
    include: { warehouse: true }
  });
  
  const products = await prisma.product.findMany();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stock Transfer</h1>
        <p className="text-sm text-gray-500">Pindahkan barang antar lokasi penyimpanan secara presisi.</p>
      </div>

      <div className="max-w-full text-gray-600">
        <TransferForm locations={locations} />
      </div>
    </div>
  );
}