import { Metadata } from "next";
import { content as c } from "@/lib/content";
import BlogListWrapper from "./BlogListWrapper";
const { title, description } = c.blog;

export const metadata: Metadata = { title, description };

export default function Blog() {
  return (
    <main className="flex-1 bg-gray-100 py-4">
      <div className="container">
        <section className="sr-only">
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        <BlogListWrapper />
      </div>
    </main>
  );
}
