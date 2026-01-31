import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { content as c } from "@/lib/content";
import { Metadata } from "next";
const { title, description } = c.contact;

export const metadata: Metadata = { title, description };

export default function Contact() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
      <section className="container py-6">
        <article className="prose mx-auto">
          <h2 className="">Cara menghubungi kami</h2>
          <p>
            Anda bisa hubung kami dengan datang langsung ke lokasi Warungota di Kp. Bangong No. 12, RT 002 RW 001, Desa
            Pasirpogor, Kec. Sindangkerta, Kab. Bandung Barat, Jawa Barat, 40563. Bisa hubungi kami melalui email atau
            nomor WhatsApp berikut.
          </p>
          <ul>
            <li>
              <span>Email:</span>
              <Button variant="link" asChild>
                <a href="https://mailto:warungota@gmail.com">warungota25@gmail.com</a>
              </Button>
            </li>
            <li>
              <span>WhatsApp (Warungota):</span>
              <Button variant="link" asChild>
                <a href="https://wa.me/6283192375769">+62 831-9237-5769</a>
              </Button>
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
