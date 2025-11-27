"use client";

import { useSession } from "next-auth/react";
import React from "react";

export default function DashboardTitle() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div>
      Hi {user?.name} | {user?.role} | {user?.emailVerified ? "Verified" : "Not Verified"}
    </div>
  );
}
