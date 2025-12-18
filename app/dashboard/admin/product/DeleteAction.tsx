"use client";

import { deleteProduct } from "@/actions/product";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteAction({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      //   const res = await fetch(`/api/product/${slug}`, { method: "DELETE" });
      //   const result = await res.json();
      const result = await deleteProduct(slug);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);

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
