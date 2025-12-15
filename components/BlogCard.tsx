import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogExcerpt from "./BlogExcerpt";
import { smartTrim } from "@/lib/utils";

interface BlogCardProps {
  blog: BlogProps;
  content?: boolean;
}

export default function BlogCard({ blog, content = true }: BlogCardProps) {
  return (
    <div className="mb-6 rounded overflow-hidden flex flex-col sm:flex-row gap-4 bg-white">
      <Link href={`/blog/detail/${blog.slug}`} className="w-full sm:w-1/3 h-64 sm:h-48 block">
        <Image
          src={blog?.imageUrl || "/images/logo-warungota.png"}
          alt={blog.title}
          width={500}
          height={500}
          className="w-full h-full object-contain object-center"
        />
      </Link>
      <div className="w-full sm:w-2/3 space-y-3 p-4">
        <Link href={`/blog/detail/${blog.slug}`} className="hover:underline block">
          <h3 className="h3">{blog.title}</h3>
        </Link>
        <BlogExcerpt blog={blog} />
        {content ? (
          <div className="text-content" dangerouslySetInnerHTML={{ __html: smartTrim(blog.content, 210) }}></div>
        ) : null}
      </div>
    </div>
  );
}
