"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmailRequest } from "@/actions/account";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";
export default function VerifyEmailRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.emailVerified) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const handleResend = async () => {
    setPending(true);
    // const res = await fetch("/api/account/verify-email-request", { method: "POST" });
    // const data = await res.json();
    const data = await verifyEmailRequest();

    if (data?.error) {
      toast.error(data?.error);
      setPending(false);
      return;
    }
    setPending(false);
    toast.success(data?.message);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-yellow-600 mb-4 text-center">Verifikasi Diperlukan ⚠️</h1>
      <p className="text-gray-700 mb-6">
        Hai **{session?.user?.name || "Pengguna"}**, Akun Anda sudah dibuat, tetapi kami perlu memverifikasi alamat
        email Anda ({session?.user?.email}).
      </p>
      <p className="text-sm text-gray-500 mb-8">Silakan cek email Anda untuk tautan verifikasi yang kami kirimkan.</p>
      <Button type="button" onClick={handleResend} disabled={pending} className="w-full">
        {pending && <Spinner />}
        Kirim Ulang Email Verifikasi
      </Button>
    </>
  );
}
