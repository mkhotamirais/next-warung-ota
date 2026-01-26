"use client";

import Pagination from "@/components/ui/Pagination";
import BlogCardAdmin from "./BlogCardAdmin";
import { BlogProps } from "@/types/types";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";
// import { useParams, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

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
  // const searchParams = useSearchParams();
  // const params = useParams();
  // const page = Number(params.page || 1);
  // const limit = Number(searchParams.get("limit") || 8);
  // const keyword = searchParams.get("keyword");

  // const { data, isLoading } = useBlog(page, limit, keyword || "");
  // const blogs = data?.blogs as BlogProps[];
  // const totalPages = data?.totalPages as number;
  // const totalBlogsCount = data?.totalBlogsCount as number;

  // if (isLoading) return <h2>Loading...</h2>;

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
        <Pagination totalPages={totalPages} currentPage={page} path="/admin/blog/page" />
      ) : null}
    </>
  );
}
