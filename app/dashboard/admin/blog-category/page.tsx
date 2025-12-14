export const dynamic = "force-dynamic";

import List from "./List";
import Create from "./Create";
import { getBlogCategories } from "@/actions/blog-category";

export default async function BlogCategory() {
  const blogCategories = await getBlogCategories();

  return (
    <>
      <Create />
      <List blogCategories={blogCategories} />
    </>
  );
}
