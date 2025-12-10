"use client";

import { FaBars } from "react-icons/fa6";
import { menu as m } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import RefreshData from "./RefreshData";
import useLogout from "@/hooks/useLogout";
import Drawer, { DrawerClose } from "@/components/ui/Drawer";

const formatTitle = (path: string) => {
  const pathSegments = path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  if (!lastSegment || lastSegment === "dashboard") {
    return "Dashboard";
  }

  if (pathSegments.length >= 2 && pathSegments[pathSegments.length - 2].startsWith("edit")) {
    const titleSegment = pathSegments[pathSegments.length - 2];
    const formattedTitle = titleSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return formattedTitle;
  }

  if (pathSegments.length >= 2 && pathSegments[pathSegments.length - 2].startsWith("page")) {
    const titleSegment = pathSegments[pathSegments.length - 3];
    const page = pathSegments[pathSegments.length - 1];
    const formattedTitle = `${titleSegment} Page ${page}`;
    return formattedTitle;
  }

  const formattedTitle = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedTitle;
};

const trigger = (
  <div className="p-2 border border-gray-300 rounded">
    <FaBars className="text-lg" />
  </div>
);

export default function DashboardMobile() {
  const pathname = usePathname();
  const dynamicTitle = formatTitle(pathname);
  const { data: session } = useSession();
  const { pendingLogout, handleLogout } = useLogout();

  let myMenu = m.allRoleMenu;
  if (session?.user?.role === "USER") {
    myMenu = [...m.allRoleMenu, ...m.userMenu];
  } else if (session?.user?.role === "ADMIN") {
    myMenu = [...m.allRoleMenu, ...m.adminMenu];
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Drawer trigger={trigger} position="left" className="sm:hidden" classNameDrawer="mt-16">
        <div className="p-3">
          {myMenu.map((item, i) => (
            <DrawerClose key={i} asChild>
              <Link
                href={item.url}
                className={`${pathname === item.url ? "bg-gray-200" : ""} justify-start w-full mb-1`}
              >
                <Button className={`${pathname === item.url ? "bg-gray-900" : ""} justify-start w-full mb-1`}>
                  {item.label}
                </Button>
              </Link>
            </DrawerClose>
          ))}
          <DrawerClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
              className="w-full mt-8"
              disabled={pendingLogout}
              pending={pendingLogout}
            >
              Sign Out
            </Button>
          </DrawerClose>
        </div>
      </Drawer>

      <div className="flex justify-between items-center w-full">
        <h1 className="h1">{dynamicTitle}</h1>
        <RefreshData />
      </div>
    </div>
  );
}
