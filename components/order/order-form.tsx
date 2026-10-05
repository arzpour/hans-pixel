"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import {
  cn,
  fieldControl,
  fieldLabel,
  focusRing,
  labelText,
  primaryButton,
} from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import { MAX_FILE_BYTES } from "@/lib/limits";
import { ACCOUNT } from "@/lib/site";
import {
  forgetUpload,
  matchUploadFiles,
  readUpload,
  rememberUpload,
  uploadFile,
} from "@/lib/upload-client";
import type { OpenUpload, UploadTarget } from "@/types/upload";

type Identity = "loading" | "guest" | "member";

type FileProgress = { name: string; ratio: number };

export function OrderForm({ serviceHref }: { serviceHref: string }) {
  const id = useId();
  const [identity, setIdentity] = useState<Identity>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState<OpenUpload | null>(null);
  const [progress, setProgress] = useState<FileProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const filesRef = useRef<File[]>([]);
  const sendController = useRef<AbortController | null>(null);
  const activeOrderId = useRef<string | null>(null);
  filesRef.current = files;

  useEffect(() => {
    let active = true;
    void (async () => {
      const response = await apiFetch("/api/auth/session");
      const data = (await response.json().catch(() => null)) as {
        user: { email: string } | null;
      } | null;
      if (!active) return;
      if (data?.user) {
        setIdentity("member");
        setEmail(data.user.email);
      } else {
        setIdentity("guest");
      }
      const saved = readUpload(serviceHref);
      if (saved) activeOrderId.current = saved.orderId;
      setPending(saved);
    })();
    return () => {
      active = false;
    };
  }, [serviceHref]);

  const resume = pending ? matchUploadFiles(pending.files, files) : null;

  const sendPairs = async (pairs: { target: UploadTarget; file: File }[], signal: AbortSignal) => {
    const next = pairs.map((pair) => ({ name: pair.file.name, ratio: 0 }));
    setProgress(next);
    for (let index = 0; index < pairs.length; index += 1) {
      if (signal.aborted) throw new DOMException("Send stopped.", "AbortError");
      const pair = pairs[index];
      if (!pair) continue;
      await uploadFile(
        pair.file,
        pair.target,
        (ratio) => {
          setProgress((current) =>
            current.map((item, itemIndex) =>
              itemIndex === index ? { ...item, ratio } : item,
            ),
          );
        },
        signal,
      );
    }
  };

  const removeFile = (index: number) => {
    const next = filesRef.current.filter((_, itemIndex) => itemIndex !== index);
    filesRef.current = next;
    setFiles(next);
    sendController.current?.abort();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chosen = filesRef.current;
    if (chosen.length === 0 || sendController.current) return;
    const tooLarge = chosen.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.name} is over 100 GB.`);
      return;
    }

    const controller = new AbortController();
    sendController.current = controller;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const matched = pending ? matchUploadFiles(pending.files, chosen) : null;
      if (matched && pending) {
        await sendPairs(matched, controller.signal);
        forgetUpload(serviceHref);
        setPending(null);
        setDone(true);
        return;
      }

      const response = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceHref,
          note,
          files: chosen.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        }),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        orderId?: string;
        files?: UploadTarget[];
      } | null;
      if (response.status === 401) {
        setIdentity("guest");
        setError("Verify your identity before you place an order.");
        return;
      }
      if (!response.ok || !data?.orderId || !data.files) {
        throw new Error(data?.error || "The order could not be opened.");
      }

      activeOrderId.current = data.orderId;
      const openUpload: OpenUpload = {
        serviceHref,
        orderId: data.orderId,
        files: data.files,
      };
      rememberUpload(openUpload);
      setPending(openUpload);
      const pairs = data.files
        .map((target, index) => ({ target, file: chosen[index] }))
        .filter((pair) => pair.file);
      await sendPairs(pairs, controller.signal);
      forgetUpload(serviceHref);
      setPending(null);
      setDone(true);
    } catch (caught) {
      if (controller.signal.aborted || (caught instanceof DOMException && caught.name === "AbortError")) {
        const orderId = activeOrderId.current;
        if (orderId) void apiFetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
        activeOrderId.current = null;
        forgetUpload(serviceHref);
        setPending(null);
        setProgress([]);
        setError("Send stopped. This order is cancelled.");
        return;
      }
      setError(
        caught instanceof Error
          ? caught.message
          : "The send stopped. Choose the same files again to continue.",
      );
      setPending(readUpload(serviceHref));
    } finally {
      if (sendController.current === controller) sendController.current = null;
      setBusy(false);
    }
  };

  if (identity === "loading") {
    return (
      <p className={cn("content-piece flex items-center gap-2", labelText)} role="status" aria-busy="true">
        Checking identity…
        <Spinner />
      </p>
    );
  }

  if (identity === "guest") {
    return (
      <div className="content-piece flex max-w-md flex-col gap-3">
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground">
          Verify your identity before you place an order.
        </p>
        <Link
          href={ACCOUNT.href}
          className={cn(primaryButton, focusRing, "w-fit")}
        >
          Verify your identity
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="content-piece flex max-w-md flex-col gap-3">
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground" role="status">
          Order received{email ? ` from ${email}` : ""}. Open Orders to see the service, your note, and the files.
        </p>
        <Link href="/account/orders" className={cn(primaryButton, focusRing, "w-fit")}>
          See your orders
        </Link>
      </div>
    );
  }

  return (
    <form
      className="content-piece flex max-w-md flex-col gap-3"
      onSubmit={(event) => void onSubmit(event)}
    >
      <p className={labelText}>Signed in as {email}</p>
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
        <p className="text-base leading-relaxed text-muted-foreground">
          This note is saved with the order, next to the service name.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${id}-files`}
          className={cn(
            "flex min-h-28 cursor-pointer flex-col justify-center gap-1 border border-dashed border-border px-4 py-4 hover:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring",
          )}
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
              setFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </label>
        {files.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3 border-t border-border pt-2">
                <span className="min-w-0">
                  <span className="block truncate text-base text-foreground">{file.name}</span>
                  <span className={cn(labelText, "mt-1 block")}>{formatBytes(file.size)}</span>
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
                    removeFile(index);
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
      {pending && !resume ? (
        <p className="text-base leading-relaxed text-muted-foreground">
          A send is still open. Choose the same files to continue.
        </p>
      ) : null}
      {progress.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {progress.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              <p className={labelText}>
                {item.name} · {Math.round(item.ratio * 100)}%
              </p>
              <div
                className="mt-1 h-1 bg-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(item.ratio * 100)}
                aria-label={item.name}
              >
                <div
                  className="h-full bg-accent motion-reduce:transition-none"
                  style={{ width: `${Math.round(item.ratio * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p className="text-[0.9rem] text-accent" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className={cn(primaryButton, "gap-2", focusRing)}
        disabled={busy || files.length === 0}
        aria-busy={busy}
      >
        {busy ? "Sending" : resume ? "Continue send" : "Send files"}
        {busy ? <Spinner /> : null}
      </button>
    </form>
  );
}
