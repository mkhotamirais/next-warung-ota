"use client";

import { Button } from "@/components/ui/button";
import { userMenu as m, transactionRoutes } from "@/lib/content";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RefreshData from "../RefreshData";

export default function UserMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isTransactionRoutes = transactionRoutes.some((route) => pathname.startsWith(route));

  if (isTransactionRoutes) return null;

  return (
    <div className="bg-white border border-white sticky top-16 py-3 mb-2 flex overflow-x-scroll gap-1 [&::-webkit-scrollbar]:hidden">
      <div className="mr-2 sticky left-0 bg-white">
        <RefreshData />
      </div>

      <Button variant={pathname === "/user" ? "secondary" : "ghost"} asChild>
        <Link href={"/user"}>Hi, {session?.user.name}</Link>
      </Button>

      {m.map((item, i) => (
        <Button key={i} variant={pathname === item.url ? "secondary" : "ghost"} asChild>
          <Link href={item.url}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}
