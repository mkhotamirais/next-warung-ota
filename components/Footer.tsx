"use client";

import React from "react";
import { menu } from "@/lib/content";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-4">
      <div className="container flex flex-col items-center justify-center">
        <nav className="flex gap-4 flex-wrap mb-2">
          {menu.mainMenu.map((item, i) => (
            <Link key={i} href={item.url} className="link">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-gray-500 text-sm">&copy; 2023 Warungota. All rights reserved.</p>
      </div>
    </footer>
  );
}
