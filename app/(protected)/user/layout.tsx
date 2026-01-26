import React from "react";
import EmailVerificationBanner from "./EmailVerificationBanner";
import UserMenu from "./UserMenu";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 py-3">
      <div className="container">
        <EmailVerificationBanner />
        <UserMenu />
        <div className="max-w-2xl">{children}</div>
      </div>
    </main>
  );
}
