"use client";

import { OrderList } from "@/components/order/order-list";
import { Spinner } from "@/components/ui/spinner";
import { useOrderList } from "@/providers/orders-provider";
import { useSession } from "@/providers/session-provider";

export function AccountRecords() {
  const { user, status, isAdmin } = useSession();
  const { orders, error, ready } = useOrderList();

  if (status === "loading" || (user && !ready && !error)) {
    return (
      <p className="flex items-center gap-2 text-base leading-relaxed text-muted-foreground" role="status" aria-busy="true">
        Loading your orders.
        <Spinner />
      </p>
    );
  }
  if (!user) return null;
  if (error) {
    return (
      <p className="text-base leading-relaxed text-accent" role="alert">
        {error}
      </p>
    );
  }

  const list = orders.filter((order) => order.status === "received");
  if (list.length === 0) {
    return <p className="text-base leading-relaxed text-muted-foreground">No orders yet.</p>;
  }

  return <OrderList orders={list} showSender={isAdmin} />;
}
