"use client";

import { FaGoogle } from "react-icons/fa";
import { signInGoogle } from "@/actions/auth";
import Button from "@/components/ui/Button";

export function GoogleSignin() {
  return (
    <form action={signInGoogle}>
      <Button>
        <FaGoogle className="mr-2" /> Signin with Google
      </Button>
    </form>
  );
}
