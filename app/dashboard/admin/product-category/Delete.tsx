"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { ProductCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { deleteProductCategory } from "@/actions/product-category";
import { ModalClose, useCloseModal } from "@/components/ui/Modal";
// import { useProductCategory } from "@/hooks/tanstack-hooks/useProductCategory";

interface DeleteProps {
  category: ProductCategory;
}

export default function Delete({ category }: DeleteProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const closeModal = useCloseModal();
  // const { deleteCategory, isDeleting: pending } = useProductCategory();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/product-category/${category.id}`, { method: "DELETE" });
    // const result = await res.json();
    // const result = await deleteCategory(category.id);
    const result = await deleteProductCategory(category.id);

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }
    setPending(false);
    closeModal();
    router.refresh();
    toast.success(result.message);
  };

  return (
    <>
      <p>
        Delete <b>{category.name}</b>, this action cannot be undone, are you sure?
      </p>
      <div className="flex gap-2 mt-4">
        <Button
          variant="destructive"
          type="button"
          disabled={pending}
          pending={pending}
          onClick={handleDelete}
          className="w-28"
        >
          Delete
        </Button>
        <ModalClose asChild>
          <Button type="button" className="w-28">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </>
  );
}
