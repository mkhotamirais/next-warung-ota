"use client";

import DropdownMenu, { DropdownMenuClose } from "./ui/DropdownMenu";
import Button from "./ui/Button";
import useLogout from "@/hooks/useLogout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuLogIn, LuShoppingCart } from "react-icons/lu";

// const menu = [
//   { label: "Setting", url: "/setting" },
//   { label: "Product", url: "/products" },
//   { label: "Product Category", url: "/product-category" },
// ];

export default function HeaderUserOptions() {
  const { handleLogout } = useLogout();
  const { data: session, status } = useSession();

  let initial: string = "U";

  if (session && session?.user) {
    initial = session.user.name?.charAt(0).toUpperCase() || "U";
  }

  const trigger = (
    <Button type="button" className="rounded-full size-9 text-sm">
      {initial}
    </Button>
  );

  if (status === "loading") return null;

  if (!session) {
    return (
      <Link href="/signin" className="">
        <Button size="sm" asChild aria-label="login" className="">
          <span className="hidden mr-2 sm:inline-block">Sign In</span>
          <LuLogIn className="mt-0.5" />
        </Button>
      </Link>
    );
  }

  return (
    <>
      {session.user.role === "USER" ? (
        <Button asChild variant="ghost" aria-label="cart" size="sm">
          <Link href="/cart">
            <LuShoppingCart />
          </Link>
        </Button>
      ) : null}
      <DropdownMenu trigger={trigger} title={session.user.name || "User"}>
        <div className="mt-2">
          <DropdownMenuClose asChild>
            <Link href="/dashboard">
              <Button size="sm" variant="ghost" className="w-full mb-1 justify-start">
                Dashboard
              </Button>
            </Link>
          </DropdownMenuClose>
          <hr className="mb-2 text-gray-400" />
          <DropdownMenuClose asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("tutup");
                handleLogout();
              }}
              className="justify-start"
            >
              Sign Out
            </Button>
          </DropdownMenuClose>
        </div>
      </DropdownMenu>
    </>
  );
}
