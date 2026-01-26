import Link from "next/link";
import React from "react";
import SigninForm from "./SigninForm";
import { GoogleSignin } from "./GoogleSignin";
import { Separator } from "@/components/ui/separator";
import { GithubSignin } from "./GithubSignin";

export default function Signin() {
  return (
    <>
      <h1 className="h1 mb-4 text-center space-y-2">Sign In</h1>
      <div className="space-y-2">
        <GithubSignin />

        <GoogleSignin />
      </div>
      <Separator className="my-4" />
      <SigninForm />
      <p className="text-sm text-center text-gray-700 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}
