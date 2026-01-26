"use client";

import { Button } from "@/components/ui/button";
import { adminMenu as m } from "@/lib/content";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RefreshData from "../RefreshData";

export default function AdminMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="bg-white border border-white sticky top-16 py-3 mb-2 flex overflow-x-scroll gap-1 [&::-webkit-scrollbar]:hidden">
      <div className="mr-2">
        <RefreshData />
      </div>

      <Button variant={pathname === "/admin" ? "secondary" : "ghost"} asChild>
        <Link href={"/admin"}>Hi, {session?.user.name}</Link>
      </Button>

      {m.map((item, i) => (
        <Button key={i} variant={pathname === item.url ? "secondary" : "ghost"} asChild>
          <Link href={item.url}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}
