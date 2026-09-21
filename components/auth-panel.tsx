"use client";

import { FormEvent, useId, useState } from "react";
import { cn, fieldControl, fieldLabel, focusRing, primaryButton } from "@/lib/cn";

export function AuthPanel() {
  const id = useId();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || (mode === "up" && !name.trim())) {
      setError("Complete the visible fields. Paste is allowed.");
      return;
    }
    setError(null);
    setDone(true);
  };

  const chip = (on: boolean) =>
    cn(
      "min-h-11 cursor-pointer border px-3.5 text-[length:var(--text-label)] uppercase tracking-[0.12em]",
      focusRing,
      on ? "border-accent text-foreground" : "border-border text-muted-foreground",
    );

  if (done) {
    return (
      <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground" role="status">
        {mode === "in" ? "Signed in." : "Account created."} The desk is open for {email}.
      </p>
    );
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5 max-md:max-w-none" onSubmit={onSubmit} noValidate>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Account action">
        <button type="button" className={chip(mode === "in")} aria-pressed={mode === "in"} onClick={() => setMode("in")}>
          Sign in
        </button>
        <button type="button" className={chip(mode === "up")} aria-pressed={mode === "up"} onClick={() => setMode("up")}>
          Sign up
        </button>
      </div>

      {mode === "up" ? (
        <div className="flex flex-col gap-1.5">
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

      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-password`} className={fieldLabel}>
          Password
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete={mode === "in" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={cn(fieldControl, focusRing)}
        />
      </div>
      {error ? (
        <p className="text-[0.9rem] text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={cn(primaryButton, focusRing)}>
        {mode === "in" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
