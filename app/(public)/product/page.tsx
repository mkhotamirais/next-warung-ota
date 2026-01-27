import Hero from "@/components/Hero";
import React from "react";
import { content as c } from "@/lib/content";

const { title, description } = c.product;

export default function Product() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
    </main>
  );
}
