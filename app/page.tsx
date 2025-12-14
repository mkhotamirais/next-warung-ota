import { Suspense } from "react";
import ProductList from "./ProductList";
import { getProducts } from "@/actions/product";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductResultsText from "./ProductResultsText";
import { SortType } from "@/types/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    categorySlug?: string;
    sortData?: SortType;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const limit = 18;
  const keyword = (await searchParams).keyword || "";
  const categorySlug = (await searchParams).categorySlug || undefined;
  const sortData = (await searchParams).sortData || undefined;
  const minPrice = (await searchParams).minPrice || "";
  const maxPrice = (await searchParams).maxPrice || "";

  const initialData = await getProducts({
    page: 1,
    limit,
    keyword,
    categorySlug,
    sortData,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
  });

  const hasMore = initialData.totalProductsCount > limit;
  const nextPage = 2;

  const searchParamsKey = `${keyword}-${categorySlug}-${sortData}-${minPrice}-${maxPrice}`;

  return (
    <main className="flex-1 bg-gray-100 py-4">
      <div className="container">
        <ProductResultsText
          keyword={keyword}
          categorySlug={categorySlug}
          sortData={sortData}
          minPrice={Number(minPrice)}
          maxPrice={Number(maxPrice)}
        />
        <Suspense fallback={<FallbackSearchProducts />} key={searchParamsKey}>
          <ProductList
            initialProducts={initialData.products}
            initialTotalPages={initialData.totalPages}
            initialHasMore={hasMore}
            initialNextPage={nextPage}
          />
        </Suspense>
      </div>
    </main>
  );
}
