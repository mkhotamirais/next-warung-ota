"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { deleteBlogCategory } from "@/actions/blog-category";
import { ModalClose, useCloseModal } from "@/components/ui/Modal";
import { useState } from "react";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";

interface DeleteProps {
  category: BlogCategory;
}

export default function Delete({ category }: DeleteProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const closeModal = useCloseModal();
  // const { deleteCategory, isDeleting: pending } = useBlogCategory();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/blog-category/${category.id}`, { method: "DELETE" });
    // const result = await res.json();
    // const result = await deleteCategory(category.id);
    const result = await deleteBlogCategory(category.id);

    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }
    setPending(false);
    toast.success(result.message);
    closeModal();
    router.refresh();
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
