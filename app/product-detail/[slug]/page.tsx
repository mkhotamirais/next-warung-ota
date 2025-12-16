import { getProductBySlug, getProducts } from "@/actions/product";
import { notFound } from "next/navigation";
import { content as c } from "@/lib/content";
import DetailProduct from "./DetailProduct";
import OtherProducts from "./OtherProducts";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  return { title: product?.name || c.product.title, description: product?.description || c.product.description };
};

export const generateStaticParams = async () => {
  const { products } = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
};

export default async function ProductSlug({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  const currentProductCategory = product?.ProductCategory;
  const { products: otherProducts } = await getProducts({
    limit: 12,
    excludeSlug: slug,
    categorySlug: currentProductCategory?.slug,
  });

  if (!slug || !product) return notFound();

  return (
    <main className="flex-1">
      <DetailProduct product={product} />
      <OtherProducts otherProducts={otherProducts} />
    </main>
  );
}
