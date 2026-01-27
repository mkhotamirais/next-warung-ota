// import AuthProvider from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button-tmp";
import Link from "next/link";
import React from "react";
import { LuHouse } from "react-icons/lu";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>
    <main className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="container max-w-sm! sm:border border-gray-300 my-12 py-6! px-6! bg-white rounded-lg">
        {children}
        <Button variant="link" className="mt-6 w-full" asChild>
          <Link href="/" className="">
            <LuHouse className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
    // </AuthProvider>
  );
}
