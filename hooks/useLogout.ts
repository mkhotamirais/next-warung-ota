"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function useLogout() {
  const [pendingLogout, setPendingLogout] = useState(false);

  const handleLogout = async () => {
    setPendingLogout(true);
    try {
      await signOut({ redirectTo: "/signin" });
    } catch (error) {
      console.log(error);
    } finally {
      setPendingLogout(false);
    }
  };
  return { pendingLogout, handleLogout };
}
