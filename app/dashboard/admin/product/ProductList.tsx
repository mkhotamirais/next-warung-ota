import { getProducts } from "@/actions/product";
import ProductCardAdmin from "@/app/dashboard/admin/product/ProductCardAdmin";
import Pagination from "@/components/ui/Pagination";
import { ProductProps } from "@/types/types";

interface ProductListProps {
  products: ProductProps[];
  page: number;
  limit: number;
  keyword?: string;
  totalPages: number;
  totalProductsCount: number;
}

export default async function ProductList({
  products,
  page,
  limit,
  keyword,
  totalPages,
  totalProductsCount,
}: ProductListProps) {
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
      </div>
      {totalProductsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/product/page" />
      ) : null}
    </>
  );
}
