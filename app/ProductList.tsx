"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { Sentinel } from "@/components/Sentinel";
import { getProducts } from "@/actions/product";
import { ProductProps } from "@/types/types"; // Asumsikan tipe ini sudah benar

// --- Wrapper Fungsi Fetcher ---
const productFetcherWrapper = async (page: number) => {
  const limit = 16;

  const data = await getProducts({ page, limit });

  return {
    products: data.products as ProductProps[],
    hasMore: data.hasMore,
    nextPage: data.nextPage,
  };
};

// --- Props ProductList ---
interface ProductListProps {
  initialProducts: ProductProps[] | undefined | null;
  initialTotalPages?: number;
  initialHasMore?: boolean;
  initialNextPage?: number;
}

export default function ProductList({
  initialProducts,
  initialHasMore = false, // Default ke false jika tidak disediakan
  initialNextPage = 2, // Default ke 2
}: ProductListProps) {
  const [products, setProducts] = useState<ProductProps[]>(initialProducts || []);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const handleLoadMore = useCallback((newProducts: ProductProps[], newHasMore: boolean) => {
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setHasMore(newHasMore);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="grid-list">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <Sentinel<ProductProps>
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
