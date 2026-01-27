import { getProducts } from "@/actions/product";
import React from "react";
import ProductCard from "../ProductCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function HomeProductList() {
  const { products } = await getProducts({ limit: 12 });
  return (
    <section className="container py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="h2">Popular Products</h2>
        <Button variant={"link"} className="">
          <Link href="/product">See All Products</Link>
          <ChevronRight />
        </Button>
      </div>
      <div className="grid-list">
        {products.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))}
      </div>
    </section>
  );
}
