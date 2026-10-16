"use client";

import { ContentBlockView } from "@/components/content/content-blocks";
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
  const wide = content.layout === "wide";

  return (
    <article
      className={cn(
        "my-auto flex w-full flex-col gap-3.5 py-4",
        wide ? "max-w-none" : "max-w-[560px]",
        centered && "items-center text-center",
      )}
    >
      {content.eyebrow ? <p className={cn("content-piece", labelText)}>{content.eyebrow}</p> : null}
      <div
        className={cn("content-piece flex w-full items-center gap-3", centered && "justify-center")}
        role={content.pending ? "status" : undefined}
        aria-live={content.pending ? "polite" : undefined}
      >
        <h1 className="min-w-0 font-heading text-[length:var(--text-title)] font-semibold leading-[1.12] tracking-[-0.025em] text-balance [text-shadow:0_8px_28px_rgb(0_0_0_/_0.45)] max-md:text-[clamp(1.28rem,5vw,1.7rem)]">
          {content.title}
        </h1>
        {content.pending ? <Spinner className="size-5 text-muted-foreground" /> : null}
      </div>
      {content.lead ? (
        <p className={cn("content-piece max-w-2xl text-[length:var(--text-lead)] leading-[1.6] text-muted-foreground", centered && "mx-auto")}>
          {content.lead}
        </p>
      ) : null}
      {content.blocks.map((block, index) => (
        <ContentBlockView key={`${block.type}-${index}`} block={block} centered={centered} serviceHref={serviceHref} />
      ))}
    </article>
  );
}
