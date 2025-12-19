"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "sonner";

export default function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await fetch("/api/account/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword, confirmNewPassword }),
      });
      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
      setIsSuccess(true);
      setTimeout(() => router.push("/signin"), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="h1 text-center mb-4">Reset Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Input
            id="new-password"
            label="Password Baru"
            type="password"
            placeholder="********"
            // minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={pending || isSuccess}
            error={errors?.newPassword?.errors}
          />
          <Input
            id="confirm-new-password"
            label="Konfirmasi Password Baru"
            type="password"
            placeholder="********"
            // required
            // minLength={8}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={pending || isSuccess}
            error={errors?.confirmNewPassword?.errors}
          />
        </div>

        <Button type="submit" pending={pending || isSuccess} disabled={pending || isSuccess}>
          Ubah Password
        </Button>
      </form>
    </div>
  );
}
