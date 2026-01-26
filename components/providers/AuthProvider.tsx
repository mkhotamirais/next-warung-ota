"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const emailVerified = session?.user?.emailVerified;
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && emailVerified) {
      toast.success("Selamat datang kembali!");
      router.replace("/dashboard");
    }
  }, [status, router, emailVerified]);

  return <>{children}</>;
}
