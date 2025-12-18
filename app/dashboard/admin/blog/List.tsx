// "use client";

import Pagination from "@/components/ui/Pagination";
import BlogCardAdmin from "./BlogCardAdmin";
import { BlogProps } from "@/types/types";
// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";

interface BlogListProps {
  blogs: BlogProps[];
  page: number;
  limit: number;
  keyword?: string;
  totalPages: number;
  totalBlogsCount: number;
}

export default function List({ blogs, page, limit, totalPages, totalBlogsCount }: BlogListProps) {
  // export default function List() {
  // const [blogs, setBlogs] = useState<BlogProps[]>([]);
  // const [totalBlogsCount, setTotalBlogsCount] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);
  // const keyword = searchParams.get("keyword");

  // useEffect(() => {
  //   const getBlogs = async () => {
  //     const res = await fetch(`/api/blog?page=${page}&limit=${limit}&keyword=${keyword || ""}`);
  //     const data = await res.json();

  //     setBlogs(data.blogs);
  //     setTotalBlogsCount(data.totalBlogsCount);
  //     setTotalPages(data.totalPages);
  //   };
  //   getBlogs();
  // }, [page, limit, keyword]);

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
