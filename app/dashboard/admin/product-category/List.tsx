"use client";

import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import Edit from "./Edit";
import Delete from "./Delete";
import { ProductCategory } from "@/lib/generated/prisma";

export default function List({ productCategories }: { productCategories: ProductCategory[] | undefined }) {
  const [isEdit, setIsEdit] = useState<string | null>(null);

  if (!productCategories?.length) return <h2 className="h2">No Product Category</h2>;

  return (
    <div>
      <h2 className="h2 mb-4">Product Category List</h2>
      {productCategories?.map((category) => (
        <div key={category.id} className="flex items-center gap-2 mb-1">
          <div className="w-full">
            {isEdit === category.id ? (
              <Edit category={category} setIsEdit={setIsEdit} />
            ) : (
              <div
                className="border py-2 px-3 rounded border-gray-200 w-full cursor-text"
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
              <button
                type="button"
                aria-label="Edit"
                className="text-blue-500 p-2 border rounded disabled:opacity-50"
                onClick={() => setIsEdit(category?.id)}
                disabled={category.isDefault}
              >
                <FaPenToSquare />
              </button>
              <Delete category={category} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
