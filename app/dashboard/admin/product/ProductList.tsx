// "use client";

import ProductCardAdmin from "@/app/dashboard/admin/product/ProductCardAdmin";
import Pagination from "@/components/ui/Pagination";
import { ProductProps } from "@/types/types";
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

export default async function ProductList({ products, page, limit, totalPages, totalProductsCount }: ProductListProps) {
  // export default function ProductList() {
  // const [products, setProducts] = useState<ProductProps[]>([]);
  // const [totalProductsCount, setTotalProductsCount] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);
  // const keyword = searchParams.get("keyword");

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const res = await fetch(`/api/product?page=${page}&limit=${limit}&keyword=${keyword || ""}`);
  //     const data = await res.json();

  //     setProducts(data.products);
  //     setTotalProductsCount(data.totalProductsCount);
  //     setTotalPages(data.totalPages);
  //   };
  //   getProducts();
  // }, [products, page, limit, keyword]);

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
