import { Suspense } from "react";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductResultsText from "./ProductResultsText";
import { SortType } from "@/types/types";
import ProductListWrapper from "./ProductListWrapper";
import { content as c } from "@/lib/content";
import HomeHero from "@/components/homepage/HomeHero";
import HomeProductCategoryList from "@/components/homepage/HomeProductCategoryList";
import HomeProductList from "@/components/homepage/HomeProductList";
import { Separator } from "@/components/ui/separator";
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
    <main className="flex-1">
      <HomeHero />
      <HomeProductCategoryList />
      <HomeProductList />
      {/* <section className="container bg-gray-100 py-8">
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
      </section> */}
    </main>
  );
}
