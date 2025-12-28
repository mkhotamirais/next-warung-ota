export const dynamic = "force-dynamic";

import List from "./List";
import Create from "./Create";
import { getProductCategories } from "@/actions/product-category";

export default async function ProductCategory() {
  const productCategories = await getProductCategories();

  return (
    <>
      <Create />
      <List productCategories={productCategories} />
      {/* <List /> */}
    </>
  );
}
