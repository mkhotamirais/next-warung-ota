"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  path: string;
}

export default function Pagination({ totalPages, currentPage, path }: PaginationProps) {
  const [inputPage, setInputPage] = useState(String(currentPage));

  // Sinkronkan state input dengan currentPage dari URL
  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const handleInputJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        // Navigasi menggunakan Next.js Link
        window.location.href = `${path}/${pageNum}`;
      } else {
        // Reset input jika tidak valid
        setInputPage(String(currentPage));
      }
    }
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  return (
    <div className="flex items-center gap-2 py-4">
      <Link href={`${path}/${prevPage}`}>
        <button
          type="button"
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        >
          &laquo; Prev
        </button>
      </Link>

      <label htmlFor="page" className="sr-only">
        page
      </label>
      <input
        type="number"
        id="page"
        name="page"
        value={inputPage}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setInputPage(e.target.value)}
        onKeyDown={handleInputJump}
        className="w-12 text-center border rounded-md disabled:opacity-50"
        min="1"
        max={totalPages}
        disabled={totalPages <= 1}
      />
      <span>/ {totalPages}</span>

      <Link href={`${path}/${nextPage}`}>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
        >
          Next &raquo;
        </button>
      </Link>
    </div>
  );
}
