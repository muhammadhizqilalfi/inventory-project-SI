import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OpnameDetailForm from "./OpnameDetailForm";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div className="text-left">
          <p className="text-sm font-medium text-sky-700">Inventory</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Detail Stock Opname
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ref: #{opname.id.split("-")[0].toUpperCase()}
          </p>
        </div>
        <div className={`px-4 py-1 rounded-full text-xs font-bold ${
          opname.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
        }`}>
          {opname.status}
        </div>
      </div>

      <OpnameDetailForm opname={opname} />
    </div>
  );
}
