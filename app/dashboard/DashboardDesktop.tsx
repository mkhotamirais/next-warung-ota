"use client";

import Button from "@/components/ui/Button";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import MenuDashboardFallback from "@/components/fallbacks/MenuDashboardFallback";
import useLogout from "@/hooks/useLogout";

export default function DashboardDesktop() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { pendingLogout, handleLogout } = useLogout();

  let myMenu = m.allRoleMenu;
  if (session?.user?.role === "USER") {
    myMenu = [...m.allRoleMenu, ...m.userMenu];
  } else if (session?.user?.role === "ADMIN") {
    myMenu = [...m.allRoleMenu, ...m.adminMenu];
  }

  if (status === "loading") return <MenuDashboardFallback />;

  return (
    <div className="space-y-1">
      {myMenu.map((item, i) => (
        <Link href={item.url} key={i} className="flex">
          <Button variant={pathname === item.url ? "default" : "outline"} key={i} className="justify-start">
            {item.label}
          </Button>
        </Link>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={handleLogout}
        className="w-full mt-2"
        disabled={pendingLogout}
        pending={pendingLogout}
      >
        Logout
      </Button>
    </div>
  );
}
