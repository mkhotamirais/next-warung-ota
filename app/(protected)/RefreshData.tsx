"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { toast } from "sonner";

export default function RefreshData() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verify-email");
  const pathname = usePathname();

  const hasProcessed = useRef(false);

  const refreshData = useCallback(async () => {
    await update({});
    router.refresh();
  }, [update, router]);

  useEffect(() => {
    if (!verified || hasProcessed.current) return;

    const runSync = async () => {
      hasProcessed.current = true;

      await refreshData();

      if (verified === "update-email") {
        toast.success("Email updated!");
        router.replace(pathname);
      } else if (verified === "new-email") {
        toast.success("email verified!");
        router.replace(pathname);
      }
    };

    runSync();
  }, [verified, refreshData, router, session, pathname]);

  return (
    <Button type="button" onClick={refreshData} aria-label="Refresh" size={"icon"} variant={"ghost"}>
      <LuRefreshCcw />
    </Button>
  );
}
