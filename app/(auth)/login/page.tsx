import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="container max-w-sm! border border-gray-300 my-12 py-6! px-6! bg-white rounded-lg">
        <h1 className="h1 mb-4">Login</h1>
        <form>
          <Input id="email" label="Email" />
          <Input type="password" id="password" label="Password" />
          <Button type="submit" className="w-full mt-2">
            Login
          </Button>
        </form>
        <p className="text-sm text-gray-700 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
