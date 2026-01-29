import React from "react";
import EmailVerificationBanner from "./EmailVerificationBanner";
import UserMenu from "./UserMenu";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 py-3 w-full max-w-2xl mx-auto">
      <div className="container">
        <EmailVerificationBanner />
        <UserMenu />
        <div>{children}</div>
      </div>
    </main>
  );
}
