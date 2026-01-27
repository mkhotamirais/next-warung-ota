"use client";

import { Button } from "../ui/button-tmp";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { adminMenu, userMenu } from "@/lib/content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LoadIcon from "../fallbacks/LoadIcon";

export default function AuthBtn() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const role = user?.role || "USER";

  const menu = role === "ADMIN" ? adminMenu : userMenu;
  const className = role === "ADMIN" ? "" : "rounded-full";
  const label = role === "ADMIN" ? "Dashboard" : user?.name?.charAt(0).toUpperCase() || "U";
  const size = role === "ADMIN" ? "default" : "icon";

  let authBtn;
  if (status === "loading") {
    authBtn = <LoadIcon />;
  } else if (user) {
    authBtn = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={className} size={size}>
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel asChild>
            <DropdownMenuItem asChild>
              <Button asChild variant={"ghost"} className="justify-start w-full">
                <Link href={role === "ADMIN" ? "/admin" : "/user"}>Hi, {user.name}</Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menu.map((item, i) => (
            <DropdownMenuItem key={i} asChild>
              <Button asChild variant={"ghost"} className="justify-start w-full">
                <Link href={item.url} className="">
                  {item.label}
                </Link>
              </Button>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Button onClick={() => signOut({ redirectTo: "/signin" })} variant={"secondary"} className="w-full mt-2">
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    authBtn = (
      <Button asChild>
        <Link href="/signin" className="flex items-center">
          Sign In
          <LogIn />
        </Link>
      </Button>
    );
  }
  return authBtn;
}
