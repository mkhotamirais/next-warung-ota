import Hero from "@/components/Hero";
import { content as c } from "@/lib/content";
import { Metadata } from "next";
const { title, description } = c.contact;

export const metadata: Metadata = { title, description };

export default function Contact() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
    </main>
  );
}
