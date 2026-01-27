import CreateProductForm from "./CreateProductForm";
import { redirect } from "next/navigation";
import { getProductCategories } from "@/actions/product-category";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateProduct() {
  const productCategories = await getProductCategories();

  if (!productCategories?.length) redirect("/dashboard/admin/product-category");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h1">Create Product</h1>
        <Button asChild>
          <Link href="/admin/product">Go to Product List</Link>
        </Button>
      </div>
      <CreateProductForm productCategories={productCategories} />
    </>
  );
}
