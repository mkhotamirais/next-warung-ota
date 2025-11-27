import React, { Suspense } from "react";
import ProductCategoryList from "./List";
import Load from "@/components/fallbacks/Load";
import Create from "./Create";
import { getProductCategories } from "@/actions/product";

export default async function ProductCategory() {
  const productCategories = await getProductCategories();

  return (
    <>
      <Create />
      <Suspense fallback={<Load />}>
        <ProductCategoryList productCategories={productCategories} />
      </Suspense>
    </>
  );
}
