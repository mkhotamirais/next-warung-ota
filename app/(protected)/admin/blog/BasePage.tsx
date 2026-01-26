import { getBlogs } from "@/actions/blog";
import List from "./List";
// import SearchBlogAdmin from "./SearchBlogAdmin";
import AuthTitleHeader from "@/components/AuthTitleHeader";

export default async function BasePage({ page, limit, keyword }: { page: number; limit: number; keyword?: string }) {
  const { blogs, totalBlogsCount, totalPages } = await getBlogs({ page, limit, keyword });

  return (
    <>
      <AuthTitleHeader
        title="Blog List"
        totalCount={totalBlogsCount}
        url="/admin/blog/create-blog"
        label="Create Blog"
      />
      {/* <div className="mb-4">
        <SearchBlogAdmin />
      </div> */}
      <List
        blogs={blogs}
        page={page}
        totalPages={totalPages}
        totalBlogsCount={totalBlogsCount}
        limit={limit}
        keyword={keyword}
      />
    </>
  );
}
