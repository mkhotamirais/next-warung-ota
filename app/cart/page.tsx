import { Suspense } from "react";
import LoadCart from "@/components/fallbacks/LoadCart";
import CartWrapper from "./CartWrapper";

export const dynamic = "force-dynamic";

export default async function Cart() {
  return (
    <main className="flex-1">
      <div className="container max-w-xl py-4">
        <h1 className="h1 mb-4">Cart</h1>
        <Suspense fallback={<LoadCart />}>
          <CartWrapper />
        </Suspense>
      </div>
    </main>
  );
}
