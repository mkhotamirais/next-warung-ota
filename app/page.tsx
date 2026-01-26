import { Suspense } from "react";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductResultsText from "./ProductResultsText";
import { SortType } from "@/types/types";
import ProductListWrapper from "./ProductListWrapper";
import { content as c } from "@/lib/content";
import Link from "next/link";
const { title, description } = c.product;

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
  const keyword = (await searchParams).keyword || "";
  const categorySlug = (await searchParams).categorySlug || undefined;
  const sortData = (await searchParams).sortData || undefined;
  const minPrice = (await searchParams).minPrice || "";
  const maxPrice = (await searchParams).maxPrice || "";

  const searchParamsKey = `${keyword}-${categorySlug || ""}-${sortData || ""}-${minPrice}-${maxPrice}`;

  return (
    <>
      <main className="flex-1 bg-gray-100 py-4">
        <div className="container">
          <section className="sr-only">
            <h1>{title}</h1>
            <p>{description}</p>
          </section>
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
        </div>
      </main>
    </>
  );
}
