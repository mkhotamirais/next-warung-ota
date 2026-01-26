"use client";

import { BlogProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { deleteBlog } from "@/actions/blog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IDelete {
  blog: BlogProps;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Delete({ blog, setOpen }: IDelete) {
  const [openDialog, setOpenDialog] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  // const { deleteBlog, isDeleting: pending } = useBlog();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    // const result = await res.json();
    const result = await deleteBlog(blog.slug);
    // const result = await deleteBlog(slug);
    if (result?.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }
    setPending(false);
    toast.success(result.message);
    setOpen(false);
    setOpenDialog(false);

    router.refresh();
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex-1">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Blog <b>{blog.title}</b>
          </DialogTitle>
          <DialogDescription>
            Delete <b>{blog.title}</b>, this action cannot be undone, are you sure?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleDelete} type="button" variant="destructive" disabled={pending} className="w-28">
            {pending && <Spinner />}
            Delete
          </Button>{" "}
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-28">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
