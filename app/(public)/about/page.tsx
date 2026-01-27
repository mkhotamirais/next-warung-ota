import { Metadata } from "next";
import { content as c } from "@/lib/content";
import Hero from "@/components/Hero";
const { title, description } = c.about;

export const metadata: Metadata = { title, description };

export default function About() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
    </main>
  );
}
