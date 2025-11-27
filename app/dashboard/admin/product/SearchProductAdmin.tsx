"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
// import { LuSearch } from "react-icons/lu";
import { useDebouncedCallback } from "use-debounce";

export default function SearchProductAdmin() {
  // const [keyword, setKeyword] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  // const handleSubmit = useDebouncedCallback((e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!keyword || keyword === "") {
  //     router.replace("/dashboard/admin/product");
  //   } else {
  //     router.push(`/dashboard/admin/product?keyword=${keyword}`);
  //   }
  // }, 500);

  // const onSearch = useDebouncedCallback((e: string) => {
  //   if (e) {
  //     params.set("search", e);
  //   } else {
  //     params.delete("search");
  //   }
  //   router.push(`?${params.toString()}`);
  // }, 500);

  const handleSearch = useDebouncedCallback((e: string) => {
    if (e) {
      params.set("keyword", e);
    } else {
      params.delete("keyword");
    }
    router.push(`/dashboard/admin/product?${params.toString()}`);
  }, 500);

  return (
    <div className="flex">
      {/* <form onSubmit={handleSubmit} className="flex"> */}
      <input
        type="search"
        placeholder="Cari Produk"
        // value={keyword}
        // onChange={(e) => setKeyword(e.target.value)}
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 py-2 px-3"
      />
      {/* <button type="submit" aria-label="search product admin" className="py-2 px-3 bg-primary text-white">
        <LuSearch />
      </button> */}
      {/* </form> */}
    </div>
  );
}
