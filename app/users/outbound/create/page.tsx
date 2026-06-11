import { prisma } from "@/lib/prisma";
import SalesOrderForm from "@/app/components/SalesOrderForm";

export const dynamic = "force-dynamic";

export default async function CreateOutboundPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        Create Sales Order
      </h1>

      <SalesOrderForm products={products} />
    </div>
  );
}