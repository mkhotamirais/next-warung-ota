import { redirect } from "next/navigation";
import EditBlogForm from "./EditBlogForm";
import { getBlogBySlug } from "@/actions/blog";
import { getBlogCategories } from "@/actions/blog-category";
// import EditBlogWrapper from "./EditBlogWrapper";

export default async function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const blogCategories = await getBlogCategories();
  const blog = await getBlogBySlug(slug);

  if (!blogCategories?.length || !blog) redirect("/dashboard/blog-category");

  return <EditBlogForm blogCategories={blogCategories} blog={blog} />;
  // return <EditBlogWrapper />;
}
