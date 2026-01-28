"use client";

import { SortType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { LuX } from "react-icons/lu";

interface ProductResultsTextProps {
  keyword?: string;
  categorySlug?: string;
  sortData?: SortType;
  minPrice?: number;
  maxPrice?: number;
}

const TextBtn = ({ label, handler, text }: { label: string; handler: () => void; text: string }) => {
  return (
    <>
      <span> {label} </span>
      <button
        type="button"
        className="border px-2 rounded-lg border-gray-400 inline-flex gap-1 items-center"
        onClick={handler}
      >
        <b>&apos;{text?.split("-").join(" ")}&apos;</b>
        <LuX className="border rounded-full text-sm text-red-500" />
      </button>
    </>
  );
};

export default function ProductResultsText({
  keyword,
  categorySlug,
  sortData,
  minPrice,
  maxPrice,
}: ProductResultsTextProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const resetKeyword = () => {
    params.delete("keyword");
    router.push(`?${params.toString()}`);
  };

  const resetCategorySlug = () => {
    params.delete("categorySlug");
    router.push(`?${params.toString()}`);
  };

  const resetSort = () => {
    params.delete("sortData");
    router.push(`?${params.toString()}`);
  };

  const resetPriceRange = () => {
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`?${params.toString()}`);
  };

  return keyword || categorySlug || sortData || minPrice || maxPrice ? (
    <>
      <div className="mb-3 space-y-1">
        <span>Hasil untuk</span>
        {keyword ? <TextBtn label="kata kunci" handler={resetKeyword} text={keyword} /> : null}
        {categorySlug ? <TextBtn label="kategori" handler={resetCategorySlug} text={categorySlug} /> : null}
        {sortData ? (
          sortData === "price_asc" ? (
            <TextBtn label="diurutkan dari" handler={resetSort} text="harga terendah" />
          ) : sortData === "price_desc" ? (
            <TextBtn label="diurutkan dari" handler={resetSort} text="harga tertinggi" />
          ) : sortData === "name_asc" ? (
            <TextBtn label="diurutkan dari" handler={resetSort} text="A ke Z" />
          ) : sortData === "name_desc" ? (
            <TextBtn label="diurutkan dari" handler={resetSort} text="Z ke A" />
          ) : null
        ) : null}
        {minPrice ? (
          <TextBtn label="rentang harga" handler={resetPriceRange} text={`min ${minPrice} - max ${maxPrice}`} />
        ) : null}
      </div>
    </>
  ) : null;
}
