"use client";

import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import Edit from "./Edit";
import Delete from "./Delete";
import { ProductCategory } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
// import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";

export default function List({ productCategories }: { productCategories: ProductCategory[] | undefined }) {
  // export default function List() {
  const [isEdit, setIsEdit] = useState<string | null>(null);
  // const { data: productCategories, isLoading: pending } = useProductCategory();
  // if (pending) return <div className="p-4 text-center">Loading categories...</div>;

  if (!productCategories || productCategories.length === 0) {
    return <h2 className="h2 text-center py-10">No Blog Category Found</h2>;
  }

  return (
    <div>
      <h2 className="h2 mb-4">Product Category List</h2>
      {productCategories
        // ?.sort((a, b) => a.name.localeCompare(b.name))
        ?.map((category: ProductCategory) => (
          <div key={category.id} className="flex items-center gap-2 mb-1">
            <div className="w-full">
              {isEdit === category.id ? (
                <Edit category={category} setIsEdit={setIsEdit} />
              ) : (
                <div
                  className={`${category.isDefault ? "opacity-50 pointer-none" : "cursor-text"} border py-2 px-3 rounded border-gray-200 w-full cursor-text`}
                  onClick={() => {
                    if (!category.isDefault) setIsEdit(category.id);
                  }}
                >
                  {category.name}
                </div>
              )}
            </div>
            {isEdit !== category.id ? (
              <div className="flex items-center gap-2">
                <Button
                  size={"icon"}
                  type="button"
                  aria-label="Edit"
                  onClick={() => setIsEdit(category?.id)}
                  disabled={category.isDefault}
                >
                  <FaPenToSquare />
                </Button>
                <Delete category={category} />
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
}
