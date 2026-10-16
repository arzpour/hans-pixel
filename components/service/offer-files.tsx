import { Check, Upload } from "lucide-react";
import type { RefObject } from "react";
import { cn, focusRing, labelText, primaryButton } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import type { ChosenFile } from "@/hooks/use-order-send";
import type { OfferUpload } from "@/types/site";

export function OfferFiles({
  id,
  uploads,
  files,
  uploadRefs,
  onAdd,
  onRemove,
}: {
  id: string;
  uploads: OfferUpload[];
  files: ChosenFile[];
  uploadRefs: RefObject<Record<string, HTMLInputElement | null>>;
  onAdd: (kind: string, list: FileList | null) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {uploads.map((slot) => (
          <button key={slot.id} type="button" className={cn(primaryButton, focusRing)} onClick={() => uploadRefs.current[slot.id]?.click()}>
            {slot.label}
          </button>
        ))}
      </div>
      {uploads.map((slot) => (
        <input
          key={slot.id}
          ref={(node) => {
            uploadRefs.current[slot.id] = node;
          }}
          id={`${id}-files-${slot.id}`}
          type="file"
          multiple
          accept={slot.accept}
          className="hidden"
          onChange={(event) => {
            onAdd(slot.id, event.target.files);
            event.target.value = "";
          }}
        />
      ))}
      {files.length > 0 ? (
        <ul className="flex w-full max-w-md flex-col gap-3" aria-live="polite">
          {files.map((item) => {
            const sentFile = item.status === "sent";
            const sending = item.status === "sending";
            const tag = uploads.find((slot) => slot.id === item.kind)?.tag;
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
                    {tag ? `${tag} · ` : ""}
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
                      onRemove(item.key);
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
    </>
  );
}
