"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function OrderTabs({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("status") || "";

  const onTabChange = (value: string) => {
    if (value) {
      router.push(`/user/my-orders?status=${value}`);
    } else {
      router.push(`/user/my-orders`);
    }
  };

  const tabsConfig = [
    { label: "All Orders", value: "" },
    { label: "Paid", value: "PAID" },
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELED" },
    { label: "Shippedddd", value: "SHIPPED" },
  ];

  return (
    <>
      <div className="flex gap-1 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {tabsConfig.map((tab) => (
          <Button
            variant={currentTab === tab.value ? "secondary" : "ghost"}
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <Separator />

      <div className="mt-2">{children}</div>
    </>
  );
}
