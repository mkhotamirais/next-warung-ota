import { Metadata } from "next";
import { content as c } from "@/lib/content";
const { title, description } = c.about;

export const metadata: Metadata = { title, description };

export default function About() {
  return (
    <main className="flex-1">
      <div className="container">
        <h1>About</h1>
      </div>
    </main>
  );
}
