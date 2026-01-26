import { redirect } from "next/navigation";
import EditBlogForm from "./EditBlogForm";
import { getBlogBySlug } from "@/actions/blog";
import { getBlogCategories } from "@/actions/blog-category";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import EditBlogWrapper from "./EditBlogWrapper";

export default async function EditBlog({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const blogCategories = await getBlogCategories();
  const blog = await getBlogBySlug(slug);

  if (!blogCategories?.length || !blog) redirect("/dashboard/blog-category");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h1">Edit Blog</h1>
        <Button asChild>
          <Link href="/admin/blog">Go to Blog List</Link>
        </Button>
      </div>{" "}
      <EditBlogForm blogCategories={blogCategories} blog={blog} />
    </>
  );
  // return <EditBlogWrapper />;
}
