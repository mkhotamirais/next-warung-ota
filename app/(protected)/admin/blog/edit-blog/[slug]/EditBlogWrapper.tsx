"use client";

import { useBlogDetail } from "@/hooks/tanstack-hooks/useBlog";
import { useParams } from "next/navigation";
import EditBlogForm from "./EditBlogForm";
import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";
import { BlogCategory } from "@/lib/generated/prisma";

export default function EditBlogWrapper() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: blog, isPending } = useBlogDetail(slug);
  const { data: blogCategories }: { data: BlogCategory[] | undefined } = useBlogCategory();

  if (isPending) return <div>Loading...</div>;

  return <EditBlogForm key={blog?.id} blog={blog} blogCategories={blogCategories || []} />;
}
