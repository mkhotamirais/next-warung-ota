"use client";

import Modal from "@/components/ui/Modal";
import { useCart } from "@/hooks/useCart";
import { formatRupiah, smartTrim } from "@/lib/utils";
import { CartItemProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSpinner, FaTrash } from "react-icons/fa6";
import DeleteCartItem from "./DeleteCartItem";

interface CartListProps {
  item: CartItemProps;
  handleUpdate: (itemToUpdate: CartItemProps, newQty: number, newCheck: boolean) => void;
  handleDeleteItem: (productId: string) => void;
}

export default function CartList({ item, handleUpdate, handleDeleteItem }: CartListProps) {
  const [qty, setQty] = useState(item.quantity.toString());
  const [check, setCheck] = useState(item.isChecked);
  const { pendingSaving, pendingDel } = useCart();

  useEffect(() => {
    const settingQtyAndCheck = () => {
      setQty(item.quantity.toString());
      setCheck(item.isChecked);
    };

    settingQtyAndCheck();
  }, [item.quantity, item.isChecked]);

  const handleChangeCheck = () => {
    const newCheckStatus = !check;
    setCheck(newCheckStatus);
    handleUpdate(item, item.quantity, newCheckStatus);
  };

  const handleDecrement = () => {
    if (parseInt(qty) > 1) {
      const newQty = parseInt(qty) - 1;
      setQty(String(newQty));
      setCheck(true);
      handleUpdate(item, newQty, true);
    } else {
      handleDeleteItem(item.Product.id);
    }
  };

  const handleIncrement = () => {
    const newQty = parseInt(qty) + 1;
    setQty(String(newQty));
    setCheck(true);
    handleUpdate(item, newQty, true);
  };

  const handleChange = (value: string) => {
    setQty(value);
  };

  const handleBlur = () => {
    const newQty = parseInt(qty);

    if (isNaN(newQty) || newQty < 1) {
      setQty(item.quantity.toString());
    } else if (newQty !== item.quantity) {
      setQty(String(newQty));
      setCheck(true);
      handleUpdate(item, newQty, true);
    }
  };

  return (
    <>
      <div
        key={item.id}
        className={`flex justify-between mb-4 border-b border-gray-300 pb-4 relative ${
          pendingSaving === item.Product.id ? "pointer-events-none *:opacity-50" : ""
        }`}
      >
        {pendingSaving === item.Product.id && (
          <div className="absolute inset-0 bg-white opacity-50 flex items-center justify-center">
            <FaSpinner className="animate-spin text-xl text-primary" />
          </div>
        )}

        <div className={`flex gap-4 items-center`}>
          <input
            aria-label="Checkbox"
            type="checkbox"
            checked={check}
            onChange={handleChangeCheck}
            className="shrink-0 size-4 accent-primary rounded cursor-pointer"
            disabled={pendingSaving === item.Product.id}
          />
          <Image
            src={item.Product.imageUrl || "/images/logo-warungota.png"}
            alt={"Product"}
            width={100}
            height={100}
            className="size-20 object-cover object-center"
          />
          <div className="space-y-2 text-sm">
            <Link href={`/product/detail/${item.Product.slug}`} className="hover:underline">
              <h3 className="capitalize font-semibold">{smartTrim(item.Product.name, 40)}</h3>
            </Link>
            <p>
              <span className="text-xs">Rp</span>
              {formatRupiah(item.Product.price)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Decrement"
                disabled={pendingSaving === item.Product.id}
              >
                {qty === "1" ? <FaTrash className="text-red-500" /> : <FaChevronLeft />}
              </button>
              <input
                aria-label="Quantity"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={qty}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*$/.test(value)) {
                    handleChange(value);
                  }
                }}
                onBlur={handleBlur}
                onFocus={(e) => {
                  e.target.select();
                }}
                className="w-12 text-center border rounded"
                disabled={pendingSaving === item.Product.id}
              />
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increment"
                disabled={pendingSaving === item.Product.id}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="self-start">
            <Modal
              trigger={
                <button
                  type="button"
                  aria-label="Delete Trigger"
                  className="text-red-500 p-2 border rounded border-red-500"
                >
                  {pendingDel === item.Product.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </button>
              }
            >
              <DeleteCartItem pendingDel={pendingDel} item={item} handleDeleteItem={handleDeleteItem} />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
