export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export const labelText =
  "text-[length:var(--text-label)] uppercase tracking-[0.14em] text-muted-foreground";

export const fieldLabel =
  "text-[length:var(--text-label)] uppercase tracking-[0.14em] text-foreground";

export const fieldControl =
  "min-h-11 w-full rounded-sm border border-border bg-card px-3 py-2.5 text-base leading-relaxed text-foreground";

export const primaryButton =
  "inline-flex min-h-11 w-fit cursor-pointer items-center justify-center border border-accent bg-accent px-[18px] font-heading text-on-accent uppercase tracking-[0.08em] transition-colors duration-200 hover:border-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-45";
