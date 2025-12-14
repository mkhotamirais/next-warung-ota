import React from "react";
import CreateBlogForm from "./CreateBlogForm";
import { getBlogCategories } from "@/actions/blog-category";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();

  return (
    <div>
      <CreateBlogForm blogCategories={blogCategories} />
    </div>
  );
}
