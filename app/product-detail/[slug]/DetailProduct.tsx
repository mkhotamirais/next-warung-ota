"use client";

import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { SingleProductProps } from "@/types/types";
import AddToCartFromProductDetail from "@/components/AddToCartFromProductDetail";

export default function DetailProduct({ product }: { product: SingleProductProps }) {
  const { data: session } = useSession();

  return (
    <div className="container flex flex-col sm:flex-row gap-8 py-6">
      <div className="w-full sm:w-1/2">
        <div className="rounded border border-gray-300 mb-2">
          <Image
            src={product.imageUrl || "/images/logo-warungota.png"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-72 object-contain object-center"
          />
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <h1 className="text-lg font-semibold capitalize">{product.name}</h1>
        <p className="text-2xl font-medium">
          <span className="text-base">Rp</span>
          {product.price > 0 ? `${formatRupiah(product.price)}` : "Diskon"}
        </p>

        {session?.user.role === "USER" ? (
          <div>
            {/* <AddToCart product={product} /> */}
            <AddToCartFromProductDetail product={product} />
          </div>
        ) : null}
        <article dangerouslySetInnerHTML={{ __html: product.description || "" }}></article>
      </div>
    </div>
  );
}
