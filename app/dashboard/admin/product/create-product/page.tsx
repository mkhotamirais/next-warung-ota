import CreateProductForm from "./CreateProductForm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Load from "@/components/fallbacks/Load";
import { getProductCategories } from "@/actions/product";

export default async function CreateProduct() {
  const productCategories = await getProductCategories();

  if (!productCategories?.length) redirect("/dashboard/admin/product-category");

  return (
    <Suspense fallback={<Load />}>
      <CreateProductForm productCategories={productCategories} />
    </Suspense>
  );
}
