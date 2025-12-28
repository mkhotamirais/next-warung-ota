import List from "./List";
import SearchProductAdmin from "./SearchProductAdmin";
import { getProducts } from "@/actions/product";
import AuthTitleHeader from "@/components/AuthTitleHeader";

export default async function BasePage({ page, limit, keyword }: { page: number; limit: number; keyword?: string }) {
  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit, keyword });
  return (
    <>
      <AuthTitleHeader
        title="Product List"
        totalCount={totalProductsCount}
        url="/dashboard/admin/product/create-product"
        label="Create Product"
      />
      <div className="mb-4">
        <SearchProductAdmin />
      </div>
      <List
        products={products}
        totalPages={totalPages}
        totalProductsCount={totalProductsCount}
        page={page}
        limit={limit}
        keyword={keyword}
      />
    </>
  );
}
