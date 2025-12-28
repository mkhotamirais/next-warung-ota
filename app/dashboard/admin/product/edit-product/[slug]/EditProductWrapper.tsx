"use client";

import { useProductDetail } from "@/hooks/tanstack-hooks/useProduct";
import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";
import { ProductCategory } from "@/lib/generated/prisma";
import { useParams } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default function EditProductWrapper() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isPending } = useProductDetail(slug);
  const { data: productCategories }: { data: ProductCategory[] | undefined } = useProductCategory();

  if (isPending) return <div>Loading...</div>;

  return <EditProductForm key={product?.id} product={product} productCategories={productCategories || []} />;
}
