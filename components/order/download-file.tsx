"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Spinner } from "@/components/ui/spinner";
import { apiUrl } from "@/lib/api";
import { cn, focusRing } from "@/lib/cn";
import { downloadUpload, uploadDownloadPath } from "@/lib/download-file";

const downloadLink = cn(
  "inline-flex min-h-11 shrink-0 items-center gap-2 border border-border px-3 font-heading text-[length:var(--text-label)] uppercase tracking-[0.08em] text-foreground no-underline hover:border-accent",
  focusRing,
);

export function DownloadFile({ fileId, name }: { fileId: string; name: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const href = apiUrl(uploadDownloadPath(fileId));

  async function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    const result = await downloadUpload(fileId, name);
    if (!result.ok) setError(result.error);
    pending.current = false;
    setBusy(false);
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <a
        className={cn(downloadLink, busy && "pointer-events-none")}
        href={href}
        aria-busy={busy || undefined}
        onClick={(event) => void onClick(event)}
      >
        {busy ? "Downloading" : "Download"}
        {busy ? <Spinner className="size-3.5" /> : null}
      </a>
      {error ? (
        <p className="text-base leading-relaxed text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </span>
  );
}
