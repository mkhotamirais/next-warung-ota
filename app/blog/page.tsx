import { Metadata } from "next";
import { content as c } from "@/lib/content";
const { title, description } = c.blog;

export const metadata: Metadata = { title, description };

export default function Blog() {
  return (
    <main className="flex-1">
      <div className="container">
        <h1>Blog</h1>
      </div>
    </main>
  );
}
