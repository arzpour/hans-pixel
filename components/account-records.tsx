"use client";

import { useEffect, useState } from "react";
import { OrderList, type OrderView } from "@/components/order-list";
import { Spinner } from "@/components/spinner";
import { useSession } from "@/provider/session-provider";
import { apiFetch } from "@/lib/api";

export function AccountRecords() {
  const { user, status, isAdmin } = useSession();
  const [orders, setOrders] = useState<OrderView[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      const response = await apiFetch("/api/orders");
      const data = (await response.json().catch(() => null)) as { error?: string; orders?: OrderView[] } | null;
      if (!active) return;
      if (!response.ok) {
        setError(data?.error ?? "Orders could not be opened.");
        setOrders([]);
        return;
      }
      setOrders(data?.orders ?? []);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (status === "loading" || (user && orders === null && !error)) {
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

  const list = (orders ?? []).filter((order) => order.status === "received");
  if (list.length === 0) {
    return (
      <p className="text-base leading-relaxed text-muted-foreground">No orders yet.</p>
    );
  }

  return <OrderList orders={list} showSender={isAdmin} />;
}
