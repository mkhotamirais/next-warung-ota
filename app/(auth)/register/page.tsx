import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import React from "react";

export default function Register() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="container max-w-sm! border border-gray-300 my-12 py-6! px-6! bg-white rounded-lg">
        <h1 className="h1 mb-4">Register</h1>
        <form>
          <Input id="email" label="Email" placeholder="Your email" />
          <Input id="password" type="password" label="Password" placeholder="********" />
          <Input id="confirm-password" type="password" label="Confirm Password" placeholder="********" />
          <Button type="submit" className="w-full mt-2">
            Register
          </Button>
        </form>
        <p className="text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
