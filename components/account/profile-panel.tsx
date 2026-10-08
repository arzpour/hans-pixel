"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/providers/session-provider";
import type { SessionUser } from "@/types/session";
import { apiFetch } from "@/lib/api";
import { cn, fieldControl, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";
import { normalizeMobile } from "@/lib/mobile";

export function ProfilePanel() {
  const id = useId();
  const router = useRouter();
  const { user, status, logout, setSession, isAdmin } = useSession();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setPhone(user?.phone ?? "");
  }, [user?.phone]);

  const onLogout = async () => {
    setLeaving(true);
    await logout();
    router.replace("/account");
  };

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobile = normalizeMobile(phone);
    if (!mobile) {
      setSaved(false);
      setError("Enter a mobile number.");
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    const response = await apiFetch("/api/auth/mobile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: mobile }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; user?: SessionUser; isAdmin?: boolean } | null;
    setBusy(false);
    if (!response.ok || !data?.user) {
      setError(data?.error || "The mobile number could not be saved.");
      return;
    }
    setPhone(data.user.phone ?? mobile);
    setSession(data.user, Boolean(data.isAdmin ?? isAdmin));
    setSaved(true);
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
  const errorId = `${id}-phone-error`;

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
      <form className="flex flex-col gap-4" onSubmit={(event) => void onSave(event)} noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-phone`} className={fieldLabel}>
            Mobile
          </label>
          <input
            id={`${id}-phone`}
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+1 202 555 0123"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setSaved(false);
            }}
            className={cn(fieldControl, focusRing)}
          />
        </div>
        {error ? (
          <p id={errorId} className="text-base leading-relaxed text-accent" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="text-base leading-relaxed text-muted-foreground" role="status">
            Mobile number saved.
          </p>
        ) : null}
        <button type="submit" className={cn(primaryButton, "gap-2", focusRing)} disabled={busy} aria-busy={busy}>
          {busy ? "Saving" : "Save mobile number"}
          {busy ? <Spinner /> : null}
        </button>
      </form>
      <button
        type="button"
        className={cn(primaryButton, "gap-2", focusRing)}
        onClick={() => void onLogout()}
        disabled={leaving}
        aria-busy={leaving}
      >
        {leaving ? "Signing you out" : "Sign out"}
        {leaving ? <Spinner /> : null}
      </button>
    </div>
  );
}
