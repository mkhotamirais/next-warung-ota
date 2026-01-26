import React from "react";
import AdminMenu from "./AdminMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 pb-4">
      <div className="container">
        <AdminMenu />
        <div className="max-w-xl">{children}</div>
      </div>
    </main>
  );
}
