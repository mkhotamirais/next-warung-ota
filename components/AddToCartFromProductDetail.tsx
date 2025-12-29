"use client";

import { upsertCartItem } from "@/actions/cart"; // Ganti nama fungsi Server Action
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { SingleProductProps } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { toast } from "sonner";

export default function AddToCartFromProductDetail({ product }: { product: SingleProductProps }) {
  const [qty, setQty] = useState("1");
  const [pending, startTransition] = useTransition();
  const [productId, setProductId] = useState(product.id);
  const { setCartQty } = useCart();
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    setProductId(product.id);
  }, [product]);

  const handleIncrement = () => {
    const currentQty = Number(qty);
    if (currentQty < 99) {
      setQty(String(currentQty + 1));
    }
  };

  const handleDecrement = () => {
    const currentQty = Number(qty);
    if (currentQty > 1) {
      setQty(String(currentQty - 1));
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "") {
      setQty("1");
      return;
    }
    const numValue = Number(value);

    if (numValue < 1) {
      setQty("1");
    } else if (numValue > 99) {
      setQty("99");
    } else {
      setQty(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quantityToAdd = Number(qty);
    if (quantityToAdd < 1) {
      toast.error("Kuantitas minimal adalah 1.");
      return;
    }

    startTransition(async () => {
      const res = await upsertCartItem({ productId, quantity: quantityToAdd, actionType: "INCREMENT" });

      if (res.error) {
        if (res.error === "Unauthorized") {
          router.replace("/signin");
          return;
        }
        toast.error(res.error);
        return;
      }

      if (res.cartQty !== undefined) {
        setCartQty(res.cartQty);
      }

      setQty("1");
      toast.success(res.message);
      router.refresh();
    });
  };

  if (session?.user.role === "ADMIN" || status !== "authenticated") return null;

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="mb-3 flex gap-2 items-center">
        <label htmlFor="quantity" className="mr-2 font-medium">
          Quantity
        </label>
        <div className="flex border rounded border-gray-400">
          <button
            type="button"
            aria-label="decrement"
            className="px-2 text-sm disabled:opacity-50"
            onClick={handleDecrement}
            disabled={Number(qty) <= 1 || pending}
          >
            <FaChevronLeft />
          </button>

          <input
            id="quantity"
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1"
            value={qty}
            onChange={handleQtyChange}
            onFocus={(e) => e.target.select()}
            className="border-x py-1 px-3 w-14 text-center focus:outline-none"
          />
          <button
            type="button"
            aria-label="increment"
            className="px-2 text-sm disabled:opacity-50"
            onClick={handleIncrement}
            disabled={pending}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <Button type="submit" className="w-fit" disabled={pending || !productId || Number(qty) < 1} pending={pending}>
        <LuShoppingCart className="mr-2" /> Add To Cart
      </Button>
    </form>
  );
}
