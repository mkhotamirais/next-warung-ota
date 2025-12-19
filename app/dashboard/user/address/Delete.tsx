"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useCloseDropdownMenu } from "@/components/ui/DropdownMenu";
import { deleteAddress } from "@/actions/account";
import { Address } from "@/lib/generated/prisma";

interface DeleteProps {
  address: Address;
}

export default function Delete({ address }: DeleteProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const closeDropdownMenu = useCloseDropdownMenu();

  const trigger = (
    <Button
      onClick={() => {
        setTimeout(() => {
          closeDropdownMenu();
        }, 0);
      }}
      variant="destructive"
      className="w-fit"
    >
      Delete
    </Button>
  );

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAddress(address.id);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };
  return (
    <Modal trigger={trigger} className="flex-1">
      <p>
        Delete <b>{address.label}</b>, this action cannot be undone, are you sure?
      </p>
      <div className="flex gap-2 mt-4">
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
        <ModalClose asChild>
          <Button type="button" variant="secondary" className="w-28">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </Modal>
  );
}
