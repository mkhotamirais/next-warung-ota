"use client";

import { getProductNames, getTotalProductsCount } from "@/actions/product";
import { useFilterSearch } from "@/hooks/useFilterSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button-tmp";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input-tmp";

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const { keyword, setKeyword } = useFilterSearch();
  const [productNames, setProductNames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalProductsCount, setTotalProductsCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const DEBOUNCE_DELAY = 200;

  useEffect(() => {
    const initialKeyword = searchParams.get("keyword") || "";
    setKeyword(initialKeyword);
  }, [searchParams, setKeyword]);

  useEffect(() => {
    const fetchTotalProductsCount = async () => {
      const count = await getTotalProductsCount();
      setTotalProductsCount(count);
    };
    fetchTotalProductsCount();
  }, []);

  useEffect(() => {
    const fnSuggestion = () => {
      if (keyword?.length === 0) {
        setProductNames([]);
        setShowSuggestions(false);
        return;
      }

      setShowSuggestions(true);
    };

    fnSuggestion();

    const debounceTimer = setTimeout(async () => {
      try {
        const data = await getProductNames(keyword);
        const names = data.map((item: { name: string }) => item.name);
        setProductNames(names);
      } catch (error) {
        console.error("Error fetching product names:", error);
        setProductNames([]);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [keyword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSuggestionClick = (name: string) => {
    setKeyword(name);
    setShowSuggestions(false);
    router.push(`/?keyword=${name}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword || keyword !== "") {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    router.push(`/?${params.toString()}`);

    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="sm:relative">
      <ButtonGroup>
        <Input
          ref={inputRef}
          id="search"
          type="search"
          autoComplete="off"
          value={keyword}
          onChange={handleChange}
          placeholder={`Cari dari ${totalProductsCount ?? 0} produk..`}
          className="w-full py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-0"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onFocus={() => setShowSuggestions(true)}
          // placeholder="Search..."
        />
        <Button type="submit" variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </ButtonGroup>
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
