"use client";

import { CartItemProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteIcon, Trash } from "lucide-react";
import { useState } from "react";

interface DeleteCartItemProps {
  pendingDel: string | null;
  item: CartItemProps;
  handleDeleteItem: (productId: string) => void;
}

export default function DeleteCartItem({ pendingDel, item, handleDeleteItem }: DeleteCartItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive" aria-label="delete cart trigger">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus item {item.Product.name}</DialogTitle>
          <DialogDescription>Apakah kamu yakin unuk menghapus item ini?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-1">
          <Button
            variant="destructive"
            className="w-24"
            disabled={pendingDel === item.Product.id}
            onClick={() => {
              handleDeleteItem(item.Product.id);
              setTimeout(() => {
                setOpen(false);
              }, 1500);
            }}
          >
            {pendingDel === item.Product.id && <Spinner />}
            Hapus
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" className="w-24">
              cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
