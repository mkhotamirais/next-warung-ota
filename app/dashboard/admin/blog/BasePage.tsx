import Button from "@/components/ui/Button";
import Link from "next/link";
import { getBlogs } from "@/actions/blog";
import List from "./List";
import SearchBlogAdmin from "./SearchBlogAdmin";

export default async function BasePage({ page, limit, keyword }: { page: number; limit: number; keyword?: string }) {
  const { totalBlogsCount } = await getBlogs();
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h2">Blog List ({totalBlogsCount})</h2>
        <Link href="/dashboard/admin/blog/create-blog">
          <Button>Create Blog</Button>
        </Link>
      </div>
      <div className="mb-4">
        <SearchBlogAdmin />
      </div>
      <List page={page} limit={limit} keyword={keyword} />
    </>
  );
}
