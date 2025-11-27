import { redirect } from "next/navigation";
import { Suspense } from "react";
import EditProductForm from "./EditProductForm";
import Load from "@/components/fallbacks/Load";
import { getProductBySlug, getProductCategories } from "@/actions/product";

export default async function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const productCategories = await getProductCategories();
  const product = await getProductBySlug(slug);

  if (!productCategories?.length || !product) redirect("/dashboard/product-category");

  return (
    <Suspense fallback={<Load />}>
      <EditProductForm productCategories={productCategories} product={product} />
    </Suspense>
  );
}
