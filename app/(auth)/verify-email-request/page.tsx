"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function VerificationPending() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.emailVerified) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleResend = () => {
    startTransition(async () => {
      const res = await fetch("/api/account/verify-email-request", { method: "POST" });
      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
        setMessage(data?.error);
        return;
      }

      toast.success(data?.message);
      setMessage(data?.message);
    });
  };

  return (
    <>
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
      <Button type="button" onClick={handleResend} disabled={pending} pending={pending}>
        Kirim Ulang Email Verifikasi
      </Button>
    </>
  );
}
