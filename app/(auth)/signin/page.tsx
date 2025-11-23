import Link from "next/link";
import React from "react";
import SigninForm from "./SigninForm";

export default function Signin() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="container max-w-sm! border border-gray-300 my-12 py-6! px-6! bg-white rounded-lg">
        <h1 className="h1 mb-4">Sign In</h1>
        <SigninForm />
        <p className="text-sm text-gray-700 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
