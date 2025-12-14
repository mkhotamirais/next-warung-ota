import Pagination from "@/components/ui/Pagination";
import { getBlogs } from "@/actions/blog";
import BlogCardAdmin from "./BlogCardAdmin";

interface BlogListProps {
  page: number;
  limit: number;
  keyword?: string;
}

export default async function List({ page, limit, keyword }: BlogListProps) {
  const { blogs, totalPages, totalBlogsCount } = await getBlogs({ page, limit, keyword });

  return (
    <>
      <div>
        {blogs?.length ? (
          <div>
            {blogs?.map((blog) => (
              <BlogCardAdmin key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <h2>No Blog Found</h2>
        )}
      </div>
      {totalBlogsCount > limit ? (
        <Pagination totalPages={totalPages} currentPage={page} path="/dashboard/admin/blog/page" />
      ) : null}
    </>
  );
}
