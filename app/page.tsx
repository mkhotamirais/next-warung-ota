import ProductList from "./ProductList";
import { getProducts } from "@/actions/product";

export default async function Home() {
  const limit = 16;
  const initialData = await getProducts({ page: 1, limit });

  const hasMore = initialData.totalProductsCount > limit;
  const nextPage = 2; // Karena kita sudah memuat halaman 1

  return (
    <main className="flex-1 bg-gray-100">
      <div className="container py-4">
        <ProductList
          initialProducts={initialData.products}
          initialTotalPages={initialData.totalPages}
          initialHasMore={hasMore}
          initialNextPage={nextPage}
        />
      </div>
    </main>
  );
}
