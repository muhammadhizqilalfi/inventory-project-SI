import { prisma } from "@/lib/prisma";
import ExportButton from "@/app/components/ExportButton";
import AddProductModal from "@/app/components/AddProductModal";
import AddCategoryModal from "@/app/components/AddCategoryModal";
import ProductActions from "@/app/components/ProductActions";
import SearchBar from "@/app/components/SearchBar";
import CategoryFilter from "@/app/components/CategoryFilter";

export const dynamic = "force-dynamic";

export default async function ProductsPage(props: {
  searchParams: Promise<{ search?: string; category?: string }>; // Ubah tipe data menjadi Promise
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.search || "";
  const categoryId = searchParams?.category || "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { barcode: { contains: query, mode: "insensitive" } },
          ]
        } : {},
        categoryId ? { categoryId: categoryId } : {},
      ]
    },
    include: {
      category: true,
      batches: true,
      inventories: true,
      _count: { select: { inventories: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany();

  const lowStockProducts = products.filter((product) => {
    const totalStock = product.inventories.reduce((acc, inv) => acc + inv.quantity, 0);
    return product.minStock > 0 && totalStock <= product.minStock;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">Master Data</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Katalog Barang
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola SKU, kategori, barcode, dan batas minimum stok.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ExportButton 
            data={products} 
            fileName="Katalog_Produk" 
            type="inventory"
          />
          <AddCategoryModal />
          <AddProductModal categories={categories} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total SKU</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Kategori</p>
          <p className="mt-2 text-3xl font-semibold text-sky-700">{categories.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Low Stock Alert</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            {lowStockProducts.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 p-4 md:flex-row md:items-center md:justify-between">
           
           <SearchBar />

           <CategoryFilter categories={categories} />
        </div>

        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Produk dengan kata kunci <span className="font-semibold text-slate-800">"{query}"</span> tidak ditemukan.
            </div>
          ) : (
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-xs uppercase text-slate-500">
                  <th className="px-6 py-4 font-semibold">Informasi Produk</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold text-center">Min. Stock</th>
                  <th className="px-6 py-4 font-semibold">Batch Tracking</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-sky-50/40">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">{product.barcode || "Tanpa Barcode"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.unit}</td>
                    <td className="px-6 py-4 text-center font-semibold text-amber-700">{product.minStock}</td>
                    <td className="px-6 py-4">
                      {product.batches.length > 0 ? (
                        <span className="flex items-center gap-2 font-medium text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-400">Static</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProductActions product={product} categories={categories} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
