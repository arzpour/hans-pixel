"use client";

import { useId, useState } from "react";
import { cn, fieldControl, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import type { ServiceBrief } from "@/types/site";

const outlineButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center border border-border bg-transparent px-[18px] font-heading text-[length:var(--text-label)] uppercase tracking-[0.08em] text-foreground transition-colors duration-200 hover:border-accent";

const sectionTitle =
  "font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[0.14em] text-accent";

export function ServiceOffer({ brief }: { brief: ServiceBrief }) {
  const offer = brief.offer;
  const id = useId();
  const noteId = `${id}-quantity-note`;
  const [ndeOn, setNdeOn] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);

  if (!offer) return null;

  const nde = offer.ndeTitle && offer.ndeDetail && offer.ndeFee
    ? { title: offer.ndeTitle, detail: offer.ndeDetail, fee: offer.ndeFee }
    : null;
  const noteLabel = offer.noteLabel ?? "Add your editing notes";
  const noteHint = offer.noteHint ?? "Tell us what you'd like to change or achieve with your image.";

  return (
    <div className="flex flex-col gap-4">
      <section className="content-piece flex flex-col gap-2.5">
        <h2 className={sectionTitle}>Services</h2>
        <ul className="flex flex-col gap-2.5">
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
              <span className="font-heading text-base font-semibold uppercase tracking-[0.08em] text-foreground">
                {nde.title}
              </span>
              <span className="mt-1 block text-base leading-relaxed text-muted-foreground">{nde.detail}</span>
              <span className="mt-1 block text-base leading-relaxed text-foreground">{nde.fee}</span>
            </span>
          </label>
        ) : null}

        {offer.quantityLabel ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-quantity`} className={fieldLabel}>
              {offer.quantityLabel}
            </label>
            <input
              id={`${id}-quantity`}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={quantity}
              aria-describedby={offer.quantityNote ? noteId : undefined}
              onChange={(event) => setQuantity(event.target.value)}
              className={cn(fieldControl, "w-28", focusRing)}
            />
            {offer.quantityNote ? (
              <p id={noteId} className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
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
          <label htmlFor={`${id}-files`} className={cn(outlineButton, "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring")}>
            Upload here
            <input
              id={`${id}-files`}
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => {
                setFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
          </label>
          <div className="flex w-full max-w-md flex-col gap-1.5">
            <label htmlFor={`${id}-note`} className={fieldLabel}>
              {noteLabel}
            </label>
            <textarea
              id={`${id}-note`}
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-describedby={`${id}-note-hint`}
              className={cn(fieldControl, "min-h-[5.5rem] resize-none", focusRing)}
            />
            <p id={`${id}-note-hint`} className="text-base leading-relaxed text-muted-foreground">
              {noteHint}
            </p>
          </div>
          <button type="button" className={cn(primaryButton, focusRing)}>
            Payment
          </button>
        </div>

        {files.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`} className="border-t border-border pt-2">
                <span className="block truncate text-base text-foreground">{file.name}</span>
                <span className={cn(labelText, "mt-1 block")}>{formatBytes(file.size)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
