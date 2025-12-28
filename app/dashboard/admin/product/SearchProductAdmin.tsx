"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
// import { useDebouncedCallback } from "use-debounce";

export default function SearchProductAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [keywordAdmin, setKeywordAdmin] = useState(params.get("keyword-admin") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keywordAdmin || keywordAdmin !== "") {
      params.set("keyword-admin", keywordAdmin);
    } else {
      params.delete("keyword-admin");
    }

    router.push(`/dashboard/admin/product?${params.toString()}`);
    inputRef.current?.blur();
  };

  return (
    <div className="flex">
      <form onSubmit={handleSubmit} className="flex">
        <input
          ref={inputRef}
          type="search"
          placeholder="Cari Produk"
          value={keywordAdmin}
          onChange={(e) => setKeywordAdmin(e.target.value)}
          className="border border-gray-300 py-2 px-3"
        />
        <button type="submit" aria-label="search product admin" className="py-2 px-3 bg-primary text-white">
          <LuSearch />
        </button>
      </form>
    </div>
  );
}
