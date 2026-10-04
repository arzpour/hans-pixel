"use client";

import { OrderForm } from "@/components/order-form";
import { cn, labelText } from "@/lib/cn";
import type { ServiceBrief } from "@/lib/site";

export function ServiceBriefPanel({ brief, serviceHref }: { brief: ServiceBrief; serviceHref: string | null }) {
  return (
    <div className="flex flex-col gap-4">
      {/* <section className="content-piece">
        <h2 className={cn(labelText, "mb-1.5")}>Describe</h2>
        <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">{brief.describe}</p>
      </section> */}

      <div
        data-content-media
        className="content-piece grid min-h-[120px] max-w-md grid-cols-2 overflow-hidden border border-border"
        aria-hidden="true"
      >
        <div className="flex items-end bg-[linear-gradient(160deg,rgb(18_18_18_/_0.35),rgb(0_0_0_/_0.55)),url('/bg/photo.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{brief.beforeLabel}</span>
        </div>
        <div className="flex items-end bg-[linear-gradient(160deg,rgb(225_29_46_/_0.28),rgb(0_0_0_/_0.55)),url('/bg/graphic.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-foreground">
          <span>{brief.afterLabel}</span>
        </div>
      </div>
      <p className={cn("content-piece", labelText)}>
        Before {brief.beforeLabel} · After {brief.afterLabel}
      </p>

      <dl className="content-piece grid grid-cols-[repeat(3,max-content)] gap-3 gap-x-8 max-md:grid-cols-2 max-md:gap-x-4">
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

      {serviceHref ? <OrderForm serviceHref={serviceHref} /> : null}
    </div>
  );
}
