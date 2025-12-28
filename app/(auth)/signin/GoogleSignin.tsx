"use client";

import { FaGoogle } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

export function GoogleSignin() {
  const [pending, startTransition] = useTransition();

  const handleSignInGoogle = async () => {
    startTransition(async () => {
      await signIn("google", { redirectTo: "/dashboard" });
    });
  };

  return (
    <Button disabled={pending} pending={pending} onClick={handleSignInGoogle}>
      <FaGoogle className="mr-2" /> Signin with Google
    </Button>
  );
}
