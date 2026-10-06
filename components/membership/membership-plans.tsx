import { cn, labelText } from "@/lib/cn";
import type { MembershipPlan } from "@/types/site";

export function MembershipPlans({ plans }: { plans: MembershipPlan[] }) {
  return (
    <div className="@container w-full">
      <ul className="grid grid-cols-1 gap-4 @3xl:grid-cols-3 @3xl:items-stretch">
        {plans.map((plan, index) => (
          <li
            key={plan.name}
            className={cn(
              "content-piece relative flex min-w-0 flex-col gap-6 overflow-hidden border bg-black/85 p-5 backdrop-blur-md sm:p-6",
              plan.featured ? "border-accent" : "border-border",
            )}
          >
            {plan.featured ? (
              <>
                <span className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden="true" />
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent"
                  aria-hidden="true"
                />
              </>
            ) : null}

            <header className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-heading text-[length:var(--text-sub)] font-semibold uppercase tracking-[0.06em] text-foreground">
                  {plan.name}
                </h2>
                <p className={cn(labelText, "mt-2")}>{plan.term}</p>
              </div>
              <span className={labelText} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </header>

            <p className="relative">
              <span className="block font-heading text-[clamp(2.75rem,12cqi,3.5rem)] font-semibold leading-none tracking-[-0.045em] text-foreground [text-shadow:0_10px_28px_rgb(0_0_0_/_0.45)]">
                {plan.bonus}
              </span>
              <span className={cn(labelText, "mt-3 block")}>Get extra credit</span>
            </p>

            <dl className="relative flex flex-col">
              <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
                <dt className={labelText}>Minimum deposit</dt>
                <dd className="font-heading text-[length:var(--text-lead)] whitespace-nowrap text-foreground">
                  {plan.deposit}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
                <dt className={labelText}>Wallet credit</dt>
                <dd className="font-heading text-[length:var(--text-lead)] whitespace-nowrap font-semibold text-foreground">
                  {plan.credit}
                </dd>
              </div>
            </dl>

            <p className="relative border border-border bg-black/50 px-3 py-3 text-base leading-relaxed text-pretty text-foreground">
              {plan.line}
            </p>

            <p className="relative mt-auto border-t border-border pt-4 text-base leading-relaxed text-pretty text-muted-foreground">
              {plan.expiry}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
