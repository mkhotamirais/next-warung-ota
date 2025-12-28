"use client";

import React, { useState } from "react";
import { upsertCartItem } from "@/actions/cart";
import { LuCheck, LuLoader, LuShoppingCart } from "react-icons/lu";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import clsx from "clsx";

interface AddToCartFromProductListProps {
  productId: string;
  productName: string;
}

export default function AddToCartFromProductList({ productId, productName }: AddToCartFromProductListProps) {
  const [pending, setPending] = useState<string>("");
  const [added, setAdded] = useState(false);
  const { setCartQty } = useCart();

  const handleAddToCartFromProductList = async () => {
    if (added) return;
    setPending(productId);
    const result = await upsertCartItem({ productId, quantity: 1, actionType: "INCREMENT" });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${productName} added to cart`);
      setAdded(true);
      setCartQty(result?.cartQty as number);
      setTimeout(() => setAdded(false), 1500);
    }

    setPending("");
  };

  return (
    <button
      type="button"
      onClick={handleAddToCartFromProductList}
      disabled={added}
      className={clsx(
        "border-b text-lg p-2 rounded-lg border-gray-400 hover:bg-gray-100 active:bg-gray-200 active:scale-110 transition-all",
        (pending || added) && "pointer-events-none opacity-50"
      )}
    >
      {pending === productId ? (
        <LuLoader className="animate-spin" />
      ) : added ? (
        <>
          <LuCheck />
        </>
      ) : (
        <>
          <LuShoppingCart className="text-primary" />
        </>
      )}
    </button>
  );
}
