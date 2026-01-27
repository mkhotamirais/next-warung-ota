import React from "react";
import CreateBlogForm from "./CreateBlogForm";
import { getBlogCategories } from "@/actions/blog-category";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateBlog() {
  const blogCategories = await getBlogCategories();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h1">Create Blog</h1>
        <Button asChild>
          <Link href="/admin/blog">Go to Blog List</Link>
        </Button>
      </div>
      <CreateBlogForm blogCategories={blogCategories} />
    </>
  );
}
