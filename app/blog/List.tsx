"use client";

import { useState, useCallback } from "react";
import BlogCard from "@/components/BlogCard";
import { Sentinel } from "@/components/Sentinel";
import { getBlogs } from "@/actions/blog";
import { BlogProps } from "@/types/types"; // Asumsikan tipe ini sudah benar

const blogFetcherWrapper = async (page: number) => {
  const limit = 18;

  const data = await getBlogs({ page, limit });

  return {
    items: data.blogs as BlogProps[],
    hasMore: data.hasMore,
    nextPage: data.nextPage,
  };
};

interface BlogListProps {
  initialBlogs: BlogProps[] | undefined | null;
  initialTotalPages?: number;
  initialHasMore?: boolean;
  initialNextPage?: number;
  limit: number;
}

export default function List({ initialBlogs, initialHasMore = false, initialNextPage = 2, limit }: BlogListProps) {
  const [blogs, setBlogs] = useState<BlogProps[]>(initialBlogs || []);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const handleLoadMore = useCallback((newBlogs: BlogProps[], newHasMore: boolean) => {
    setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
    setHasMore(newHasMore);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="">
        {blogs.map((item) => (
          <BlogCard key={item.id} blog={item} />
        ))}
      </div>

      {hasMore && (
        <Sentinel<BlogProps>
          initialNextPage={initialNextPage}
          onLoadMore={handleLoadMore}
          fetcher={blogFetcherWrapper}
        />
      )}

      {!hasMore && blogs.length > 0 && (
        <p className="col-span-full text-center text-gray-400 mt-8">Semua produk telah ditampilkan.</p>
      )}
    </div>
  );
}
