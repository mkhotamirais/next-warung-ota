"use client";

import { menu } from "@/lib/content";
import Link from "next/link";
import { Button } from "../ui/button-tmp";

export default function NavDesktop() {
  return (
    <div className="hidden lg:flex items-center justify-between">
      <nav className="ml-4">
        {menu.mainMenu.map((item, index) => (
          <Button key={index} asChild variant={"ghost"} size={"sm"}>
            <Link href={item.url}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
