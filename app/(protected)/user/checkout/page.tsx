import React from "react";
import { getCheckoutData } from "@/actions/checkout";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function Checkout() {
  const data = await getCheckoutData();

  if ("error" in data) {
    redirect("/cart");
  }
  return (
    <main className="flex-1">
      <div className="container py-4 max-w-xl">
        <h1 className="h1 mb-4">Checkout</h1>
        <CheckoutClient initialAddresses={data.addresses} items={data.checkoutItems} subtotal={data.subtotal} />
      </div>
    </main>
  );
}
