import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment Success" };

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; transaction_status?: string }>;
}) {
  const params = await searchParams;
  const { order_id, transaction_status } = params;

  if (!order_id) {
    redirect("/user/my-orders");
  }

  if (transaction_status === "pending") {
    redirect(`/user/payment/pending?order_id=${order_id}`);
  }

  if (transaction_status === "failure" || transaction_status === "deny") {
    redirect(`/user/payment/failure?order_id=${order_id}`);
  }

  const order = await prisma.order.findUnique({
    where: { externalId: order_id },
    select: { status: true },
  });

  if (!order) {
    redirect("/user/my-orders");
  }

  return (
    <div className="container max-w-2xl py-20">
      <Empty className="border border-dashed py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </EmptyMedia>
          <EmptyTitle>Payment Successful</EmptyTitle>
          <EmptyDescription className="max-w-xs mx-auto">
            Order <span className="font-bold text-foreground">#{order_id}</span> has been confirmed.
            {order.status !== "PAID" && (
              <p className="mt-2 text-xs text-orange-500 italic">Syncing your payment status...</p>
            )}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/user/my-orders">View My Orders</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back to Home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
