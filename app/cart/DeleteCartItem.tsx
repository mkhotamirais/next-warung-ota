"use client";

import Button from "@/components/ui/Button";
import { ModalClose } from "@/components/ui/Modal";
import { CartItemProps } from "@/types/types";
import { useCloseModal } from "@/components/ui/Modal";

interface DeleteCartItemProps {
  pendingDel: string | null;
  item: CartItemProps;
  handleDeleteItem: (productId: string) => void;
}

export default function DeleteCartItem({ pendingDel, item, handleDeleteItem }: DeleteCartItemProps) {
  const closeModal = useCloseModal();

  return (
    <div className="">
      <p className="mb-4">Apakah kamu yakin ingin menghapus item ini?</p>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="destructive"
          className="w-32"
          disabled={pendingDel === item.Product.id}
          pending={pendingDel === item.Product.id}
          onClick={() => {
            handleDeleteItem(item.Product.id);
            setTimeout(() => {
              closeModal();
            }, 1500);
          }}
        >
          Hapus
        </Button>
        <ModalClose asChild>
          <Button size="sm" variant="secondary" className="w-32">
            cancel
          </Button>
        </ModalClose>
      </div>
    </div>
  );
}
