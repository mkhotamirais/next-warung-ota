"use client";

import { Button } from "@/components/ui/button-tmp";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ResetPasswordRequestForm() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/account/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="h1 text-center">Lupa Password</h1>
      <p className="text-sm text-gray-600 text-center">Masukkan alamat email Anda yang terdaftar.</p>

      <Input
        id="email"
        type="email"
        placeholder="Email Anda"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Spinner />}
        Kirim Tautan Reset
      </Button>
    </form>
  );
}
