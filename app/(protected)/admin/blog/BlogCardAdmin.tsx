"use client";

import BlogExcerpt from "@/components/BlogExcerpt";
import { smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function BlogCardAdmin({ blog }: { blog: BlogProps }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center w-full border border-gray-300 bg-gray-100 rounded">
        <div className="flex gap-2 w-full p-1">
          <Link href={`/blog/detail/${blog.slug}`} className="">
            <Image
              src={blog?.imageUrl || "/images/logo-warungota.png"}
              alt={blog.title}
              width={50}
              height={50}
              className="size-14"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <Link href={`/blog/detail/${blog.slug}`} className="hover:underline">
              <h3 className="h3">{smartTrim(blog.title, 40)}</h3>
            </Link>
            <BlogExcerpt blog={blog} />
          </div>
        </div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild className="mr-2">
            <Button variant="ghost" type="button" aria-label="more" size="icon">
              <HiDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex gap-2 p-2">
            <Button asChild>
              <Link href={`/admin/blog/edit-blog/${blog.slug}`} className="flex-1">
                Edit
              </Link>
            </Button>
            <Delete blog={blog} setOpen={setOpen} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
