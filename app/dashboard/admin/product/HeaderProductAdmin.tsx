"use client";

import AuthTitleHeader from "@/components/AuthTitleHeader";
import { useEffect, useState } from "react";
import SearchProductAdmin from "./SearchProductAdmin";
import { getProducts } from "@/actions/product";

export default function HeaderProductAdmin() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotalProductsCount = async () => {
      const { totalProductsCount } = await getProducts();
      setTotal(totalProductsCount);
    };
    fetchTotalProductsCount();
  });

  return (
    <div className="flex justify-between items-center mb-4">
      <AuthTitleHeader
        title="Product List"
        totalCount={total}
        url="/dashboard/admin/product/create-product"
        label="Create Product"
      />
      <SearchProductAdmin />
    </div>
  );
}
