"use client";

import BlogExcerpt from "@/components/BlogExcerpt";
import Button from "@/components/ui/Button";
import DropdownMenu, { DropdownMenuClose } from "@/components/ui/DropdownMenu";
import { smartTrim } from "@/lib/utils";
import { BlogProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import Delete from "./Delete";

const Trigger = (
  <Button variant="ghost" type="button" aria-label="more" size="sm">
    <HiDotsVertical />
  </Button>
);

export default function BlogCardAdmin({ blog }: { blog: BlogProps }) {
  return (
    <div key={blog.id} className="mb-2">
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
        <DropdownMenu trigger={Trigger} className="mr-3">
          <div className="p-2 flex gap-2">
            <DropdownMenuClose asChild>
              <Link href={`/dashboard/admin/blog/edit-blog/${blog.slug}`} className="flex-1">
                <Button>Edit</Button>
              </Link>
            </DropdownMenuClose>
            <Delete blog={blog} />
          </div>
        </DropdownMenu>
      </div>
    </div>
  );
}
