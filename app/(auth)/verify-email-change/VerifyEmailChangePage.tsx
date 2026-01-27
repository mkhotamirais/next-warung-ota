"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailChange } from "@/actions/account";
import { Button } from "@/components/ui/button";
export default function VerifyEmailChangePage() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Memverifikasi permintaan perubahan email...");

  const router = useRouter();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    if (!token || !userId) {
      const basicChecking = () => {
        if (!token || !userId) {
          setStatus("error");
          setMessage("Tautan konfirmasi tidak lengkap atau tidak valid.");
        }
      };
      basicChecking();
      return;
    }

    const runVerification = async () => {
      try {
        setMessage("Memperbarui alamat email Anda...");

        // const res = await fetch("/api/account/verify-email-change", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token: token, userId: userId }),
        // });
        // const result = await res.json();
        const result = await verifyEmailChange({ token, userId });

        if (result.error) {
          setStatus("error");
          setMessage(result.error || "Konfirmasi perubahan email gagal.");
          return;
        }

        setStatus("success");
        setMessage("Alamat email berhasil diperbarui. Mengalihkan Anda...");

        setTimeout(async () => {
          router.replace(callbackUrl || "/");
        }, 500);
      } catch (err) {
        console.error("Kesalahan dalam proses konfirmasi:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan jaringan atau server.");
      }
    };

    runVerification();
  }, [token, userId, router]);
  return (
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
          ? "Perubahan Email Berhasil! ✅"
          : status === "error"
            ? "Konfirmasi Gagal ❌"
            : "Memproses... 🔄"}
      </h1>
      <p className={status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-gray-700"}>
        {message}
      </p>
      {status === "error" && (
        <Button className="mt-4" asChild>
          <Link href="/profile">Kembali ke Profile</Link>
        </Button>
      )}
    </div>
  );
}
