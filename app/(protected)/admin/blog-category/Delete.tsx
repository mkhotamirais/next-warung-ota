"use client";

import { useRouter } from "next/navigation";
import { BlogCategory } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { deleteBlogCategory } from "@/actions/blog-category";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaTrash } from "react-icons/fa6";
// import { useBlogCategory } from "@/hooks/tanstack-hooks/useBlogCategory";

interface DeleteProps {
  category: BlogCategory;
}

export default function Delete({ category }: DeleteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(false);
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
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant="destructive" disabled={category.isDefault}>
          <FaTrash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category {category.name}</DialogTitle>
          <DialogDescription>
            Delete <b>{category.name}</b>, this action cannot be undone, are you sure?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button variant="destructive" type="button" disabled={pending} onClick={handleDelete} className="w-28">
            {pending && <Spinner />}
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" className="w-28">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
