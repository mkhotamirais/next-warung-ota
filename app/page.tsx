import React, { Suspense } from "react";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";
import ProductList from "./ProductList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    // categorySlug?: string;
    // sortPrice?: "asc" | "desc" | null;
    // minPrice?: string;
    // maxPrice?: string;
  }>;
}) {
  const keyword = (await searchParams).keyword || "";

  return (
    <main className="flex-1">
      <div className="container py-4">
        <Suspense fallback={<FallbackSearchProducts />} key={`${keyword}`}>
          <ProductList keyword={keyword} />
        </Suspense>
      </div>
    </main>
  );
}
