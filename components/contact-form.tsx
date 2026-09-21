"use client";

import { FormEvent, useId, useState } from "react";
import { cn, fieldControl, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";

const EMAIL = "studio@hanspixel.com";

export function ContactForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSent(true);
  };

  if (sent) {
    return (
      <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground" role="status">
        Received. We will write back at {email}.
      </p>
    );
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5 max-md:max-w-none" onSubmit={onSubmit} noValidate>
      <p className={labelText}>
        Or write directly to{" "}
        <a
          className={cn("text-foreground underline decoration-accent underline-offset-4", focusRing)}
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
      </p>
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className={fieldLabel}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={cn(fieldControl, focusRing)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-message`} className={fieldLabel}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(fieldControl, "min-h-[5.5rem] resize-none", focusRing)}
        />
      </div>
      {error ? (
        <p className="text-[0.9rem] text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={cn(primaryButton, focusRing)}>
        Send note
      </button>
    </form>
  );
}
