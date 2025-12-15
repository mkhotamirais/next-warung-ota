"use client";

import { addProductToCart } from "@/actions/cart";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { SingleProductProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { toast } from "sonner";

export default function AddToCart({ product }: { product: SingleProductProps }) {
  const [qty, setQty] = useState("1");
  const [pending, startTransition] = useTransition();
  const [productId, setProductId] = useState(product.id);
  const { setPending, cartQty, setCartQty } = useCart();
  const router = useRouter();

  useEffect(() => {
    setProductId(product.id);
  }, [product]);

  const handleIncrement = () => {
    const newQty = Number(qty) + 1;
    setQty(String(newQty));
  };

  const handleDecrement = () => {
    const newQty = Number(qty) - 1;
    if (newQty >= 1) {
      setQty(String(newQty));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      setPending(true);
      // const res = await fetch("/api/cart", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ productId, qty }),
      // });
      const res = await addProductToCart({ productId, qty: Number(qty) });

      if (res.error) {
        if (res.error === "unauthorized") {
          router.push("/signin");
          return;
        }
        toast.error(res.error);
        setPending(false);
        return;
      }
      setCartQty(cartQty + Number(qty));
      setQty("1");
      toast.success(res.message);
      console.log(res);
      router.refresh();

      setPending(false);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="mb-3 flex gap-2 items-center">
        <label htmlFor="quantity" className="mr-2">
          Quantity
        </label>
        <div className="flex border rounded border-gray-500">
          <button type="button" aria-label="decrement" className="px-2 text-sm" onClick={handleDecrement}>
            <FaChevronLeft />
          </button>
          <input
            id="quantity"
            name="quantity"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder=""
            value={qty}
            onChange={(e) => {
              if (Number(e.target.value) < 0) {
                alert("Tidak bisa kurang dari 0");
                return;
              }
              if (isNaN(Number(e.target.value))) {
                alert("Please enter a valid number");
                return;
              }
              setQty(e.target.value);
            }}
            onFocus={(e) => e.target.select()}
            className="border-x py-1 px-3 w-14 text-center"
          />
          <button type="button" aria-label="increment" className="px-2 text-sm" onClick={handleIncrement}>
            <FaChevronRight />
          </button>
        </div>
      </div>
      <Button type="submit" className="" disabled={pending || !productId} pending={pending}>
        <LuShoppingCart className="mr-2" /> Add To Cart
      </Button>
    </form>
  );
}
