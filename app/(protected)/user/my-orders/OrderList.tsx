"use client";

import { Badge } from "@/components/ui/badge";
import { cn, formatRupiah } from "@/lib/utils";
import { OrderProps } from "@/types/types";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";

interface BasePageProps {
  orders: OrderProps[];
}

export default function OrderList({ orders }: BasePageProps) {
  return (
    <>
      {orders.map((order) => {
        return (
          <Link
            href={`/user/my-orders/detail/${order.id}`}
            key={order.id}
            className="flex items-center justify-between mb-1 border-b hover:bg-zinc-100 transition-all p-2"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">{order.externalId}</span>
              <span className="font-semibold">Rp{formatRupiah(order.totalAmount)}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Badge
                className={cn("text-white", [
                  order.status === "PENDING" && "bg-orange-600",
                  order.status === "PAID" && "bg-green-600",
                  order.status === "CANCELED" && "bg-gray-600",
                ])}
              >
                {order.status}
              </Badge>
              {/* <div className="text-orange-600 text-sm">waktu</div> */}
              {order.status === "PENDING" && <CountdownTimer createdAt={order.createdAt} orderId={order.id} />}
            </div>
          </Link>
        );
      })}
    </>
  );
}
