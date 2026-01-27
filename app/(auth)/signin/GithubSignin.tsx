"use client";

import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button-tmp";
import { Spinner } from "@/components/ui/spinner";

export function GithubSignin() {
  const [pending, startTransition] = useTransition();

  const handleSignInGithub = async () => {
    startTransition(async () => {
      await signIn("github");
    });
  };

  return (
    <Button disabled={pending} onClick={handleSignInGithub} className="w-full">
      {pending && <Spinner />}
      <FaGithub className="mr-2" /> Signin with Github
    </Button>
  );
}
