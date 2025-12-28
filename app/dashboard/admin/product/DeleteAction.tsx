"use client";

import Button from "@/components/ui/Button";
import { useCloseModal } from "@/components/ui/Modal";
import { deleteProduct } from "@/actions/product";
// import { useProduct } from "@/hooks/tanstack-hooks/useProduct";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAction({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  // const { deleteProduct, isDeleting: pending } = useProduct();
  const closeModal = useCloseModal();

  const handleDelete = async () => {
    setPending(true);
    //   const res = await fetch(`/api/product/${slug}`, { method: "DELETE" });
    //   const result = await res.json();
    const result = await deleteProduct(slug);

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
