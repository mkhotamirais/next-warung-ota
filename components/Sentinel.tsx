// components/Sentinel.tsx

"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState, useCallback } from "react";

type FetcherFunction<T> = (page: number) => Promise<{
  products: T[];
  hasMore: boolean;
  nextPage: number;
}>;

interface SentinelProps<T> {
  initialNextPage: number;
  onLoadMore: (newItems: T[], hasMore: boolean) => void;
  fetcher: FetcherFunction<T>;
}

export function Sentinel<T>({ initialNextPage, onLoadMore, fetcher }: SentinelProps<T>) {
  const [page, setPage] = useState(initialNextPage);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    rootMargin: "100px 0px",
    threshold: 0.1,
  });

  const fetchNextPage = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = await fetcher(page);

      if (data.products.length > 0) {
        onLoadMore(data.products, data.hasMore);

        setPage(data.nextPage);
      } else {
        onLoadMore([], false);
      }
    } catch (error) {
      console.error("Failed to fetch next page:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, onLoadMore, fetcher]); // <-- Dependency pada 'page'

  useEffect(() => {
    if (inView && !isLoading) {
      fetchNextPage();
    }
  }, [inView, isLoading, fetchNextPage]);

  return (
    <div ref={ref} className="h-10 col-span-full flex justify-center items-center py-4">
      {isLoading && <span className="text-blue-500">Memuat lebih banyak data...</span>}
    </div>
  );
}
