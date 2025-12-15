import { getBlogs } from "@/actions/blog";
import List from "./List";

const limit = 24;
export default async function BlogListWrapper() {
  const initialData = await getBlogs({
    page: 1,
    limit,
  });

  const hasMore = initialData.totalBlogsCount > limit;
  const nextPage = 2;

  if (initialData.totalBlogsCount === 0) return <p className="text-center py-10">Blog not found</p>;

  return <List initialBlogs={initialData.blogs} initialHasMore={hasMore} initialNextPage={nextPage} limit={limit} />;
}
