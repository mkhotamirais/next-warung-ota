"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";
import { useTransition } from "react";
import Button from "@/components/ui/Button";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import DropdownMenu, { DropdownMenuClose } from "@/components/ui/DropdownMenu";

export default function Delete({ category }: { category: ProductCategory }) {
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await fetch(`/api/product-category/${category.id}`, { method: "DELETE" });

      const result = await res.json();

      if (result?.error) {
        toast.error(result.error);
        return;
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
          <Button variant="destructive" type="button" disabled={pending} pending={pending} onClick={handleDelete}>
            Delete
          </Button>
          <DropdownMenuClose asChild>
            <Button type="button">Cancel</Button>
          </DropdownMenuClose>
        </div>
      </div>
    </DropdownMenu>
  );
}
