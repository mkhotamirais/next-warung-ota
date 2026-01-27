"use client";

import { content as c } from "@/lib/content";
import { Separator } from "../ui/separator";
import HeroSearch from "../layouts/HeroSearch";

const { title, description } = c.home.hero;

export default function HomeHero() {
  return (
    <section className="container">
      <div className="rounded-xl bg-primary/10 my-6">
        <div className="flex flex-col max-w-xl mx-auto justify-center items-center space-y-4 text-center p-4 lg:p-8">
          <h1 className="h1">{title}</h1>
          <p>{description}</p>
          <HeroSearch />
        </div>
      </div>
      <Separator />
    </section>
  );
}
