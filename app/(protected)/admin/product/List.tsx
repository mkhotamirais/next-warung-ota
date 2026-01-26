"use client";

import Pagination from "@/components/ui/Pagination";
import { ProductProps } from "@/types/types";
import ProductCardAdmin from "./ProductCardAdmin";
// import { useProduct } from "@/hooks/tanstack-hooks/useProduct";
// import { useParams, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

interface ProductListProps {
  products: ProductProps[];
  page: number;
  limit: number;
  keyword?: string;
  totalPages: number;
  totalProductsCount: number;
}

export default function List({ products, page, limit, totalPages, totalProductsCount }: ProductListProps) {
  // export default function ProductList() {
  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);
  // const keyword = searchParams.get("keyword");

  // const { data, isLoading } = useProduct(page, limit, keyword || "");
  // const products = data?.products as ProductProps[];
  // const totalPages = data?.totalPages as number;
  // const totalProductsCount = data?.totalProductsCount as number;

  // if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      <div>
        {products?.length ? (
          <div>
            {products?.map((product) => (
              <ProductCardAdmin key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <h2>No Product Found</h2>
        )}
      </div>
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </>
  );
}
