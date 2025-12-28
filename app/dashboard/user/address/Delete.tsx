"use client";

import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCloseDropdownMenu } from "@/components/ui/DropdownMenu";
import { Address } from "@/lib/generated/prisma";
import DeleteAction from "./DeleteAction";

interface DeleteProps {
  address: Address;
}

export default function Delete({ address }: DeleteProps) {
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

  return (
    <Modal trigger={trigger} className="flex-1">
      <p>
        Delete <b>{address.label}</b>, this action cannot be undone, are you sure?
      </p>
      <div className="flex gap-2 mt-4">
        <DeleteAction id={address.id} />
        <ModalClose asChild>
          <Button type="button" variant="secondary" className="w-28">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </Modal>
  );
}
