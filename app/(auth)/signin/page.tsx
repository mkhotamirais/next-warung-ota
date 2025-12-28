import Link from "next/link";
import React from "react";
import SigninForm from "./SigninForm";
import { GoogleSignin } from "./GoogleSignin";

export default function Signin() {
  return (
    <>
      <h1 className="h1 mb-4 text-center">Sign In</h1>
      <GoogleSignin />
      <div className="py-3 flex items-center gap-2 leading-none">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="inline-block mb-1">or</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
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
