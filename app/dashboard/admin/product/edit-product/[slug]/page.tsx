import { redirect } from "next/navigation";
import EditProductForm from "./EditProductForm";
import { getProductBySlug } from "@/actions/product";
import { getProductCategories } from "@/actions/product-category";
// import EditProductWrapper from "./EditProductWrapper";

export default async function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const productCategories = await getProductCategories();
  const product = await getProductBySlug(slug);

  if (!productCategories?.length || !product) redirect("/dashboard/product-category");

  return <EditProductForm productCategories={productCategories} product={product} />;
  // return <EditProductWrapper />;
}
