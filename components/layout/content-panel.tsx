"use client";

import { AccountRecords } from "@/components/account/account-records";
import { AuthPanel } from "@/components/account/auth-panel";
import { ProfilePanel } from "@/components/account/profile-panel";
import { ServiceBriefPanel } from "@/components/service/service-brief";
import { Spinner } from "@/components/ui/spinner";
import { cn, labelText } from "@/lib/cn";
import type { PageContent } from "@/types/site";

export function ContentPanel({
  content,
  serviceHref = null,
}: {
  content: PageContent;
  serviceHref?: string | null;
}) {
  const centered = content.layout === "viewport-center";

  return (
    <article
      className={cn(
        "my-auto flex w-full max-w-[560px] flex-col gap-3.5 py-4",
        centered && "items-center text-center",
      )}
    >
      {content.eyebrow ? (
        <p className={cn("content-piece", labelText)}>{content.eyebrow}</p>
      ) : null}
      <div
        className={cn(
          "content-piece flex w-full items-center gap-3",
          centered && "justify-center",
        )}
        role={content.pending ? "status" : undefined}
        aria-live={content.pending ? "polite" : undefined}
      >
        <h1 className="min-w-0 font-heading text-[length:var(--text-title)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance [text-shadow:0_8px_28px_rgb(0_0_0_/_0.45)] max-md:text-[clamp(1.28rem,5vw,1.7rem)]">
          {content.title}
        </h1>
        {content.pending ? (
          <Spinner className="size-5 text-muted-foreground" />
        ) : null}
      </div>
      {content.lead ? (
        <p
          className={cn(
            "content-piece max-w-2xl text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground",
            centered && "mx-auto",
          )}
        >
          {content.lead}
        </p>
      ) : null}
      {content.blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className={cn(
                "content-piece max-w-[65ch] text-base leading-relaxed text-muted-foreground",
                centered && "mx-auto",
              )}
            >
              {block.text}
            </p>
          );
        }
        if (block.type === "heading") {
          return (
            <h2
              key={index}
              className={cn(
                "content-piece mt-4 font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[0.14em] text-accent first:mt-1",
              )}
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul
              key={index}
              className={cn(
                "content-piece flex flex-col gap-2.5 text-foreground",
                centered ? "items-center" : "items-stretch",
              )}
            >
              {block.items.map((item) => (
                <li
                  key={item}
                  className={cn(
                    "relative text-base leading-relaxed",
                    centered
                      ? "pl-0 before:hidden"
                      : "pl-[18px] before:absolute before:top-[0.55em] before:left-0 before:size-1.5 before:bg-accent",
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "steps") {
          return (
            <ol
              key={index}
              className="content-piece flex w-full flex-col gap-4"
            >
              {block.items.map((item) => (
                <li
                  key={item.index}
                  className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-border pt-3 text-start"
                >
                  <span
                    className={cn(labelText, "text-accent")}
                    aria-hidden="true"
                  >
                    {item.index}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold uppercase tracking-[0.08em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "stats") {
          return (
            <dl
              key={index}
              className="content-piece grid grid-cols-3 gap-4 py-2 max-md:grid-cols-2"
            >
              {block.items.map((item) => (
                <div key={item.label}>
                  <dt className={labelText}>{item.label}</dt>
                  <dd className="font-heading text-[length:var(--text-stat)] text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          );
        }
        if (block.type === "cases") {
          return (
            <ul key={index} className="flex flex-col gap-[18px]">
              {block.items.map((item, caseIndex) => (
                <li
                  key={item.title}
                  className="content-piece grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-border py-2 max-md:grid-cols-1"
                >
                  <span
                    className={cn(labelText, "max-md:hidden")}
                    aria-hidden="true"
                  >
                    {String(caseIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-semibold leading-snug">
                      {item.title}
                    </h2>
                    <p className={labelText}>
                      {item.meta} · {item.year}
                    </p>
                    <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                      {item.blurb}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "service") {
          return (
            <div key={index}>
              <ServiceBriefPanel
                brief={block.brief}
                serviceHref={serviceHref}
              />
            </div>
          );
        }
        if (block.type === "shop") {
          return (
            <ul key={index} className="flex flex-col gap-3.5">
              {block.items.map((item) => (
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
                    <h2 className="font-heading text-lg font-semibold leading-snug">
                      {item.title}
                    </h2>
                    <p className={labelText}>
                      {item.price} · {item.days}
                    </p>
                    <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                      {item.blurb}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "auth") {
          return (
            <div key={index} className="content-piece">
              <AuthPanel />
            </div>
          );
        }
        if (block.type === "profile") {
          return (
            <div key={index} className="content-piece">
              <ProfilePanel />
            </div>
          );
        }
        if (block.type === "orders") {
          return (
            <div key={index} className="content-piece">
              <AccountRecords />
            </div>
          );
        }
        return null;
      })}
    </article>
  );
}
