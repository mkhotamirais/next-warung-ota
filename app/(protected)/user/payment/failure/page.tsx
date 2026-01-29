import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment Failed" };

export default async function PaymentFailure({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const { order_id } = await searchParams;

  if (!order_id) redirect("/user/my-orders");

  const order = await prisma.order.findUnique({
    where: { externalId: order_id },
  });

  if (!order) redirect("/user/my-orders");

  return (
    <div className="container max-w-2xl py-20">
      <Empty className="border border-dashed py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <XCircle className="text-red-500 w-12 h-12" />
          </EmptyMedia>
          <EmptyTitle>Payment Failed</EmptyTitle>
          <EmptyDescription className="max-w-xs mx-auto">
            We couldn&apos;t process your payment for order{" "}
            <span className="font-bold text-foreground">#{order_id}</span>. Please try again or use a different payment
            method.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-col gap-2">
          <Button asChild variant="destructive">
            <Link href="/user/my-orders">Try Again</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Contact Support</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
