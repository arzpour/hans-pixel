"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { SessionStatus, SessionUser, SessionValue } from "@/types/session";

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await apiFetch("/api/auth/session");
        const data = (await response.json().catch(() => null)) as {
          user: SessionUser | null;
          isAdmin?: boolean;
        } | null;
        if (!active) return;
        if (response.ok && data?.user) {
          setUser(data.user);
          setIsAdmin(Boolean(data.isAdmin));
          setStatus("ready");
          return;
        }
      } catch {
        // The account screen should still open if the API is unreachable.
      }
      if (!active) return;
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
