"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ACCOUNT, SITE, accountLabel, isValidPath } from "@/lib/site";
import { useSession } from "@/providers/session-provider";
import type { ResolvedRoute } from "@/types/site";

export function useRouteGuards(route: ResolvedRoute) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status } = useSession();
  const section = route.section;
  const item = route.item;

  useEffect(() => {
    if (status !== "anonymous") return;
    if (!pathname.startsWith("/account/")) return;
    router.replace("/account");
  }, [pathname, router, status]);

  useEffect(() => {
    if (section?.id !== "account") return;
    if (user) {
      document.title = `${item?.label ?? accountLabel(user)} — ${SITE.name}`;
      return;
    }
    if (status === "anonymous") document.title = `${ACCOUNT.label} — ${SITE.name}`;
  }, [item, section, status, user]);

  useEffect(() => {
    if (isValidPath(pathname)) return;
    if (pathname.startsWith("/hans-pixel")) {
      router.replace("/hans-pixel");
      return;
    }
    router.replace("/");
  }, [pathname, router]);
}
