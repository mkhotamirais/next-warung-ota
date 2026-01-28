import Hero from "@/components/Hero";
import { Suspense } from "react";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductListWrapper from "./ProductListWrapper";
import { content as c } from "@/lib/content";
import { SortType } from "@/types/types";
import ProductResultsText from "./ProductResultsText";
import HeaderFilter from "@/components/layouts/HeaderFilter";

const { title, description } = c.product;

export default async function Product({
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
  const keyword = (await searchParams).keyword || "";
  const categorySlug = (await searchParams).categorySlug || undefined;
  const sortData = (await searchParams).sortData || undefined;
  const minPrice = (await searchParams).minPrice || "";
  const maxPrice = (await searchParams).maxPrice || "";

  const searchParamsKey = `${keyword}-${categorySlug || ""}-${sortData || ""}-${minPrice}-${maxPrice}`;

  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
      <section className="container bg-gray-100 py-8 min-h-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="h2">Product Terbaru</h2>
          <HeaderFilter />
        </div>
        <ProductResultsText
          keyword={keyword}
          categorySlug={categorySlug}
          sortData={sortData}
          minPrice={Number(minPrice)}
          maxPrice={Number(maxPrice)}
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
      </section>
    </main>
  );
}
