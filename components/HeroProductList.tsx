import { getProductCategories } from "@/actions/product-category";
import React from "react";

export default async function HeroProductList() {
  const categories = await getProductCategories();

  return (
    <section className="container">
      <div className="flex flex-col max-w-xl mx-auto text-center p-8">
        <h1 className="h1">Product List</h1>
        <p>{categories.length} categories</p>
      </div>
    </section>
  );
}
