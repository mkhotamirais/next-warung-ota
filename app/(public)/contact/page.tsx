import { content as c } from "@/lib/content";
import { Metadata } from "next";
const { title, description } = c.contact;

export const metadata: Metadata = { title, description };

export default function Contact() {
  return (
    <main className="flex-1">
      <div className="container">
        <h1>Contact</h1>
      </div>
    </main>
  );
}
