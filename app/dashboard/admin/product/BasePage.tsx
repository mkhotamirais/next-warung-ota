import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductList from "./ProductList";
import SearchProductAdmin from "./SearchProductAdmin";
import { getProducts } from "@/actions/product";

export default async function BasePage({ page, limit, keyword }: { page: number; limit: number; keyword?: string }) {
  const { totalProductsCount } = await getProducts();
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Product List ({totalProductsCount})</h2>
        <Link href="/dashboard/admin/product/create-product">
          <Button>Create Product</Button>
        </Link>
      </div>
      <div className="mb-4">
        <SearchProductAdmin />
      </div>
      <ProductList page={page} limit={limit} keyword={keyword} />
    </>
  );
}
