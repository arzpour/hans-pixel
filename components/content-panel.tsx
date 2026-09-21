"use client";

import { AuthPanel } from "@/components/auth-panel";
import { ContactForm } from "@/components/contact-form";
import { ServiceBriefPanel } from "@/components/service-brief";
import { cn, labelText } from "@/lib/cn";
import type { PageContent } from "@/lib/site";

export function ContentPanel({ content }: { content: PageContent }) {
  return (
    <article className="flex w-full max-w-[560px] flex-col gap-3.5">
      <p className={cn("content-piece", labelText)}>{content.eyebrow}</p>
      <h1 className="content-piece font-heading text-[length:var(--text-title)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance [text-shadow:0_8px_28px_rgb(0_0_0_/_0.45)] max-md:text-[clamp(1.28rem,5vw,1.7rem)]">
        {content.title}
      </h1>
      <p className="content-piece max-w-2xl text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground">
        {content.lead}
      </p>
      {content.blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className="content-piece max-w-[65ch] text-base leading-relaxed text-muted-foreground"
            >
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="content-piece flex flex-col gap-2.5 text-foreground">
              {block.items.map((item) => (
                <li key={item} className="relative pl-[18px] before:absolute before:top-[0.55em] before:left-0 before:size-1.5 before:bg-accent">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "stats") {
          return (
            <dl key={index} className="content-piece grid grid-cols-3 gap-4 py-2 max-md:grid-cols-2">
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
            <ul key={index} className="content-piece flex flex-col gap-[18px]">
              {block.items.map((item, caseIndex) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-border py-2 max-md:grid-cols-1"
                >
                  <span className={cn(labelText, "max-md:hidden")} aria-hidden="true">
                    {String(caseIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-semibold leading-snug">{item.title}</h2>
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
            <div key={index} className="content-piece">
              <ServiceBriefPanel brief={block.brief} />
            </div>
          );
        }
        if (block.type === "shop") {
          return (
            <ul key={index} className="content-piece flex flex-col gap-3.5">
              {block.items.map((item) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3.5 border-t border-border pt-3 max-md:grid-cols-1"
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
        return (
          <div key={index} className="content-piece">
            <ContactForm />
          </div>
        );
      })}
    </article>
  );
}
