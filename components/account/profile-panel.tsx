"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/providers/session-provider";
import { cn, focusRing, labelText, primaryButton } from "@/lib/cn";

export function ProfilePanel() {
  const router = useRouter();
  const { user, status, logout } = useSession();
  const [busy, setBusy] = useState(false);

  const onLogout = async () => {
    setBusy(true);
    await logout();
    router.replace("/account");
  };

  if (status === "loading") {
    return (
      <p className="flex items-center gap-2 text-base leading-relaxed text-muted-foreground" role="status" aria-busy="true">
        Loading your profile.
        <Spinner />
      </p>
    );
  }
  if (!user) return null;

  const name = user.name?.trim();

  return (
    <div className="flex max-w-md flex-col gap-4 max-md:max-w-none">
      <dl className="flex flex-col gap-4 border-t border-border pt-4">
        <div>
          <dt className={labelText}>Name</dt>
          <dd className="mt-1 font-heading text-[length:var(--text-lead)] font-semibold leading-snug text-foreground">
            {name || "No name on this account yet."}
          </dd>
        </div>
        <div>
          <dt className={labelText}>Email</dt>
          <dd className="mt-1 text-base leading-relaxed text-foreground">{user.email}</dd>
        </div>
      </dl>
      <button
        type="button"
        className={cn(primaryButton, "gap-2", focusRing)}
        onClick={() => void onLogout()}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "Signing you out" : "Sign out"}
        {busy ? <Spinner /> : null}
      </button>
    </div>
  );
}
