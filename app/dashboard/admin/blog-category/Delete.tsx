"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Button from "@/components/ui/Button";
import { BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { deleteBlogCategory } from "@/actions/blog-category";
import { ModalClose, useCloseModal } from "@/components/ui/Modal";

interface DeleteProps {
  category: BlogCategory;
}

export default function Delete({ category }: DeleteProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const closeModal = useCloseModal();

  const handleDelete = () => {
    startTransition(async () => {
      // const res = await fetch(`/api/blog-category/${category.id}`, { method: "DELETE" });
      // const result = await res.json();
      const result = await deleteBlogCategory(category.id);

      if (result?.error) {
        toast.error(result.error);
      }
      closeModal();
      router.refresh();
      if (result?.message) {
        toast.success(result.message);
      }
    });
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
