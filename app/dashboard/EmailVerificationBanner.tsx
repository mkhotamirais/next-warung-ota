"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function EmailVerificationBanner() {
  const [pending, startTransition] = useTransition();
  const { data: session } = useSession();
  const isVerified = !!session?.user?.emailVerified;

  const handleResend = () => {
    startTransition(async () => {
      const res = await fetch("/api/account/verify-email-request", { method: "POST" });
      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
      }
      toast.success(data?.message);
    });
  };

  if (!isVerified) {
    return (
      <div className="alert">
        Akun anda belum ter-verifikasi, silahkan verifikasi terlebih dahulu dengan cek email anda, jika belum muncul
        pesan verifikasi, silahkan{" "}
        <Button pending={pending} onClick={handleResend} size="sm" className="w-fit mt-2">
          Kirim Ulang Email Verifikasi
        </Button>
      </div>
    );
  }
  return null;
}
