"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { toast } from "sonner";

export default function RefreshData() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

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
        // router.replace("/dashboard/profile");
        router.replace("/");
      } else if (verified === "new-email") {
        toast.success("email verified!");
        router.replace("/dashboard");
      }
    };

    runSync();
  }, [verified, refreshData, router, session]);

  return (
    <button
      type="button"
      onClick={refreshData}
      aria-label="Refresh"
      className="text-lg p-3 bg-gray-100 hover:bg-gray-200 transition-all rounded"
    >
      <LuRefreshCcw />
    </button>
  );
}
