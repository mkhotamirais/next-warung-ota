"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SigninSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import z from "zod";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { email, password };
    const validatedFields = SigninSchema.safeParse(formData);

    if (!validatedFields.success) {
      const errors = z.treeifyError(validatedFields.error).properties;
      setErrors(errors);
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          toast.error("Email atau password salah.", { position: "top-center" });
        } else {
          toast.error("Terjadi kesalahan yang tidak diketahui.", { position: "top-center" });
        }
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="email"
        label="Email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors?.email?.errors}
      />
      <Input
        type="password"
        id="password"
        label="Password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors?.password?.errors}
      />
      <Button type="submit" disabled={pending} pending={pending} className="w-full mt-2">
        Sign In
      </Button>
    </form>
  );
}
