"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";
import { Button } from "../ui/button";

export default function HeaderUser() {
  const { data: session, status } = useSession();

  let initial: string = "U";

  if (session && session?.user) {
    initial = session.user.name?.charAt(0).toUpperCase() || "U";
  }

  if (status === "loading") return <div className="bg-gray-300 rounded-full size-8"></div>;

  if (!session) {
    return (
      <Button size="sm" aria-label="login" asChild>
        <Link href="/signin" className="inline-block ml-1">
          <span className="hidden mr-2 lg:inline-block">Sign In</span>
          <LuLogIn className="mt-0.5" />
        </Link>
      </Button>
    );
  }

  return (
    <Button size="sm" asChild>
      <Link href="/dashboard" className="inline-block ml-1">
        {initial}
      </Link>
    </Button>
  );
}
