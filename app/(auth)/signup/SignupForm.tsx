"use client";

import { signup } from "@/actions/account";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, { errors: string[] }> | undefined>({});

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      // const res = await fetch("/api/account/signup", {
      //   method: "POST",
      //   body: JSON.stringify({ name, email, password, confirmPassword }),
      // });
      // const data = await res.json();
      const data = await signup({ name, email, password, confirmPassword });

      if (data?.errors) {
        setErrors(data?.errors);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (data?.error) {
        toast.error(data?.error, { position: "top-center" });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      await signIn("credentials", { email, password, redirect: false });

      router.push("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="name"
        label="Name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors?.name?.errors}
      />
      <Input
        id="email"
        label="Email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors?.email?.errors}
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors?.password?.errors}
      />
      <Input
        id="confirm-password"
        type="password"
        label="Confirm Password"
        placeholder="********"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors?.confirmPassword?.errors}
      />
      <Button
        type="submit"
        disabled={pending}
        pending={pending}
        className="w-full mt-2 focus:border! focus:border-gray-700!"
      >
        Sign Up
      </Button>
    </form>
  );
}
