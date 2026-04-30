import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OpnameDetailForm from "./OpnameDetailForm";

export default async function OpnameDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  if (!id) notFound();

  const opname = await prisma.stockOpname.findUnique({
    where: { id: id },
    include: {
      items: {
        include: {
          inventory: {
            include: {
              product: true,
              location: { include: { warehouse: true } },
              batch: true,
            },
          },
        },
      },
    },
  });

  if (!opname) notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800">Detail Stock Opname</h1>
          <p className="text-sm text-gray-500 font-mono">Ref: #{opname.id.split("-")[0].toUpperCase()}</p>
        </div>
        <div className={`px-4 py-1 rounded-full text-xs font-bold ${
          opname.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {opname.status}
        </div>
      </div>

      <OpnameDetailForm opname={opname} />
    </div>
  );
}