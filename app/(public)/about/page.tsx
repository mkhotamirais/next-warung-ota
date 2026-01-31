import { Metadata } from "next";
import { content as c } from "@/lib/content";
import Hero from "@/components/Hero";
const { title, description } = c.about;

export const metadata: Metadata = { title, description };

export default function About() {
  return (
    <main className="flex-1">
      <Hero title={title} description={description} />
      <section className="container py-6 flex gap-8">
        <article className="prose flex-1 space-y-6">
          <div>
            <h2 className="h2 mb-3">Sejarah</h2>
            <p>
              Toko ATK yang dibangun pada tahun 2019 ini pada awalnya belum memiliki nama, hanya warung biasa saja yang
              menjual beragam kebutuhan sekolah dan sembako. Kemudian awal tahun 2022, titik lokasinya dibuat di google
              maps dengan nama OTA Photocopy. Namun untuk branding toko ini meggunakan nama Warungota. Toko ini dibangun
              bersamaan dengan dibangunnya MA Nurul Iman dan letaknya saling berhadapan. Selain menyediakan ATK dan
              Sembako serta jajanan anak sekolah, toko ini juga menyediakan layanan fotokopi, printing dokumen,
              laminating, isi saldo, pulsa, dan token listrik dan tarik tunai. Pada awal tahun 2005 toko ini menyediakan
              jasa tarik tunai melalui E-Wallet seperti DANA, GoPay, ShopeePay dan dompet digital lainnya kemudian di
              akhir tahun 2005, toko ini menyediakan layana Mini Atm, yang memungkinkan pembeli melakukan transaksi
              dengan kartu ATM.
            </p>
          </div>
          <div>
            <h2 className="h2 mb-3">Alamat</h2>
            <address>
              Kp. Bangong No. 12, RT 002 RW 001, Desa Pasirpogor, Kec. Sindangkerta, Kab. Bandung Barat, Jawa Barat,
              40563
            </address>
          </div>
        </article>
        <div className="flex-1 border">
          <iframe
            title="ota-photocopy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2284570151933!2d107.39533097399826!3d-6.982345293018519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68f13596411c37%3A0x9e0882f274327720!2sOTA%20Photocopy!5e0!3m2!1sen!2sid!4v1769844420166!5m2!1sen!2sid"
            width="600"
            height="450"
            className="w-full"
            // style="border:0;"
            // allowfullscreen=""
            // allowFullScreen="true"
            // loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
