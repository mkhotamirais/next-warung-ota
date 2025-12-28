"use client";

import { deleteAddress } from "@/actions/account";
import Button from "@/components/ui/Button";
import { useCloseModal } from "@/components/ui/Modal";
// import { useAddress } from "@/hooks/tanstack-hooks/useAddress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAction({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  // const { deleteAddress, isDeleting: pending } = useAddress();
  const router = useRouter();
  const closeModal = useCloseModal();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/account/address/${id}`, { method: "DELETE" });
    // const result = await res.json();
    const result = await deleteAddress(id);

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
