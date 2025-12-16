"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { getCarts } from "@/actions/cart";
import Button from "./ui/Button";

export default function CartBtn() {
  const { cartQty, setCartQty, pending, setPending } = useCart();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session === undefined) return;

    setPending(true);

    const gettingCarts = async () => {
      try {
        const res = await getCarts();
        setCartQty(res.cartQty);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartQty(0);
      } finally {
        setPending(false);
      }
    };

    gettingCarts();
  }, [setCartQty, setPending, session, session?.user?.id]);

  const cartBadge = (
    <span className="text-[10px] py-px px-1 bg-red-500 text-white absolute right-0 -top-1 rounded">{cartQty}</span>
  );

  if (session?.user.role === "ADMIN" || status !== "authenticated") return null;

  return (
    <Link
      href="/cart"
      className={`transition-all relative text-lg ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={(e) => pending && e.preventDefault()}
    >
      <Button variant="ghost" size="sm" className="relative">
        <LuShoppingCart />
        {pending ? (
          <span className="text-[10px] py-px px-1 bg-gray-400 text-white right-0 -top-1 absolute rounded">...</span>
        ) : (
          cartQty > 0 && cartBadge
        )}
      </Button>
    </Link>
  );
}
