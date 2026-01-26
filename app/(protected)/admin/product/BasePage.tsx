import List from "./List";
import { getProducts } from "@/actions/product";

export default async function BasePage({
  page,
  limit,
  keyword,
  keywordAdmin,
}: {
  page: number;
  limit: number;
  keyword?: string;
  keywordAdmin?: string;
}) {
  const { products, totalPages, totalProductsCount } = await getProducts({ page, limit, keyword, keywordAdmin });

  return (
    <List
      products={products}
      totalPages={totalPages}
      totalProductsCount={totalProductsCount}
      page={page}
      limit={limit}
      keyword={keyword}
    />
  );
}
