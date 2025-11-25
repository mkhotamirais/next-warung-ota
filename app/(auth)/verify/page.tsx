"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const { update } = useSession();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Memverifikasi token...");

  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const normalizedEmail = email ? email.toLowerCase() : null;

  useEffect(() => {
    if (!token || !normalizedEmail) {
      setStatus("error");
      setMessage("Tautan verifikasi tidak lengkap atau tidak valid.");
      return;
    }

    let isMounted = true;

    const runVerification = async () => {
      try {
        setMessage("Memperbarui status verifikasi...");
        const res = await fetch("/api/account/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token, email: normalizedEmail }),
        });

        if (!isMounted) return;

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Verifikasi gagal.");
          return;
        }
        setStatus("success");
        setMessage("Verifikasi berhasil. Mengalihkan Anda...");
      } catch (err) {
        if (!isMounted) return;
        console.error("Kesalahan dalam proses verifikasi:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan jaringan atau server.");
      }
    };

    runVerification();
    const timer = setTimeout(async () => {
      await update({});
      router.push("/dashboard");
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [token, normalizedEmail, update, router]);

  return (
    <>
      <div
        className={`p-8 rounded-lg shadow-lg text-center transition-colors duration-300 ${
          status === "success"
            ? "bg-green-100 border border-green-300"
            : status === "error"
            ? "bg-red-100 border border-red-300"
            : "bg-white border border-gray-200"
        }`}
      >
        <h1 className="text-xl font-bold mb-4">
          {status === "success"
            ? "Verifikasi Berhasil! ✅"
            : status === "error"
            ? "Verifikasi Gagal ❌"
            : "Memproses... 🔄"}
        </h1>
        <p className={status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-gray-700"}>
          {message}
        </p>
        {status === "error" && (
          <Button className="mt-4">
            <Link href="/signin">Coba Masuk Kembali</Link>
          </Button>
        )}
      </div>
    </>
  );
}
