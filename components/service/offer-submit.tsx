import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { cn, focusRing, labelText, primaryButton } from "@/lib/cn";
import { formatDollars } from "@/lib/pricing";
import { ACCOUNT } from "@/lib/site";
import type { ChosenFile } from "@/hooks/use-order-send";

export function OfferSubmit({
  email,
  loading,
  guest,
  member,
  priorCount,
  needsPayment,
  payable,
  sent,
  error,
  busy,
  files,
  onPay,
  onSend,
}: {
  email: string | null;
  loading: boolean;
  guest: boolean;
  member: boolean;
  priorCount: number | null;
  needsPayment: boolean;
  payable: number | null;
  sent: boolean;
  error: string | null;
  busy: boolean;
  files: ChosenFile[];
  onPay: () => void;
  onSend: () => void;
}) {
  const canSend = files.some((item) => item.status !== "sent");

  return (
    <>
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
      {loading ? (
        <p className={cn("flex items-center gap-2", labelText)} role="status" aria-busy="true">
          Checking your orders
          <Spinner />
        </p>
      ) : null}
      {guest ? (
        <Link href={ACCOUNT.href} className={cn(primaryButton, focusRing)}>
          Verify your identity
        </Link>
      ) : null}
      {member && priorCount === 0 ? <p className="text-base leading-relaxed text-muted-foreground">Your first send is free.</p> : null}
      {needsPayment ? (
        <div className="flex flex-col items-start gap-2">
          {payable != null ? <p className="font-heading text-[length:var(--text-lead)] text-foreground">{formatDollars(payable)}</p> : null}
          <button type="button" className={cn(primaryButton, focusRing)} onClick={onPay}>
            Payment
          </button>
        </div>
      ) : null}
      {member && priorCount !== null && !needsPayment ? (
        <button
          type="button"
          className={cn(primaryButton, "gap-2", focusRing)}
          disabled={busy || priorCount === null || !canSend}
          aria-busy={busy}
          onClick={onSend}
        >
          {busy ? "Sending" : "Send"}
          {busy ? <Spinner /> : null}
        </button>
      ) : null}
    </>
  );
}
