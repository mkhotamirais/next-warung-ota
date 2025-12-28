import React from "react";
import DashboardDesktop from "./DashboardDesktop";
import DashboardMobile from "./DashboardMobile";
import DashboardProvider from "@/components/providers/DashboardProvider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <main className="flex-1 py-4">
        <div className="container">
          <div className="flex gap-8 items-start">
            <div className="w-[250px] hidden sm:block sticky top-20">
              <DashboardDesktop />
            </div>

            <div className="w-full">
              <DashboardMobile />
              {children}
            </div>
          </div>
        </div>
      </main>
    </DashboardProvider>
  );
}
