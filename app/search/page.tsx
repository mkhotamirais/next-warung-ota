import { Suspense } from "react";
import Results from "./Results";
import FallbackSearchProducts from "@/components/fallbacks/FallbackSearchProducts";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const keyword = (await searchParams).keyword;

  return (
    <main className="flex-1 py-4 bg-gray-100">
      <div className="container">
        <h1 className="mb-3 text-lg">
          Pencarian <b>`{keyword}`</b>
        </h1>
        <Suspense fallback={<FallbackSearchProducts />} key={keyword}>
          <Results keyword={keyword} />
        </Suspense>
      </div>
    </main>
  );
}
