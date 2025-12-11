"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";
import { useTransition } from "react";
import Button from "@/components/ui/Button";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import DropdownMenu, { DropdownMenuClose } from "@/components/ui/DropdownMenu";
import { deleteProductCategory } from "@/actions/product-category";

export default function Delete({ category }: { category: ProductCategory }) {
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductCategory(category.id);

      if (result?.error) {
        toast.error(result.error);
      }
      router.refresh();
    });
  };

  return (
    <DropdownMenu
      trigger={
        <div aria-label="Delete" className="text-red-500 p-2 rounded border flex border-red-500">
          <FaTrash />
        </div>
      }
      title="Delete Product"
    >
      <div className="p-2">
        <p>
          Delete <b>{category.name}</b>, this action cannot be undone, are you sure?
        </p>
        <div className="flex gap-2 mt-4">
          <DropdownMenuClose asChild>
            <Button variant="destructive" type="button" disabled={pending} pending={pending} onClick={handleDelete}>
              Delete
            </Button>
          </DropdownMenuClose>
          <DropdownMenuClose asChild>
            <Button type="button">Cancel</Button>
          </DropdownMenuClose>
        </div>
      </div>
    </DropdownMenu>
  );
}
