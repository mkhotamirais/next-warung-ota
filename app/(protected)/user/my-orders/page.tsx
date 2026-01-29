import { getOrders } from "@/actions/order";
import { OrderTabs } from "./OrderTabs";
import { OrderStatus } from "@/lib/generated/prisma";
import OrderList from "./OrderList";
import { OrderEmpty } from "./OrderEmpty";

export default async function MyOrders({ searchParams }: { searchParams: Promise<{ status: string }> }) {
  const status = (await searchParams).status as OrderStatus;

  const orders = await getOrders(status);

  return (
    <div className="max-w-xl px-2">
      <h1 className="h1 mb-4">My Orders</h1>
      <OrderTabs>{orders.length > 0 ? <OrderList orders={orders} /> : <OrderEmpty status={status} />}</OrderTabs>
    </div>
  );
}
