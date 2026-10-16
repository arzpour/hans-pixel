"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, readJson } from "@/lib/api";
import { useSession } from "@/providers/session-provider";
import type { OrderView } from "@/types/order";

type OrdersValue = {
  orders: OrderView[];
  error: string | null;
  ready: boolean;
  priorCount: number | null;
  ensure: () => void;
  reload: () => void;
  noteSent: () => void;
};

const OrdersContext = createContext<OrdersValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user, status } = useSession();
  const userId = user?.id ?? null;
  const [trackedUser, setTrackedUser] = useState<string | null>(userId);
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [extra, setExtra] = useState(0);
  const [stale, setStale] = useState(false);
  const [request, setRequest] = useState(() => new AbortController());

  if (trackedUser !== userId) {
    request.abort();
    setRequest(new AbortController());
    setTrackedUser(userId);
    setOrders([]);
    setError(null);
    setExtra(0);
    setReady(false);
    setStale(false);
  }

  const load = useCallback(async () => {
    if (!user) return;
    const controller = request;
    try {
      const response = await apiFetch("/api/orders", { signal: controller.signal });
      if (controller.signal.aborted) return;
      const data = await readJson<{ error?: string; orders?: OrderView[] }>(response);
      if (controller.signal.aborted) return;
      setReady(true);
      setStale(false);
      setExtra(0);
      if (!response.ok) {
        setError(data?.error ?? "Orders could not be opened.");
        setOrders([]);
        return;
      }
      setError(null);
      setOrders(data?.orders ?? []);
    } catch (caught) {
      if (controller.signal.aborted || (caught instanceof DOMException && caught.name === "AbortError")) return;
      setReady(true);
      setStale(false);
      setExtra(0);
      setError("Orders could not be opened.");
      setOrders([]);
    }
  }, [request, user]);

  const ensure = useCallback(() => {
    if (!user || (ready && !stale)) return;
    void load();
  }, [load, ready, stale, user]);

  const reload = useCallback(() => {
    if (!user) return;
    void load();
  }, [load, user]);

  const noteSent = useCallback(() => {
    setExtra((count) => count + 1);
    setStale(true);
  }, []);

  const priorCount =
    status === "loading" ? null : !user ? 0 : ready ? orders.filter((order) => order.senderEmail === user.email).length + extra : null;

  const value = useMemo(
    () => ({ orders, error, ready, priorCount, ensure, reload, noteSent }),
    [ensure, error, noteSent, orders, priorCount, ready, reload],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

function useOrdersContext() {
  const value = useContext(OrdersContext);
  if (!value) throw new Error("useOrders requires OrdersProvider");
  return value;
}

export function useOrders() {
  const value = useOrdersContext();
  const { ensure } = value;
  useEffect(() => {
    ensure();
  }, [ensure]);
  return value;
}

export function useOrderList() {
  const value = useOrdersContext();
  const { reload } = value;
  useEffect(() => {
    reload();
  }, [reload]);
  return value;
}
