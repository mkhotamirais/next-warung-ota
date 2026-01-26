"use client";

import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function GoogleSignin() {
  const [pending, startTransition] = useTransition();

  const handleSignInGoogle = async () => {
    startTransition(async () => {
      await signIn("google");
    });
  };

  return (
    <Button disabled={pending} onClick={handleSignInGoogle} className="w-full">
      {pending && <Spinner />}
      <FaGoogle className="mr-2" /> Signin with Google
    </Button>
  );
}
