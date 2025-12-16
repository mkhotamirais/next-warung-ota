import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { twMerge } from "tailwind-merge";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={clsx("hidden sm:flex items-center gap-2 mr-2", className)}>
      <Image src="/images/logo-warungota.png" alt="Logo" width={32} height={32} className="w-10" />
      <span className="font-bold tracking-tighter text-lg leading-none">WarungOta</span>
    </Link>
  );
}
