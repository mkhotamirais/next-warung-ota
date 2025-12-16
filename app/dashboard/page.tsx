import { auth } from "@/auth";
import DashboardTitle from "./DashboardTitle";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isVerified = user?.emailVerified;

  return (
    <section>
      {!isVerified && (
        <div className="alert">
          Akun anda belum ter-verifikasi, silahkan verifikasi terlebih dahulu dengan cek email anda, jika belum muncul
          pesan verifikasi, silahkan{" "}
          <Link href="/verification-pending" className="underline">
            Kirim Ulang Email Verifikasi
          </Link>
        </div>
      )}
      <DashboardTitle />
      <div>{session?.user.email}</div>
    </section>
  );
}
