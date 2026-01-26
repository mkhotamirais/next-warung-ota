export const dynamic = "force-dynamic";

import List from "./List";
import Create from "./Create";
import { getBlogCategories } from "@/actions/blog-category";

export default async function BlogCategory() {
  const blogCategories = await getBlogCategories();

  return (
    <>
      <h1 className="h1 mb-4">Blog Category List</h1>
      <div className="space-y-4">
        <Create />
        <List blogCategories={blogCategories} />
      </div>
    </>
  );
}
