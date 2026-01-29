import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { OrderStatus } from "@/lib/generated/prisma";
import { File } from "lucide-react";

export function OrderEmpty({ status = "" }: { status?: OrderStatus | "" }) {
  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <File />
        </EmptyMedia>
        <EmptyTitle>Order is Empty</EmptyTitle>
        <EmptyDescription>Your {status.toLowerCase()} order is Empty</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
