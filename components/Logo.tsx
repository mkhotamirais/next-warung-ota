import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 mr-2", className)}>
      <Image src="/images/logo-warungota.png" alt="Logo" width={32} height={32} className="w-10" />
      <span className="hidden md:block font-bold tracking-tighter text-lg leading-none">WarungOta</span>
    </Link>
  );
}
