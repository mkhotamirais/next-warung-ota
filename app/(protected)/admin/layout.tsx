import React from "react";
import AdminMenu from "./AdminMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 max-w-2xl mx-auto pb-4">
      <div className="container">
        <AdminMenu />
        <div className="">{children}</div>
      </div>
    </main>
  );
}
