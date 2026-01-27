"use client";

import { Address } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button-tmp";
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
import { deleteAddress } from "@/actions/account";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useAddress } from "@/hooks/tanstack-hooks/useAddress";

interface IDelete {
  address: Address;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Delete({ address, setOpen }: IDelete) {
  const [openDialog, setOpenDialog] = useState(false);
  const [pending, setPending] = useState(false);
  // const { deleteAddress, isDeleting: pending } = useAddress();
  const router = useRouter();

  const handleDelete = async () => {
    setPending(true);
    // const res = await fetch(`/api/account/address/${id}`, { method: "DELETE" });
    // const result = await res.json();
    const result = await deleteAddress(address.id);

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
        <Button variant="destructive" className="w-fit">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete <b>{address.label}</b>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <p>This action cannot be undone, are you sure?</p>
        <div className="flex gap-2 mt-2">
          <Button type="button" variant="destructive" disabled={pending} onClick={handleDelete} className="w-28">
            {pending && <Spinner />}
            Delete
          </Button>
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
