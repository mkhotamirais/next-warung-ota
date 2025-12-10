"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword || keyword === "") {
      router.replace("/");
    } else {
      router.push(`?keyword=${keyword}`);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-300 rounded-lg overflow-hidden flex items-center w-full lg:w-72 justify-between"
    >
      <div className="w-full flex-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          type="search"
          value={keyword}
          onChange={handleChange}
          placeholder="Search.."
          className="w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-0"
        />
      </div>
      <button type="submit" aria-label="search" className="p-2.5 text-gray-500 text-sm">
        <LuSearch />
      </button>
    </form>
  );
}
