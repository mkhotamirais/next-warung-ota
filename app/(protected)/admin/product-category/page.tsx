export const dynamic = "force-dynamic";

import List from "./List";
import Create from "./Create";
import { getProductCategories } from "@/actions/product-category";

export default async function ProductCategory() {
  const productCategories = await getProductCategories();

  return (
    <>
      <h1 className="h1 mb-4">Product Category List</h1>
      <div className="space-y-4">
        <Create />
        <List productCategories={productCategories} />
        {/* <List /> */}
      </div>
    </>
  );
}
