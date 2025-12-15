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
  const limit = 24; // Definisi pusat limit

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

  if (initialData.totalProductsCount === 0) return <p className="text-center py-10">Product not found</p>;

  return (
    <ProductList
      initialProducts={initialData.products}
      initialHasMore={hasMore}
      initialNextPage={nextPage}
      limit={limit} // Teruskan limit ke client
      filters={{ keyword, categorySlug, sortData, minPrice, maxPrice }} // Teruskan filter
    />
  );
}
