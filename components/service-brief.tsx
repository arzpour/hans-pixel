"use client";

import { ChangeEvent, FormEvent, useId, useState } from "react";
import { cn, fieldLabel, focusRing, labelText, primaryButton } from "@/lib/cn";
import type { ServiceBrief } from "@/lib/site";

export function ServiceBriefPanel({ brief }: { brief: ServiceBrief }) {
  const id = useId();
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "sent">("idle");

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      setStatus("idle");
      return;
    }
    setFileName(file.name);
    setStatus("ready");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileName) return;
    setStatus("sent");
  };

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h2 className={cn(labelText, "mb-1.5")}>Describe</h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">{brief.describe}</p>
      </section>

      <div className="grid min-h-[120px] max-w-md grid-cols-2 overflow-hidden border border-border" aria-hidden="true">
        <div className="flex items-end bg-[linear-gradient(160deg,rgb(18_18_18_/_0.35),rgb(0_0_0_/_0.55)),url('/bg/photo.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{brief.beforeLabel}</span>
        </div>
        <div className="flex items-end bg-[linear-gradient(160deg,rgb(225_29_46_/_0.28),rgb(0_0_0_/_0.55)),url('/bg/graphic.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-foreground">
          <span>{brief.afterLabel}</span>
        </div>
      </div>
      <p className={labelText}>
        Before {brief.beforeLabel} · After {brief.afterLabel}
      </p>

      <dl className="grid grid-cols-[repeat(3,max-content)] gap-3 gap-x-8 max-md:grid-cols-2 max-md:gap-x-4">
        <div>
          <dt className={labelText}>Price</dt>
          <dd className="font-heading text-[length:var(--text-lead)] text-foreground max-md:whitespace-normal whitespace-nowrap">
            {brief.price}
          </dd>
        </div>
        <div>
          <dt className={labelText}>Time</dt>
          <dd className="font-heading text-[length:var(--text-lead)] whitespace-nowrap text-foreground">
            {brief.time}
          </dd>
        </div>
        {brief.days ? (
          <div>
            <dt className={labelText}>Days</dt>
            <dd className="font-heading text-[length:var(--text-lead)] whitespace-nowrap text-foreground">
              {brief.days}
            </dd>
          </div>
        ) : null}
      </dl>

      {status === "sent" ? (
        <p className="text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground" role="status">
          Upload received: {fileName}. We will reply with a preview.
        </p>
      ) : (
        <form className="flex max-w-md flex-col gap-2" onSubmit={onSubmit}>
          <label htmlFor={`${id}-file`} className={fieldLabel}>
            Upload
          </label>
          <input
            id={`${id}-file`}
            name="file"
            type="file"
            accept="image/*,video/*,.psd,.zip,.pdf"
            onChange={onFile}
            className={cn(
              "min-h-11 w-full cursor-pointer text-muted-foreground file:me-3 file:min-h-11 file:cursor-pointer file:border-0 file:bg-muted file:px-3 file:font-heading file:text-[length:var(--text-label)] file:uppercase file:tracking-[0.08em] file:text-foreground",
              focusRing,
            )}
          />
          <p className={labelText}>
            {fileName ? fileName : "RAW, JPEG, PSD, ZIP, or a short clip."}
          </p>
          <button type="submit" className={cn(primaryButton, focusRing)} disabled={!fileName}>
            {status === "ready" ? "Send file" : "Choose a file first"}
          </button>
        </form>
      )}
    </div>
  );
}
