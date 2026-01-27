"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "@/actions/account";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Memverifikasi token...");

  const hasCalled = useRef(false);

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  useEffect(() => {
    if (!token || !emailParam || hasCalled.current) {
      const basicChecking = () => {
        if (!token || !emailParam) {
          setStatus("error");
          setMessage("Tautan verifikasi tidak lengkap.");
        }
      };
      basicChecking();
      return;
    }

    const runVerification = async () => {
      hasCalled.current = true;

      try {
        setMessage("Memperbarui status verifikasi...");

        // const res = await fetch("/api/account/verify-email", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token: token, email: emailParam.toLowerCase() }),
        // });
        // const result = await res.json();

        const result = await verifyEmail({ token, email: emailParam.toLowerCase() });

        if (result.error) {
          setStatus("error");
          setMessage(result.error);
          return;
        }

        setStatus("success");
        setMessage("Verifikasi berhasil. Menyinkronkan data...");

        setTimeout(() => {
          router.replace(callbackUrl || "/");
        }, 1500);
      } catch (err) {
        console.error("Kesalahan verifikasi:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan jaringan atau server.");
      }
    };

    runVerification();
  }, [token, emailParam, router, callbackUrl]);
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
          ? "Verifikasi Berhasil! ✅"
          : status === "error"
            ? "Verifikasi Gagal ❌"
            : "Memproses... 🔄"}
      </h1>
      <p className={status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-gray-700"}>
        {message}
      </p>
      {status === "error" && (
        <Button className="mt-4" asChild>
          <Link href="/signin">Coba Masuk Kembali</Link>
        </Button>
      )}
    </div>
  );
}
