"use client";

import { useEffect, useState } from "react";
import Drawer, { DrawerClose } from "./ui/Drawer";
import { LuArrowUpDown, LuListFilter, LuX } from "react-icons/lu";
import Button from "./ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCategory } from "@/lib/generated/prisma";
import { getProductCategories } from "@/actions/product-category";
import { useFilterSearch } from "@/hooks/useFilterSearch";
import { SortType } from "@/types/types";

const btnStyle = "border border-gray-300 py-1 px-2 rounded text-sm hover:ring-1 hover:ring-primary";
const h5 = "font-light text-sm text-gray-600 mb-2";

const TriggerFilter = (
  <Button size="sm" aria-label="filter" variant="ghost">
    <LuListFilter />
  </Button>
);

const SortBtn = ({
  handle,
  val,
  label,
  sortData,
}: {
  handle: () => void;
  val: string;
  label: string;
  sortData: SortType;
}) => (
  <button type="button" onClick={handle} className={`${btnStyle} ${sortData === val ? "bg-primary text-white" : ""}`}>
    {label}
  </button>
);

export default function HeaderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);

  const { category, setCategory, sortData, setSortData, minPrice, setMinPrice, maxPrice, setMaxPrice } =
    useFilterSearch();

  useEffect(() => {
    const initialCategory = searchParams.get("categorySlug") || "";
    const initialSortData = searchParams.get("sortData") || undefined;
    const initialMinPrice = searchParams.get("minPrice") || "";
    const initialMaxPrice = searchParams.get("maxPrice") || "";

    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    if (setSortData) setSortData(initialSortData as SortType);
    setCategory(initialCategory);
  }, [searchParams, setCategory, setMinPrice, setMaxPrice, setSortData]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getProductCategories();
      setProductCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleCategory = (slug: string) => {
    if (category === slug) {
      setCategory(undefined);
    } else {
      setCategory(slug);
    }
  };

  const handleSortData = (type: SortType) => {
    if (sortData === type) {
      setSortData(undefined);
    } else {
      setSortData(type);
    }
  };

  const handleChangeMinPrice = (val: string) => {
    const value = val.replace(/[^0-9]/g, "");
    setMinPrice(value);
  };

  const handleChangeMaxPrice = (val: string) => {
    const value = val.replace(/[^0-9]/g, "");
    setMaxPrice(value);
  };

  const handleFilter = () => {
    if (category) {
      params.set("categorySlug", category);
    } else {
      params.delete("categorySlug");
    }

    if (sortData) {
      params.set("sortData", sortData);
    } else {
      params.delete("sortData");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
      if (!maxPrice) {
        params.set("maxPrice", minPrice);
      } else {
        params.set("maxPrice", maxPrice);
      }
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`);
  };

  const resetAll = () => {
    setCategory(undefined);
    setSortData(undefined);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <Drawer trigger={TriggerFilter} position="right" classWidth="w-4/5">
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filter and Order Products</h3>
          <DrawerClose asChild>
            <Button size="sm" variant="ghost" className="w-fit">
              <LuX />
            </Button>
          </DrawerClose>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <LuListFilter />
            <span>Filter By</span>
          </h4>
          <div className="space-y-2">
            <div>
              <h5 className={h5}>Category</h5>
              <div className="flex gap-1 flex-wrap">
                {productCategories?.map((c) => (
                  <button
                    type="button"
                    key={c.slug}
                    onClick={() => handleCategory(c.slug)}
                    className={`${c.slug === category ? "bg-primary text-white" : ""} ${btnStyle}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h5 className={h5}>Rentang Harga</h5>
              <div className="flex gap-1 items-center text-sm">
                <div className="">
                  <label htmlFor="min-price" className="text-xs text-light text-gray-500">
                    Min Price
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    id="min-price"
                    placeholder="Haga Minimal"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    value={minPrice}
                    onChange={(e) => handleChangeMinPrice(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="text-xs text-light text-gray-500">
                    Max Price
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    id="max-price"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    value={maxPrice}
                    placeholder={`${minPrice ? minPrice : "Harga Maksimal"}`}
                    onChange={(e) => handleChangeMaxPrice(e.target.value)}
                    onFocus={(e) => {
                      if (Number(maxPrice) < Number(minPrice)) {
                        setMaxPrice(minPrice);
                      }
                      setTimeout(() => {
                        e.target.select();
                      }, 100);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <LuArrowUpDown />
            <span>Order By</span>
          </h4>
          <div>
            <h5 className="font-light text-sm text-gray-600">Harga</h5>
            <div className="flex gap-1 flex-wrap mb-4">
              <SortBtn
                handle={() => handleSortData("price_asc")}
                val="price_asc"
                label="Harga Terendah"
                sortData={sortData}
              />
              <SortBtn
                handle={() => handleSortData("price_desc")}
                val="price_desc"
                label="Harga Tertinggi"
                sortData={sortData}
              />
              <SortBtn handle={() => handleSortData("name_asc")} val="name_asc" label="A-Z" sortData={sortData} />
              <SortBtn handle={() => handleSortData("name_desc")} val="name_desc" label="Z-A" sortData={sortData} />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-white py-2">
          <DrawerClose asChild>
            <Button
              type="button"
              onClick={handleFilter}
              className="btn w-full bg-primary text-white"
              disabled={minPrice !== "" && maxPrice !== "" && Number(maxPrice) < Number(minPrice)}
            >
              Apply Filter
            </Button>
          </DrawerClose>
          <Button variant="ghost" onClick={resetAll}>
            Reset All
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
