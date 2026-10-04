"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  verified: true;
};

type SessionValue = {
  status: "loading" | "anonymous" | "ready";
  user: SessionUser | null;
  isAdmin: boolean;
  setSession: (user: SessionUser, isAdmin: boolean) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionValue["status"]>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const response = await apiFetch("/api/auth/session");
      const data = (await response.json().catch(() => null)) as {
        user: SessionUser | null;
        isAdmin?: boolean;
      } | null;
      if (!active) return;
      if (data?.user) {
        setUser(data.user);
        setIsAdmin(Boolean(data.isAdmin));
        setStatus("ready");
        return;
      }
      setUser(null);
      setIsAdmin(false);
      setStatus("anonymous");
    })();
    return () => {
      active = false;
    };
  }, []);

  const setSession = useCallback((next: SessionUser, admin: boolean) => {
    setUser(next);
    setIsAdmin(admin);
    setStatus("ready");
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsAdmin(false);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({ status, user, isAdmin, setSession, logout }),
    [status, user, isAdmin, setSession, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession requires SessionProvider");
  return value;
}
