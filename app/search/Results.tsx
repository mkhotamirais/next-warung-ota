import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/actions/product";

export default async function Results({ keyword = "" }: { keyword?: string | undefined }) {
  const { products } = await getProducts({ keyword });

  return (
    <div className="space-y-3">
      {products?.length === 0 ? (
        <p>Hasil pencarian `{keyword}` tidak ditemukan</p>
      ) : (
        <div className="space-y-3">
          {products && products?.length > 0 && (
            <div className="grid-list">
              {products?.map((product) => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
