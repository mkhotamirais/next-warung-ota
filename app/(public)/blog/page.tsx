import { Metadata } from "next";
import { content as c } from "@/lib/content";
import BlogListWrapper from "./BlogListWrapper";
import Hero from "@/components/Hero";
const { title, description } = c.blog;

export const metadata: Metadata = { title, description };

export default function Blog() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
      <BlogListWrapper />
    </main>
  );
}
