"use client";

import { useSession } from "next-auth/react";

export default function DashboardTitle() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div>
      Hi {user?.name} | {user?.email} | {user?.role} | {user?.emailVerified ? "Verified" : "Not Verified"}
    </div>
  );
}
