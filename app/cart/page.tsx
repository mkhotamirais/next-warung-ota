import InteractiveCart from "./InteractiveCart";
import { Suspense } from "react";
import LoadCart from "@/components/fallbacks/LoadCart";
import { getCarts } from "@/actions/cart";
import Link from "next/link";

// export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function Cart() {
  const { cartQty, cartItems, totalPrice } = await getCarts();

  if (!cartItems || cartItems?.length === 0) {
    return (
      <main className="flex-1">
        <div className="container max-w-xl py-4">
          <h1 className="h1 mb-4">Cart</h1>
          <p className="">Keranjang kamu masih kosong.</p>
          <Link href="/" className="hover:underline text-primary py-2 inline-block">
            Belanja Sekarang
          </Link>
        </div>
      </main>
    );
  }

  const orderedCartItemsByChecked = [...cartItems].sort((a, b) => {
    if (a.isChecked === b.isChecked) return 0;
    return a.isChecked ? -1 : 1;
  });

  return (
    <main className="flex-1">
      <div className="container max-w-xl py-4">
        <h1 className="h1 mb-4">Cart</h1>
        <Suspense fallback={<LoadCart />}>
          <InteractiveCart cartItems={orderedCartItemsByChecked} cartQty={cartQty} totalPrice={totalPrice} />
        </Suspense>
      </div>
    </main>
  );
}
