import ProductCard from "@/components/ProductCard";
import { ProductProps } from "@/types/types";

export default function OtherProducts({ otherProducts }: { otherProducts: ProductProps[] }) {
  return (
    <div className="container py-8 bg-gray-100">
      <h2 className="h2 mb-4">Other Products</h2>
      <div className="grid-list">
        {otherProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
