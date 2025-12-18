"use client";

import { BlogProps } from "@/types/types";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCloseDropdownMenu } from "@/components/ui/DropdownMenu";
import DeleteAction from "./DeleteAction";

export default function Delete({ blog }: { blog: BlogProps }) {
  const closeDropdownMenu = useCloseDropdownMenu();

  const trigger = (
    <Button
      onClick={() => {
        setTimeout(() => {
          closeDropdownMenu();
        }, 0);
      }}
      variant="destructive"
      className="flex-1"
    >
      Delete
    </Button>
  );

  return (
    <Modal trigger={trigger} className="flex-1">
      <p>
        Delete <b>{blog.title}</b>, this action cannot be undone, are you sure?
      </p>
      <div className="flex gap-2 mt-4">
        <DeleteAction slug={blog.slug} />
        <ModalClose asChild>
          <Button type="button" variant="secondary" className="w-28">
            Cancel
          </Button>
        </ModalClose>
      </div>
    </Modal>
  );
}
