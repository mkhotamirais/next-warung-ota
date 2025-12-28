"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useLogout() {
  const { update } = useSession();
  const [pendingLogout, setPendingLogout] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setPendingLogout(true);

    try {
      await signOut({ redirectTo: "/signin" });
      // update({});
      // router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setPendingLogout(false);
    }
  };
  return { pendingLogout, handleLogout };
}
