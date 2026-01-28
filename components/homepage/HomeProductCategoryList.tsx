"use client";

import { getProductCategories } from "@/actions/product-category";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ProductCategory } from "@/lib/generated/prisma";

export default function HomeProductCategoryList() {
  const [categories, setCategories] = useState<ProductCategory[] | []>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const productCategories = await getProductCategories();
      setCategories(productCategories);
    };
    fetchCategories();
  }, []);

  return (
    <section className="container py-4">
      <div className="flex gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <Button variant={"outline"} key={category.id} size={"sm"} className="capitalize">
              {category.name}
            </Button>
          ))}
      </div>
    </section>
  );
}
