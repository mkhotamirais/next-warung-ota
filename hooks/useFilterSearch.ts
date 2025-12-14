import { SortType } from "@/types/types";
import { create } from "zustand";

interface FilterSearchState {
  keyword: string;
  setKeyword: (keyword: string) => void;
  category: string | undefined;
  setCategory: (categorySlug: string | undefined) => void;
  sortData: SortType;
  setSortData: (sortData: SortType) => void;
  minPrice: string;
  setMinPrice: (minPrice: string) => void;
  maxPrice: string;
  setMaxPrice: (maxPrice: string) => void;
}

export const useFilterSearch = create<FilterSearchState>((set) => ({
  keyword: "",
  setKeyword: (keyword) => set({ keyword }),
  category: undefined,
  setCategory: (category) => set({ category }),
  sortData: undefined,
  setSortData: (sortData) => set({ sortData }),
  minPrice: "",
  setMinPrice: (minPrice) => set({ minPrice }),
  maxPrice: "",
  setMaxPrice: (maxPrice) => set({ maxPrice }),
}));
