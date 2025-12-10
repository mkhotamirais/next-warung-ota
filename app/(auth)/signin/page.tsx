import Link from "next/link";
import React from "react";
import SigninForm from "./SigninForm";

export default function Signin() {
  return (
    <>
      <h1 className="h1 mb-4 text-center">Sign In</h1>
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
