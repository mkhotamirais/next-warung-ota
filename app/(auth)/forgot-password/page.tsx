"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    try {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="container">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4 border border-gray-300 rounded shadow">
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

          <Button
            type="submit"
            pending={isPending}
            disabled={isPending}
            className="focus:border! focus:border-gray-500!"
          >
            Kirim Tautan Reset
          </Button>

          {message && <p className="text-sm text-center text-gray-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}
