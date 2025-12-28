"use client";

import Button from "../ui/Button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";

export default function HeaderUser() {
  const { data: session, status } = useSession();

  let initial: string = "U";

  if (session && session?.user) {
    initial = session.user.name?.charAt(0).toUpperCase() || "U";
  }

  if (status === "loading") return <div className="bg-gray-300 rounded-full size-8"></div>;

  if (!session) {
    return (
      <Link href="/signin" className="inline-block ml-1">
        <Button size="sm" aria-label="login" className="">
          <span className="hidden mr-2 lg:inline-block">Sign In</span>
          <LuLogIn className="mt-0.5" />
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/dashboard" className="inline-block ml-1">
      <Button size="sm" className="rounded-full size-8">
        {initial}
      </Button>
    </Link>
  );
}
