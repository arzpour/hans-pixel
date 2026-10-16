"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useOrderSend } from "@/hooks/use-order-send";
import { cn, fieldControl, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import { ACCOUNT } from "@/lib/site";
import { useSession } from "@/providers/session-provider";

export function OrderForm({ serviceHref }: { serviceHref: string }) {
  const id = useId();
  const { user, status } = useSession();
  const [note, setNote] = useState("");
  const sending = useOrderSend({
    serviceHref,
    getNote: () => note,
    keepProgressOnError: true,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sending.send();
  };

  if (status === "loading") {
    return (
      <p className={cn("content-piece flex items-center gap-2", labelText)} role="status" aria-busy="true">
        Checking identity…
        <Spinner />
      </p>
    );
  }

  if (!user || sending.unauthorized) {
    return (
      <div className="content-piece flex max-w-md flex-col gap-3">
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground">
          Verify your identity before you place an order.
        </p>
        <Link href={ACCOUNT.href} className={cn(primaryButton, focusRing, "w-fit")}>
          Verify your identity
        </Link>
      </div>
    );
  }

  if (sending.sent) {
    return (
      <div className="content-piece flex max-w-md flex-col gap-3">
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground" role="status">
          Order received{user.email ? ` from ${user.email}` : ""}. Open Orders to see the service, your note, and the files.
        </p>
        <Link href="/account/orders" className={cn(primaryButton, focusRing, "w-fit")}>
          See your orders
        </Link>
      </div>
    );
  }

  const progress = sending.files.filter((item) => sending.activeKeys.includes(item.key));

  return (
    <form className="content-piece flex max-w-md flex-col gap-3" onSubmit={onSubmit}>
      <p className={labelText}>Signed in as {user.email}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-note`} className={fieldLabel}>
          Note
        </label>
        <textarea
          id={`${id}-note`}
          name="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What should change, and what should stay as it is."
          className={cn(fieldControl, "min-h-[5.5rem] resize-none", focusRing)}
        />
        <p className="text-base leading-relaxed text-muted-foreground">This note is saved with the order, next to the service name.</p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-files`}
          className="flex min-h-28 cursor-pointer flex-col justify-center gap-1 border border-dashed border-border px-4 py-4 hover:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring"
        >
          <span className="font-heading text-base uppercase tracking-[0.08em] text-foreground">Choose files</span>
          <span className="text-base leading-relaxed text-muted-foreground">
            Up to 100 GB a file. If a send stops, choose the same files again and it continues.
          </span>
          <input
            id={`${id}-files`}
            name="files"
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => {
              sending.replaceFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </label>
        {sending.files.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {sending.files.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 border-t border-border pt-2">
                <span className="min-w-0">
                  <span className="block truncate text-base text-foreground">{item.file.name}</span>
                  <span className={cn(labelText, "mt-1 block")}>{formatBytes(item.file.size)}</span>
                </span>
                <button
                  type="button"
                  className={cn(
                    "inline-flex min-h-11 items-center px-2 font-heading text-[length:var(--text-label)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground",
                    focusRing,
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    sending.removeKey(item.key, false);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base leading-relaxed text-muted-foreground">No files chosen yet.</p>
        )}
      </div>
      {sending.pending && !sending.resume ? (
        <p className="text-base leading-relaxed text-muted-foreground">A send is still open. Choose the same files to continue.</p>
      ) : null}
      {progress.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {progress.map((item) => (
            <li key={item.key}>
              <p className={labelText}>
                {item.file.name} · {Math.round(item.ratio * 100)}%
              </p>
              <div
                className="mt-1 h-1 bg-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(item.ratio * 100)}
                aria-label={item.file.name}
              >
                <div className="h-full bg-accent motion-reduce:transition-none" style={{ width: `${Math.round(item.ratio * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {sending.error ? (
        <p className="text-[0.9rem] text-accent" role="alert">
          {sending.error}
        </p>
      ) : null}
      <button
        type="submit"
        className={cn(primaryButton, "gap-2", focusRing)}
        disabled={sending.busy || sending.files.length === 0}
        aria-busy={sending.busy}
      >
        {sending.busy ? "Sending" : sending.resume ? "Continue send" : "Send files"}
        {sending.busy ? <Spinner /> : null}
      </button>
    </form>
  );
}
