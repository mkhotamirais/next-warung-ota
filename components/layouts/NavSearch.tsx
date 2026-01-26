"use client";

import React from "react";
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import { getProductNames, getTotalProductsCount } from "@/actions/product";
import { useFilterSearch } from "@/hooks/useFilterSearch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavSearch() {
  const [open, setOpen] = React.useState(false);
  const [productSuggestions, setProductSuggestions] = useState<{ name: string; slug: string }[] | undefined>([]);
  const { keyword, setKeyword } = useFilterSearch();
  const [totalProductsCount, setTotalProductsCount] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    getTotalProductsCount().then(setTotalProductsCount);
  }, []);

  useEffect(() => {
    const getData = async () => {
      //   if (!keyword) {
      //     setProductSuggestions([]);
      //     return;
      //   }
      const products = await getProductNames(keyword);
      setProductSuggestions(products || []);
    };

    getData();
  }, [keyword]);

  return (
    <div>
      <Button onClick={() => setOpen((prev) => !prev)} variant={"secondary"} className="rounded-full">
        <SearchIcon />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            value={keyword}
            onValueChange={(e) => setKeyword(e)}
            placeholder={`Cari dari ${totalProductsCount ?? 0} produk..`}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="space-y-1 mx-2 py-2">
              {productSuggestions?.map(({ name, slug }) => (
                <CommandItem
                  key={slug}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/product-detail/${slug}`);
                  }}
                >
                  {name}
                </CommandItem>
              ))}
            </div>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
