"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { ProductProps } from "@/types/types";
import { formatRupiah, smartTrim } from "@/lib/utils";
import DropdownMenu, { DropdownMenuClose } from "../../../../components/ui/DropdownMenu";
import Delete from "@/app/dashboard/admin/product/Delete";

const Trigger = (
  <Button variant="ghost" type="button" aria-label="more" size="sm">
    <HiDotsVertical />
  </Button>
);

export default function ProductCardAdmin({ product }: { product: ProductProps }) {
  return (
    <div className="flex justify-between mb-2 items-center w-full border border-gray-300 bg-white rounded">
      <div className="flex gap-2 w-full p-1">
        <Link href={`/product/detail/${product.slug}`} className="">
          <Image
            src={product?.imageUrl || "/images/logo-warungota.png"}
            alt={product.name}
            width={50}
            height={50}
            className="size-14 min-w-14"
          />
        </Link>
        <div className="flex flex-col gap-1">
          <Link href={`/product/detail/${product.slug}`} className="hover:underline">
            <h3 className="first-letter:capitalize leading-none">{smartTrim(product.name, 45)}</h3>
          </Link>
          <p className="font-semibold">Rp{formatRupiah(product.price)}</p>
          {/* <div className="text-sm text-gray-600 flex gap-2">
              <span>{product.ProductCategory?.name || "category"}</span>
              <span>•</span>
              <span>{product.User.name}</span>
            </div> */}
        </div>
      </div>
      <DropdownMenu trigger={Trigger} className="mr-3">
        <div className="p-2 flex gap-2">
          <DropdownMenuClose asChild>
            <Link href={`/dashboard/admin/product/edit-product/${product.slug}`}>
              <Button className="w-fit">Edit</Button>
            </Link>
          </DropdownMenuClose>
          <Delete product={product} />
        </div>
      </DropdownMenu>
    </div>
  );
}
