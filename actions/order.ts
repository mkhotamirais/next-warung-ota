"use server";

import { auth } from "@/auth";
import { OrderStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export const getOrders = async (status?: OrderStatus) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return [];
  }

  const whereClause: {
    userId?: string;
    status?: OrderStatus;
  } = {
    userId: session.user.id,
  };

  if (status) whereClause.status = status;

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { OrderItem: true },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { OrderItem: { include: { Product: true } } },
  });
  return order;
};

export async function autoCancelOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId, status: "PENDING" },
    data: { status: "CANCELED" },
  });
  revalidatePath("/user/my-orders");
}
