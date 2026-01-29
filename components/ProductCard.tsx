import { formatRupiah, smartTrim } from "@/lib/utils";
import { ProductProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import AddToCartFromProductList from "./AddToCartFromProductList";

export default function ProductCard({ item }: { item: ProductProps }) {
  return (
    <div key={item.id} className="rounded-md overflow-hidden bg-white shadow-xs">
      <Link href={`/product/detail/${item.slug}`} className="w-full h-36 block">
        <Image
          src={item.imageUrl || "/images/logo-warungota.png"}
          alt={item.name}
          width={400}
          height={400}
          className="w-full h-full rounded-t object-cover object-center"
        />
      </Link>
      <div className="p-2 sm:px-3">
        <Link href={`/product-detail/${item.slug}`} className="hover:underline">
          <h3 className="text-[13px] sm:text-sm capitalize h-10 text-gray-700 leading-snug">
            {smartTrim(item.name, 35)}
          </h3>
        </Link>
        <div className="my-1 leading-none text-xs py-0.5 px-1 border border-primary w-fit bg-primary/10 lowercase">
          {item.ProductCategory.name}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold">
            <span className="text-sm">Rp</span>
            {item.price > 0 ? `${formatRupiah(item.price)}` : "Diskon"}
            {/* {formatRupiah(minPrice)}{" "} */}
            {/* {maxPrice > minPrice && maxPrice > 0 ? <span>- {formatRupiah(maxPrice)}</span> : null} */}
          </p>
          <div>
            <AddToCartFromProductList productId={item.id} productName={item.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
