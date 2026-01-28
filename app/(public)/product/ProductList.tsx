"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { Sentinel } from "@/components/Sentinel";
import { getProducts } from "@/actions/product";
import { ProductProps, SortType } from "@/types/types";

interface ProductListProps {
  initialProducts: ProductProps[] | undefined | null;
  initialHasMore?: boolean;
  initialNextPage?: number;
  limit: number;
  filters: {
    keyword: string;
    categorySlug?: string;
    sortData?: SortType;
    minPrice: number;
    maxPrice: number;
  };
}

export default function ProductList({
  initialProducts,
  initialHasMore = false,
  initialNextPage = 2,
  limit,
  filters,
}: ProductListProps) {
  const [products, setProducts] = useState<ProductProps[]>(initialProducts || []);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const handleLoadMore = useCallback((newProducts: ProductProps[], newHasMore: boolean) => {
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setHasMore(newHasMore);
  }, []);

  const productFetcherWrapper = useCallback(
    async (page: number) => {
      const data = await getProducts({ page, limit, ...filters });

      return {
        items: data.products as ProductProps[],
        hasMore: data.hasMore,
        nextPage: data.nextPage,
      };
    },
    [limit, filters]
  );

  return (
    <div className="flex flex-col">
      <div className="grid-list">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <Sentinel<ProductProps>
          key={JSON.stringify(filters)}
          initialNextPage={initialNextPage}
          onLoadMore={handleLoadMore}
          fetcher={productFetcherWrapper}
        />
      )}

      {!hasMore && products.length > 0 && (
        <p className="col-span-full text-center text-gray-400 mt-8">Semua produk telah ditampilkan.</p>
      )}
    </div>
  );
}
