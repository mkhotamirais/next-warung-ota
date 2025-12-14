import { Suspense } from "react";
import { getProducts } from "@/actions/product";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductResultsText from "./ProductResultsText";
import { SortType } from "@/types/types";
import ProductListWrapper from "./ProductListWrapper";

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

  const isDataEmpty = initialData.products.length === 0;

  const searchParamsKey = `${keyword}-${categorySlug || ""}-${sortData || ""}-${minPrice}-${maxPrice}`;

  return (
    <main className="flex-1 bg-gray-100 py-4">
      <div className="container">
        <ProductResultsText
          keyword={keyword}
          categorySlug={categorySlug}
          sortData={sortData}
          minPrice={Number(minPrice)}
          maxPrice={Number(maxPrice)}
          isDataEmpty={isDataEmpty}
        />
        <Suspense fallback={<FallbackSearchProducts />} key={searchParamsKey}>
          <ProductListWrapper
            keyword={keyword}
            categorySlug={categorySlug}
            sortData={sortData}
            minPrice={Number(minPrice)}
            maxPrice={Number(maxPrice)}
          />
        </Suspense>
      </div>
    </main>
  );
}
