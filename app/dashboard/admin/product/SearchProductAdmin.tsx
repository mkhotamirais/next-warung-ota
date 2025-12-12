"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
// import { useDebouncedCallback } from "use-debounce";

export default function SearchProductAdmin() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const [keyword, setKeyword] = useState(params.get("keyword") || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword || keyword === "") {
      router.replace("/dashboard/admin/product");
    } else {
      router.push(`/dashboard/admin/product?keyword=${keyword}`);
    }
  };

  return (
    <div className="flex">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="search"
          placeholder="Cari Produk"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-gray-300 py-2 px-3"
        />
        <button type="submit" aria-label="search product admin" className="py-2 px-3 bg-primary text-white">
          <LuSearch />
        </button>
      </form>
    </div>
  );
}
