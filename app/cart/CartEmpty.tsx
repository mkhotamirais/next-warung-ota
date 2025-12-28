import Link from "next/link";
import React from "react";

export default function CartEmpty() {
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
