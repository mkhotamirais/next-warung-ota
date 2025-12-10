import { getProducts } from "@/actions/product";
import ProductCard from "@/components/ProductCard";

// export default function ProductList({ products }: { products: ProductProps[] | undefined | null }) {

interface ProductListProps {
  keyword?: string;
}

export default async function ProductList({ keyword }: ProductListProps) {
  const { products } = await getProducts({ keyword });
  return (
    <div className="grid-list">
      {products?.map((item, i) => (
        <ProductCard key={i} item={item} />
      ))}
    </div>
  );
}
