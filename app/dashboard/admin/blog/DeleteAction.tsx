"use client";

import { deleteBlog } from "@/actions/blog";
import Button from "@/components/ui/Button";
import { useCloseModal } from "@/components/ui/Modal";
// import { useBlog } from "@/hooks/tanstack-hooks/useBlog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAction({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  // const { deleteBlog, isDeleting: pending } = useBlog();
  const closeModal = useCloseModal();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    // const result = await res.json();
    const result = await deleteBlog(slug);
    // const result = await deleteBlog(slug);
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
