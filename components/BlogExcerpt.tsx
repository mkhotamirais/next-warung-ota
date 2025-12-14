import { diffForHumans } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Link from "next/link";
import React from "react";

export default function BlogExcerpt({ blog, className }: { blog: BlogProps; className?: string }) {
  return (
    <div className={`${className} flex flex-wrap gap-2 items-center text-sm leading-tight text-gray-600`}>
      <Link href={`/blog/category/${blog.BlogCategory.slug}`} className="link capitalize">
        {blog.BlogCategory.name}
      </Link>
      <span>•</span>
      <span>{diffForHumans(blog.createdAt)}</span>
    </div>
  );
}
