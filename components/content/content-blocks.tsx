import { AccountRecords } from "@/components/account/account-records";
import { AuthPanel } from "@/components/account/auth-panel";
import { ProfilePanel } from "@/components/account/profile-panel";
import { MembershipPlans } from "@/components/membership/membership-plans";
import { ServiceBriefPanel } from "@/components/service/service-brief";
import { cn, labelText } from "@/lib/cn";
import type { ContentBlock } from "@/types/site";

function ParagraphBlock({ text, centered }: { text: string; centered: boolean }) {
  return (
    <p className={cn("content-piece max-w-[65ch] text-base leading-relaxed text-muted-foreground", centered && "mx-auto")}>
      {text}
    </p>
  );
}

function HeadingBlock({ text }: { text: string }) {
  return (
    <h2 className="content-piece mt-4 font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[0.14em] text-accent first:mt-1">
      {text}
    </h2>
  );
}

function ListBlock({ items, centered }: { items: string[]; centered: boolean }) {
  return (
    <ul className={cn("content-piece flex flex-col gap-2.5 text-foreground", centered ? "items-center" : "items-stretch")}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "relative text-base leading-relaxed",
            centered ? "pl-0 before:hidden" : "pl-[18px] before:absolute before:top-[0.55em] before:left-0 before:size-1.5 before:bg-accent",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function StepsBlock({ items }: { items: { index: string; title: string; text: string }[] }) {
  return (
    <ol className="content-piece flex w-full flex-col gap-4">
      {items.map((item) => (
        <li key={item.index} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-border pt-3 text-start">
          <span className={cn(labelText, "text-accent")} aria-hidden="true">
            {item.index}
          </span>
          <div>
            <h3 className="font-heading text-base font-semibold uppercase tracking-[0.08em] text-foreground">{item.title}</h3>
            <p className="mt-1 max-w-[65ch] text-base leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StatsBlock({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="content-piece grid grid-cols-3 gap-4 py-2 max-md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className={labelText}>{item.label}</dt>
          <dd className="font-heading text-[length:var(--text-stat)] text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CasesBlock({ items }: { items: { title: string; meta: string; year: string; blurb: string }[] }) {
  return (
    <ul className="flex flex-col gap-[18px]">
      {items.map((item, caseIndex) => (
        <li
          key={item.title}
          className="content-piece grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-border py-2 max-md:grid-cols-1"
        >
          <span className={cn(labelText, "max-md:hidden")} aria-hidden="true">
            {String(caseIndex + 1).padStart(2, "0")}
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold leading-snug">{item.title}</h2>
            <p className={labelText}>
              {item.meta} · {item.year}
            </p>
            <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">{item.blurb}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ShopBlock({ items }: { items: { title: string; price: string; days: string; blurb: string }[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li
          key={item.title}
          data-content-media
          className="content-piece grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3.5 border-t border-border pt-3 max-md:grid-cols-1"
        >
          <div
            className="h-[72px] w-[92px] bg-[linear-gradient(90deg,rgb(0_0_0_/_0.35),rgb(225_29_46_/_0.28)),url('/bg/shop.jpg')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-heading text-lg font-semibold leading-snug">{item.title}</h2>
            <p className={labelText}>
              {item.price} · {item.days}
            </p>
            <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">{item.blurb}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ContentBlockView({
  block,
  centered,
  serviceHref,
}: {
  block: ContentBlock;
  centered: boolean;
  serviceHref: string | null;
}) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} centered={centered} />;
    case "heading":
      return <HeadingBlock text={block.text} />;
    case "list":
      return <ListBlock items={block.items} centered={centered} />;
    case "steps":
      return <StepsBlock items={block.items} />;
    case "stats":
      return <StatsBlock items={block.items} />;
    case "cases":
      return <CasesBlock items={block.items} />;
    case "service":
      return <ServiceBriefPanel brief={block.brief} serviceHref={serviceHref} />;
    case "shop":
      return <ShopBlock items={block.items} />;
    case "membership":
      return <MembershipPlans plans={block.plans} />;
    case "auth":
      return (
        <div className="content-piece">
          <AuthPanel />
        </div>
      );
    case "profile":
      return (
        <div className="content-piece">
          <ProfilePanel />
        </div>
      );
    case "orders":
      return (
        <div className="content-piece">
          <AccountRecords />
        </div>
      );
    case "wallet":
      return null;
  }
}
