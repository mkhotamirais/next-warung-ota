import { Suspense } from "react";
import LoadCart from "@/components/fallbacks/LoadCart";
import CartWrapper from "./CartWrapper";

export const dynamic = "force-dynamic";

export default async function Cart() {
  return (
    <div className="max-w-xl px-2">
      <h1 className="h1 mb-4">Cart</h1>
      <Suspense fallback={<LoadCart />}>
        <CartWrapper />
      </Suspense>
    </div>
  );
}
