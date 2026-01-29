"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { getProductNames, getTotalProductsCount } from "@/actions/product";

interface ProductSuggestion {
  name: string;
  slug: string;
}

interface NavSearchProps {
  trigger: React.ReactNode;
}

export default function SearchPopup({ trigger }: NavSearchProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [allProducts, setAllProducts] = useState<ProductSuggestion[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    getTotalProductsCount().then((count) => setTotalProductsCount(count ?? 0));
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProductNames("");
      setAllProducts(data || []);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && allProducts.length === 0) {
      fetchProducts();
    }
  }, [open, allProducts.length]);

  // const filteredProducts = useMemo(() => {
  //   if (!keyword.trim()) return [];
  //   const searchLow = keyword.toLowerCase();
  //   return allProducts.filter((p) => p.name.toLowerCase().includes(searchLow)).slice(0, 8);
  // }, [keyword, allProducts]);

  const filteredProducts = useMemo(() => {
    if (!keyword.trim()) return [];

    // Fungsi untuk menghilangkan spasi dan simbol (strip, dll)
    const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

    const searchNormalized = normalize(keyword);

    return allProducts
      .filter((product) => {
        const nameNormalized = normalize(product.name);
        return nameNormalized.includes(searchNormalized);
      })
      .slice(0, 8);
  }, [keyword, allProducts]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    setKeyword("");
    router.push(`/product-detail/${slug}`);
  };

  const commandEmpty = isLoading
    ? "Loading..."
    : keyword && !filteredProducts.length
      ? "Produk tidak ditemukan."
      : "Cari dari semua produk...";

  return (
    <div>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={keyword}
          onValueChange={setKeyword}
          placeholder={`Cari dari ${totalProductsCount} produk..`}
        />
        <CommandList>
          <CommandEmpty>
            <span>{commandEmpty}</span>
          </CommandEmpty>

          <CommandGroup heading="Hasil Pencarian">
            {filteredProducts.map(({ name, slug }) => (
              <CommandItem key={slug} value={name} onSelect={() => handleSelect(slug)}>
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
