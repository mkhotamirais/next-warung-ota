"use client";

import { deleteBlog } from "@/actions/blog";
import Button from "@/components/ui/Button";
import { useCloseModal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteAction({ slug }: { slug: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const closeModal = useCloseModal();

  const handleDelete = () => {
    startTransition(async () => {
      // const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      // const result = await res.json();
      const result = await deleteBlog(slug);
      if (result?.error) {
        toast.error(result.error);
      }
      toast.success(result.message);
      closeModal();
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={pending}
      pending={pending}
      onClick={handleDelete}
      className="w-28"
    >
      Delete
    </Button>
  );
}
