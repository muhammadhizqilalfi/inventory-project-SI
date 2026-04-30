import { prisma } from "@/lib/prisma";
import ExportButton from "@/app/components/ExportButton";
import AddProductModal from "@/app/components/AddProductModal";
import AddCategoryModal from "@/app/components/AddCategoryModal";
import ProductActions from "@/app/components/ProductActions";
import SearchBar from "@/app/components/SearchBar";
import CategoryFilter from "@/app/components/CategoryFilter";

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
    <div className="w-full p-6 space-y-6">
      {/* ... (Header Section Tetap Sama) ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Data Produk</h1>
          <p className="text-gray-500 text-sm">Kelola katalog barang dan klasifikasi kategori</p>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportButton 
            data={products} 
            fileName="Katalog_Produk" 
            type="inventory"
          />
          <AddCategoryModal />
          <AddProductModal categories={categories} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">Total SKU</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">Total Kategori</p>
          <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold">Low Stock Alert</p>
          <p className="text-2xl font-bold text-red-500">
            {lowStockProducts.length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
           
           <SearchBar />

           <CategoryFilter categories={categories} />
        </div>

        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Produk dengan kata kunci <span className="font-bold">"{query}"</span> tidak ditemukan.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b text-xs uppercase text-gray-400">
                  <th className="px-6 py-4 font-semibold">Informasi Produk</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold text-center">Min. Stock</th>
                  <th className="px-6 py-4 font-semibold">Batch Tracking</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{product.barcode || "Tanpa Barcode"}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.unit}</td>
                    <td className="px-6 py-4 text-center font-semibold text-orange-600">{product.minStock}</td>
                    <td className="px-6 py-4">
                      {product.batches.length > 0 ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Static</span>
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