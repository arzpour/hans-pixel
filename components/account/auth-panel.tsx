"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/providers/session-provider";
import type { SessionUser } from "@/types/session";
import { apiFetch } from "@/lib/api";
import { cn, fieldControl, fieldLabel, focusRing, primaryButton } from "@/lib/cn";

const NAME_KEY = "hp-account-name";

function digits(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

async function postJson<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const response = await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => null)) as ({ error?: string } & T) | null;
  if (!response.ok) return { ok: false, error: data?.error || "The request failed." };
  return { ok: true, data: data as T };
}

export function AuthPanel() {
  const id = useId();
  const { user, status, setSession } = useSession();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [step, setStep] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const busyRef = useRef(false);
  const triedCode = useRef("");
  const consumedLink = useRef(false);

  const chip = (on: boolean) =>
    cn(
      "min-h-11 cursor-pointer border px-3.5 text-[length:var(--text-label)] uppercase tracking-[0.12em]",
      focusRing,
      on ? "border-accent text-foreground" : "border-border text-muted-foreground",
    );

  const verify = async (nextEmail: string, nextCode: string, nextName?: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    const result = await postJson<{ user: SessionUser; isAdmin?: boolean }>("/api/auth/verify-code", {
      email: nextEmail,
      code: nextCode,
      name: nextName || undefined,
    });
    if (!result.ok) {
      busyRef.current = false;
      setBusy(false);
      setError(result.error);
      setNotice(null);
      return;
    }
    sessionStorage.removeItem(NAME_KEY);
    setSession(result.data.user, Boolean(result.data.isAdmin));
    busyRef.current = false;
    setBusy(false);
  };

  useEffect(() => {
    if (status === "loading" || user || consumedLink.current) return;
    const params = new URLSearchParams(window.location.search);
    const mailedCode = digits(params.get("code") ?? "");
    const mailedEmail = params.get("email")?.trim() ?? "";
    if (mailedCode.length !== 6 || !mailedEmail.includes("@")) return;
    consumedLink.current = true;
    const storedName = sessionStorage.getItem(NAME_KEY)?.trim() ?? "";
    window.history.replaceState(null, "", "/account");
    setEmail(mailedEmail);
    setCode(mailedCode);
    setStep("code");
    setNotice("The code from your email is in the field. Checking it now.");
    triedCode.current = mailedCode;
    void verify(mailedEmail, mailedCode, storedName);
    // verify is stable enough for this one-shot link; retried codes go through the field effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user]);

  useEffect(() => {
    if (step !== "code" || code.length !== 6 || triedCode.current === code) return;
    triedCode.current = code;
    const storedName = mode === "up" ? name.trim() : (sessionStorage.getItem(NAME_KEY)?.trim() ?? "");
    // setNotice("The code is in the field. Checking it now.");
    void verify(email, code, storedName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, email, mode, name, step]);

  const sendCode = async () => {
    setBusy(true);
    busyRef.current = true;
    setError(null);
    setNotice(null);
    if (mode === "up" && name.trim()) sessionStorage.setItem(NAME_KEY, name.trim());
    else sessionStorage.removeItem(NAME_KEY);
    const result = await postJson<{ devCode?: string }>("/api/auth/request-code", { email });
    setBusy(false);
    busyRef.current = false;
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const nextCode = digits(result.data.devCode ?? "");
    triedCode.current = "";
    setStep("code");
    if (nextCode.length === 6) {
      setCode(nextCode);
      // setNotice("The code is in the field. Checking it now.");
      return;
    }
    setCode("");
    setNotice(null);
  };

  const onEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || (mode === "up" && !name.trim())) {
      setError("Complete the visible fields.");
      return;
    }
    await sendCode();
  };

  const onCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextCode = digits(code);
    if (nextCode.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    triedCode.current = "";
    setCode(nextCode);
    const storedName = mode === "up" ? name.trim() : (sessionStorage.getItem(NAME_KEY)?.trim() ?? "");
    triedCode.current = nextCode;
    await verify(email, nextCode, storedName);
  };

  if (user) return null;

  if (step === "code") {
    const errorId = `${id}-code-error`;
    return (
      <form className="flex max-w-md flex-col gap-4 max-md:max-w-none" onSubmit={(event) => void onCode(event)} noValidate aria-busy={busy}>
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground">
          Open the email and use the link. The six digits land in this field, then we check them.
        </p>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-code`} className={fieldLabel}>
            Code
          </label>
          <input
            id={`${id}-code`}
            name="one-time-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            pattern="[0-9]*"
            enterKeyHint="done"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            value={code}
            onChange={(event) => setCode(digits(event.target.value))}
            className={cn(fieldControl, "text-center font-heading font-semibold tracking-[0.22em] tabular-nums", focusRing)}
          />
        </div>
        {notice ? (
          <p className="flex items-center gap-2 text-base leading-relaxed text-muted-foreground" role="status">
            {notice}
            {busy ? <Spinner /> : null}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-base leading-relaxed text-accent" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className={cn(primaryButton, "gap-1.5 text-[length:var(--text-label)]", focusRing)}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Checking" : "Verify"}
          {busy ? <Spinner className="size-3.5" /> : null}
        </button>
        <button type="button" className={cn(chip(false), "w-fit")} onClick={() => void sendCode()} disabled={busy}>
          Email a new code
        </button>
      </form>
    );
  }

  return (
    <form className="flex max-w-md flex-col gap-4 max-md:max-w-none" onSubmit={(event) => void onEmail(event)} noValidate aria-busy={busy}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Account action">
        <button type="button" className={chip(mode === "in")} aria-pressed={mode === "in"} onClick={() => setMode("in")}>
          Sign in
        </button>
        <button type="button" className={chip(mode === "up")} aria-pressed={mode === "up"} onClick={() => setMode("up")}>
          Sign up
        </button>
      </div>

      {mode === "up" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className={fieldLabel}>
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={cn(fieldControl, focusRing)}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-email`} className={fieldLabel}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={cn(fieldControl, focusRing)}
        />
      </div>
      {/* {busy ? (
        <p className="flex items-center gap-2 text-base leading-relaxed text-muted-foreground" role="status">
          Sending a 6-digit code to your email.
          <Spinner />
        </p>
      ) : null} */}
      {error ? (
        <p className="text-base leading-relaxed text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className={cn(primaryButton, "gap-1.5 text-[length:var(--text-label)]", focusRing)}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "Sending" : "Email me a code"}
        {busy ? <Spinner className="size-3.5" /> : null}
      </button>
    </form>
  );
}
