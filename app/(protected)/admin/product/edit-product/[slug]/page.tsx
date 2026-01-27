import { redirect } from "next/navigation";
import EditProductForm from "./EditProductForm";
import { getProductBySlug } from "@/actions/product";
import { getProductCategories } from "@/actions/product-category";
import { Button } from "@/components/ui/button-tmp";
import Link from "next/link";
// import EditProductWrapper from "./EditProductWrapper";

export default async function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const productCategories = await getProductCategories();
  const product = await getProductBySlug(slug);

  if (!productCategories?.length || !product) redirect("/dashboard/product-category");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h1">Edit Product</h1>
        <Button asChild>
          <Link href="/admin/product">Go to Product List</Link>
        </Button>
      </div>
      <EditProductForm productCategories={productCategories} product={product} />;
    </>
  );

  // return <EditProductWrapper />;
}
