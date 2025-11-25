"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPending() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSending, startSending] = useTransition();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.emailVerified) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleResend = () => {
    startSending(async () => {
      const res = await fetch("/api/account/send-verification", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage("Tautan verifikasi baru telah dikirim! Cek inbox Anda.");
      } else {
        setMessage(`Gagal mengirim: ${data.message || "Terjadi kesalahan."}`);
      }
    });
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Verifikasi Diperlukan ⚠️</h1>
        <p className="text-gray-700 mb-6">
          Hai **{session?.user?.name || "Pengguna"}**, Akun Anda sudah dibuat, tetapi kami perlu memverifikasi alamat
          email Anda ({session?.user?.email}).
        </p>
        <p className="text-sm text-gray-500 mb-8">Silakan cek email Anda untuk tautan verifikasi yang kami kirimkan.</p>

        {message && (
          <div
            className={`p-2 my-4 rounded text-sm ${
              message.includes("Gagal") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={isSending}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSending ? "Mengirim Ulang..." : "Kirim Ulang Email Verifikasi"}
        </button>
      </div>
    </>
  );
}
