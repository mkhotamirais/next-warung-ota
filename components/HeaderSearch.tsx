"use client";

import { getProductNames } from "@/actions/product";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { LuSearch } from "react-icons/lu";

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const [productNames, setProductNames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (e.target.value === "") {
      setProductNames([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    const fetchProductNames = async () => {
      try {
        // const res = await fetch(`/api/product-names?keyword=${e.target.value}`);
        // const data = await res.json();
        const data = await getProductNames(e.target.value);
        const names = data.map((item: { name: string }) => item.name);
        setProductNames(names);
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };

    fetchProductNames();
  };

  const handleSuggestionClick = (name: string) => {
    setKeyword(name);
    setShowSuggestions(false);
    router.push(`?keyword=${name}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword || keyword === "") {
      router.replace("/");
    } else {
      router.push(`?keyword=${keyword}`);
    }

    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border border-gray-300 rounded-lg flex items-center w-full lg:w-72 justify-between"
    >
      <div className="w-full flex-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          ref={inputRef}
          id="search"
          type="search"
          autoComplete="off"
          value={keyword}
          onChange={handleChange}
          placeholder="Search.."
          className="w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-0"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      <button type="submit" aria-label="search" className="p-2.5 text-gray-500 text-sm">
        <LuSearch />
      </button>
      {showSuggestions && productNames.length > 0 ? (
        <div className="absolute top-full p-2 rounded bg-white left-0 w-full shadow-md border border-gray-200 z-10 flex flex-col justify-start">
          {productNames.map((name, i) => (
            <button
              type="button"
              onMouseDown={() => handleSuggestionClick(name)}
              className="mb-1 text-sm text-left text-gray-700 hover:bg-gray-100 rounded py-1 px-2"
              key={i}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
