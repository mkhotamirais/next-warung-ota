"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BlogProps } from "@/types/types";
import Modal, { ModalClose } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { deleteBlog } from "@/actions/blog";
import { useCloseDropdownMenu } from "@/components/ui/DropdownMenu";

export default function Delete({ blog }: { blog: BlogProps }) {
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
      className="flex-1"
    >
      Delete
    </Button>
  );

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBlog(blog.id);
      if (result?.error) {
        toast.error(result.error);
      }
      router.refresh();
      if (result?.message) {
        toast.success(result.message);
      }
    });
  };
  return (
    <Modal trigger={trigger} className="flex-1">
      <p>
        Delete <b>{blog.title}</b>, this action cannot be undone, are you sure?
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
