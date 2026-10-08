"use client";

import { Check, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { cn, fieldControl, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import { MAX_FILE_BYTES } from "@/lib/limits";
import { ACCOUNT } from "@/lib/site";
import { forgetUpload, matchUploadFiles, readUpload, rememberUpload, uploadFile } from "@/lib/upload-client";
import type { OrderView } from "@/types/order";
import type { ServiceBrief } from "@/types/site";
import type { OpenUpload, UploadTarget } from "@/types/upload";

const outlineButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center border border-border bg-transparent px-[18px] font-heading text-[length:var(--text-label)] uppercase tracking-[0.08em] text-foreground transition-colors duration-200 hover:border-accent";

const sectionTitle =
  "font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[0.14em] text-accent";

type ChosenFile = {
  key: string;
  file: File;
  status: "waiting" | "sending" | "sent";
  ratio: number;
};

export function ServiceOffer({ brief, serviceHref }: { brief: ServiceBrief; serviceHref: string | null }) {
  const offer = brief.offer;
  const id = useId();
  const noteId = `${id}-quantity-note`;
  const [ndeOn, setNdeOn] = useState(false);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<ChosenFile[]>([]);
  const [identity, setIdentity] = useState<"loading" | "guest" | "member">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [priorCount, setPriorCount] = useState<number | null>(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<OpenUpload | null>(null);
  const filesRef = useRef<ChosenFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendController = useRef<AbortController | null>(null);
  const activeOrderId = useRef<string | null>(null);
  const batchKeys = useRef<Set<string>>(new Set());
  const stopReason = useRef<"remove" | null>(null);
  const resumeAfterRemove = useRef(false);

  useEffect(() => {
    if (!serviceHref) return;
    let active = true;
    void (async () => {
      const response = await apiFetch("/api/auth/session");
      const data = (await response.json().catch(() => null)) as { user: { email: string } | null } | null;
      if (!active) return;
      const saved = readUpload(serviceHref);
      if (saved) activeOrderId.current = saved.orderId;
      setPending(saved);
      if (!data?.user) {
        setIdentity("guest");
        setPriorCount(0);
        return;
      }
      setIdentity("member");
      setEmail(data.user.email);
      const ordersResponse = await apiFetch("/api/orders");
      const ordersData = (await ordersResponse.json().catch(() => null)) as { orders?: OrderView[] } | null;
      if (!active) return;
      const mine = (ordersData?.orders ?? []).filter((order) => order.senderEmail === data.user?.email);
      setPriorCount(mine.length);
    })();
    return () => {
      active = false;
    };
  }, [serviceHref]);

  if (!offer) return null;

  const nde = offer.ndeTitle && offer.ndeDetail && offer.ndeFee
    ? { title: offer.ndeTitle, detail: offer.ndeDetail, fee: offer.ndeFee }
    : null;
  const noteLabel = offer.noteLabel ?? "Add your editing notes";
  const noteHint = offer.noteHint ?? "Tell us what you'd like to change or achieve with your image.";
  const returning = (priorCount ?? 0) > 0;
  const needsPayment = identity === "member" && returning && !paid;

  const orderNote = () => {
    const lines: string[] = [];
    if (ndeOn && offer.ndeTitle) lines.push("NDE: yes (+25%)");
    if (offer.quantityLabel && quantity && quantity.trim()) lines.push(`${offer.quantityLabel}: ${quantity.trim()}`);
    for (const field of offer.fields ?? []) {
      const value = fields[field.label]?.trim();
      if (value) lines.push(`${field.label}: ${value}`);
    }
    if (note.trim()) lines.push(note.trim());
    return lines.join("\n");
  };

  const updateFiles = (recipe: (current: ChosenFile[]) => ChosenFile[]) => {
    const next = recipe(filesRef.current);
    filesRef.current = next;
    setFiles(next);
  };

  const removeFile = (key: string) => {
    const target = filesRef.current.find((item) => item.key === key);
    if (!target || target.status === "sent") return;
    updateFiles((current) => current.filter((item) => item.key !== key));
    if (!sendController.current) return;
    stopReason.current = "remove";
    sendController.current.abort();
  };

  const markFile = (key: string, status: ChosenFile["status"], ratio: number) => {
    updateFiles((current) => current.map((item) => (item.key === key ? { ...item, status, ratio } : item)));
  };

  const sendPairs = async (
    pairs: { key: string; target: UploadTarget; file: File }[],
    signal: AbortSignal,
  ) => {
    for (let index = 0; index < pairs.length; index += 1) {
      if (signal.aborted) throw new DOMException("Send stopped.", "AbortError");
      const pair = pairs[index];
      if (!pair) continue;
      markFile(pair.key, "sending", 0);
      await uploadFile(pair.file, pair.target, (ratio) => markFile(pair.key, "sending", ratio), signal);
      markFile(pair.key, "sent", 1);
    }
  };

  const send = async () => {
    const chosen = filesRef.current.filter((item) => item.status !== "sent");
    if (!serviceHref || chosen.length === 0 || sendController.current || needsPayment) return;
    const tooLarge = chosen.find((item) => item.file.size > MAX_FILE_BYTES);
    if (tooLarge) {
      setError(`${tooLarge.file.name} is over 100 GB.`);
      return;
    }
    const controller = new AbortController();
    sendController.current = controller;
    batchKeys.current = new Set(chosen.map((item) => item.key));
    setBusy(true);
    setError(null);
    setSent(false);
    try {
      const matched = pending ? matchUploadFiles(pending.files, chosen.map((item) => item.file)) : null;
      if (matched && pending) {
        const pairs = matched
          .map((pair) => {
            const source = chosen.find((item) => item.file === pair.file);
            return source ? { key: source.key, target: pair.target, file: pair.file } : null;
          })
          .filter((pair): pair is { key: string; target: UploadTarget; file: File } => Boolean(pair));
        await sendPairs(pairs, controller.signal);
        forgetUpload(serviceHref);
        setPending(null);
      } else {
        const response = await apiFetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceHref,
            note: orderNote(),
            files: chosen.map((item) => ({ name: item.file.name, size: item.file.size, type: item.file.type })),
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
        const openUpload: OpenUpload = { serviceHref, orderId: data.orderId, files: data.files };
        rememberUpload(openUpload);
        setPending(openUpload);
        const pairs = data.files
          .map((target, index) => {
            const source = chosen[index];
            return source ? { key: source.key, target, file: source.file } : null;
          })
          .filter((pair): pair is { key: string; target: UploadTarget; file: File } => Boolean(pair));
        await sendPairs(pairs, controller.signal);
        forgetUpload(serviceHref);
        setPending(null);
      }
      setSent(true);
      setPriorCount((count) => (count ?? 0) + 1);
      setPaid(false);
    } catch (caught) {
      if (controller.signal.aborted || (caught instanceof DOMException && caught.name === "AbortError")) {
        const orderId = activeOrderId.current;
        if (orderId) void apiFetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
        activeOrderId.current = null;
        forgetUpload(serviceHref);
        setPending(null);
        const removed = stopReason.current === "remove";
        stopReason.current = null;
        updateFiles((current) =>
          current.map((item) =>
            batchKeys.current.has(item.key) ? { ...item, status: "waiting", ratio: 0 } : item,
          ),
        );
        if (removed) {
          setError(null);
          resumeAfterRemove.current = filesRef.current.some((item) => item.status !== "sent");
        } else {
          setError("Send stopped. This order is cancelled.");
        }
      } else {
        updateFiles((current) =>
          current.map((item) => (item.status === "sending" ? { ...item, status: "waiting", ratio: 0 } : item)),
        );
        setError(caught instanceof Error ? caught.message : "The send stopped. Choose the same files again to continue.");
        setPending(serviceHref ? readUpload(serviceHref) : null);
      }
    } finally {
      if (sendController.current === controller) sendController.current = null;
      setBusy(false);
    }
    if (resumeAfterRemove.current) {
      resumeAfterRemove.current = false;
      void send();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="content-piece flex flex-col gap-2.5">
        <h2 className={sectionTitle}>Services</h2>
        <ul className="grid grid-cols-2 gap-2.5">
          {offer.services.map((item) => (
            <li key={item} className="relative pl-[18px] text-base leading-relaxed text-foreground">
              <span className="absolute top-[0.55em] left-0 size-1.5 bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="content-piece flex flex-col gap-2.5">
        <h2 className={sectionTitle}>Pictures</h2>
        <div
          className="grid min-h-[120px] max-w-md grid-cols-2 overflow-hidden border border-border"
          aria-hidden="true"
        >
          <div className="flex items-end bg-[linear-gradient(160deg,rgb(18_18_18_/_0.35),rgb(0_0_0_/_0.55)),url('/bg/photo.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-muted-foreground">
            <span>{brief.beforeLabel}</span>
          </div>
          <div className="flex items-end bg-[linear-gradient(160deg,rgb(225_29_46_/_0.28),rgb(0_0_0_/_0.55)),url('/bg/graphic.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-foreground">
            <span>{brief.afterLabel}</span>
          </div>
        </div>
      </section>

      <dl className={cn("content-piece grid gap-4", brief.time && "grid-cols-2")}>
        <div className="min-w-0">
          <dt className={labelText}>Price</dt>
          <dd className="font-heading text-[length:var(--text-lead)] text-foreground">{brief.price}</dd>
          {offer.priceNote ? (
            <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-muted-foreground">{offer.priceNote}</p>
          ) : null}
        </div>
        {brief.time ? (
          <div className="min-w-0">
            <dt className={labelText}>Time</dt>
            <dd className="font-heading text-[length:var(--text-lead)] text-foreground">{brief.time}</dd>
          </div>
        ) : null}
      </dl>

      <div className="content-piece flex flex-col gap-3">
        {nde ? (
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={ndeOn}
              onChange={(event) => setNdeOn(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-accent"
            />
            <span className="min-w-0">
              <div className="flex gap-2 items-center">
              <span className="font-heading text-base font-semibold uppercase tracking-[0.08em] text-foreground">
                {nde.title}
              </span>
              <span className="block text-sm leading-relaxed text-foreground">({nde.fee})</span>
              </div>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">({nde.detail})</span>
            </span>
          </label>
        ) : null}

        {offer.quantityLabel ? (
          <div className="flex flex-col gap-1.5">
            {/* <label htmlFor={`${id}-quantity`} className={fieldLabel}>
              {offer.quantityLabel}
            </label> */}
            <input
              id={`${id}-quantity`}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={quantity ?? undefined}
              aria-describedby={offer.quantityNote ? noteId : undefined}
              placeholder={offer.quantityLabel}
              onChange={(event) => setQuantity(event.target.value)}
              className={cn(fieldControl, "w-28", focusRing)}
            />
            {offer.quantityNote ? (
              <p id={noteId} className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                Note: {offer.quantityNote}
              </p>
            ) : null}
          </div>
        ) : null}

        {offer.fields?.map((field, index) => {
          const fieldId = `${id}-field-${index}`;
          const hintId = `${fieldId}-hint`;
          return (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label htmlFor={fieldId} className={fieldLabel}>
                {field.label}
              </label>
              <input
                id={fieldId}
                type={field.kind === "number" ? "number" : "text"}
                inputMode={field.kind === "number" ? "numeric" : undefined}
                min={field.kind === "number" ? 1 : undefined}
                step={field.kind === "number" ? 1 : undefined}
                value={fields[field.label] ?? ""}
                aria-describedby={field.hint ? hintId : undefined}
                onChange={(event) =>
                  setFields((current) => ({ ...current, [field.label]: event.target.value }))
                }
                className={cn(fieldControl, field.kind === "number" ? "w-28" : "max-w-md", focusRing)}
              />
              {field.hint ? (
                <p id={hintId} className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                  {field.hint}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            className={cn(primaryButton, focusRing)}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload here
          </button>
          <input
            ref={fileInputRef}
            id={`${id}-files`}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              const picked = Array.from(event.target.files ?? []).map((file) => ({
                key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                file,
                status: "waiting" as const,
                ratio: 0,
              }));
              updateFiles((current) => [...current, ...picked]);
              event.target.value = "";
            }}
          />
          {files.length > 0 ? (
            <ul className="flex w-full max-w-md flex-col gap-3" aria-live="polite">
              {files.map((item) => {
                const sentFile = item.status === "sent";
                const sending = item.status === "sending";
                return (
                  <li key={item.key} className="flex items-start gap-3 border-t border-border pt-3">
                    {sentFile ? (
                      <Check className="mt-1 size-4 shrink-0 text-foreground" aria-hidden="true" />
                    ) : (
                      <Upload className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base text-foreground">{item.file.name}</p>
                      <p className={cn(labelText, "mt-1")}>
                        {formatBytes(item.file.size)}
                        {sentFile ? " · Sent" : sending ? ` · Sending ${Math.round(item.ratio * 100)}%` : " · Not sent"}
                      </p>
                      {sending ? (
                        <div
                          className="mt-2 h-1 bg-muted"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(item.ratio * 100)}
                          aria-label={item.file.name}
                        >
                          <div className="h-full bg-accent" style={{ width: `${Math.round(item.ratio * 100)}%` }} />
                        </div>
                      ) : null}
                    </div>
                    {sentFile ? null : (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex min-h-11 items-center px-2 font-heading text-[length:var(--text-label)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground",
                          focusRing,
                        )}
                        aria-label={`Remove ${item.file.name}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          removeFile(item.key);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div className="flex w-full max-w-md flex-col gap-1.5">
            {/* <label htmlFor={`${id}-note`} className={fieldLabel}>
              {noteLabel}
            </label> */}
            <textarea
              id={`${id}-note`}
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby={`${id}-note-hint`}
              placeholder={noteLabel}
              className={cn(fieldControl, "min-h-[5.5rem] resize-none", focusRing)}
            />
            <p id={`${id}-note-hint`} className="text-sm leading-relaxed text-muted-foreground">
              {noteHint}
            </p>
          </div>
          {sent ? (
            <p className="text-base leading-relaxed text-muted-foreground" role="status">
              Sent{email ? ` from ${email}` : ""}.
            </p>
          ) : null}
          {error ? (
            <p className="text-base leading-relaxed text-accent" role="alert">
              {error}
            </p>
          ) : null}
          {identity === "loading" ? (
            <p className={cn("flex items-center gap-2", labelText)} role="status" aria-busy="true">
              Checking your orders
              <Spinner />
            </p>
          ) : null}
          {identity === "guest" ? (
            <Link href={ACCOUNT.href} className={cn(primaryButton, focusRing)}>
              Verify your identity
            </Link>
          ) : null}
          {identity === "member" && priorCount === 0 ? (
            <p className="text-base leading-relaxed text-muted-foreground">Your first send is free.</p>
          ) : null}
          {needsPayment ? (
            <button type="button" className={cn(primaryButton, focusRing)} onClick={() => setPaid(true)}>
              Payment
            </button>
          ) : null}
          {identity === "member" && priorCount !== null && !needsPayment ? (
            <button
              type="button"
              className={cn(primaryButton, "gap-2", focusRing)}
              disabled={busy || priorCount === null || !files.some((item) => item.status !== "sent")}
              aria-busy={busy}
              onClick={() => void send()}
            >
              {busy ? "Sending" : "Send"}
              {busy ? <Spinner /> : null}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
