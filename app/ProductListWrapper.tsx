import { getProducts } from "@/actions/product";
import ProductList from "./ProductList";
import { SortType } from "@/types/types";

interface ProductListWrapperProps {
  keyword: string;
  categorySlug?: string;
  sortData?: SortType;
  minPrice: number;
  maxPrice: number;
}

export default async function ProductListWrapper({
  keyword,
  categorySlug,
  sortData,
  minPrice,
  maxPrice,
}: ProductListWrapperProps) {
  const limit = 18;

  const initialData = await getProducts({
    page: 1,
    limit,
    keyword,
    categorySlug,
    sortData,
    minPrice,
    maxPrice,
  });

  const hasMore = initialData.totalProductsCount > limit;
  const nextPage = 2;

  return (
    <ProductList
      initialProducts={initialData.products}
      initialTotalPages={initialData.totalPages}
      initialHasMore={hasMore}
      initialNextPage={nextPage}
    />
  );
}
