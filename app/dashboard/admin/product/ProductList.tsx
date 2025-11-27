import { getProducts } from "@/actions/product";
import ProductCardAdmin from "@/app/dashboard/admin/product/ProductCardAdmin";
import Pagination from "@/components/ui/Pagination";
// import ProductCardAdmin from "./ProductCardAdmin";

interface ProductListProps {
  page: number;
  limit: number;
  keyword: string;
}

export default async function ProductList({ page, limit, keyword }: ProductListProps) {
  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit, keyword });

  return (
    <>
      <div>
        {products?.length ? (
          <div>
            {products?.map((product) => (
              <ProductCardAdmin key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <h2>No Product Found</h2>
        )}
      </div>{" "}
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </>
  );
}
