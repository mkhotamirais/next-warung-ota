import React from "react";
import { menu } from "@/lib/content";
import Link from "next/link";

export default function NavDesktop() {
  return (
    <div className="hidden lg:block">
      {menu.mainMenu.map((item, index) => (
        <Link href={item.url} key={index} className="text-gray-600 px-3 text-sm hover:underline">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
