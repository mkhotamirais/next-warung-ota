import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileX } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CartEmpty() {
  return (
    <Empty className="border border-dashed py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX className="w-12 h-12" />
        </EmptyMedia>
        <EmptyTitle>Your Cart Is Empty</EmptyTitle>
        <EmptyDescription className="max-w-xs mx-auto">
          Looks like you haven&apos;t added anything to your cart yet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/product">Start Shopping</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
