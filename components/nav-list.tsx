"use client";

import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import { cn, focusRing } from "@/lib/cn";
import type { NavNode } from "@/lib/site";

type NavListProps = {
  items: NavNode[];
  activeId: string | null;
  ancestorId?: string | null;
  flipPrefix: string;
  ariaLabel: string;
  variant: "hero" | "rail";
  align?: "start" | "center";
  tone?: "primary" | "sub";
  onCapture: () => void;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function NavList({
  items,
  activeId,
  ancestorId,
  flipPrefix,
  ariaLabel,
  variant,
  align = "start",
  tone = "primary",
  onCapture,
}: NavListProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const links = Array.from(
      event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[data-nav-link]"),
    );
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (index < 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      links[(index + 1) % links.length]?.focus();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      links[(index - 1 + links.length) % links.length]?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      links[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1]?.focus();
    }
  };

  return (
    <nav aria-label={ariaLabel} onKeyDown={onKeyDown}>
      <ul
        className={cn(
          "flex flex-col",
          align === "center" ? "items-center" : "items-start",
          variant === "hero" ? "gap-1.5" : "gap-0.5",
        )}
      >
        {items.map((item) => {
          const current = item.id === activeId;
          const ancestor = item.id === ancestorId;
          const selected = current || ancestor;
          return (
            <li key={item.id} className="min-w-0">
              <Link
                href={item.href}
                data-nav-link
                data-flip-id={`${flipPrefix}-${item.id}`}
                aria-current={current ? "page" : ancestor ? "true" : undefined}
                onClick={(event) => {
                  if (!isModifiedClick(event)) onCapture();
                }}
                className={cn(
                  "group relative inline-flex min-h-11 max-w-full cursor-pointer items-center gap-3.5 px-0.5 font-heading font-semibold uppercase no-underline transition-colors duration-300",
                  focusRing,
                  align === "center" && "justify-center",
                  variant === "hero" &&
                    "py-0.5 text-[length:var(--text-hero)] leading-[1.15] tracking-[0.02em] max-md:text-[clamp(1.15rem,4.6vw,1.4rem)]",
                  variant === "rail" &&
                    "text-[length:var(--text-rail)] leading-[1.2] tracking-[0.06em]",
                  tone === "sub" &&
                    "text-[length:var(--text-sub)] leading-[1.15] tracking-[0.04em] max-md:text-[0.92rem] max-md:tracking-[0.06em]",
                  selected
                    ? "text-accent hover:text-accent"
                    : "text-foreground hover:text-muted-foreground",
                )}
              >
                <span className="[overflow-wrap:break-word] [text-shadow:0_2px_18px_rgb(0_0_0_/_0.45)]">
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 bg-transparent transition-colors duration-200 group-hover:bg-accent",
                    selected && "bg-accent",
                    tone === "sub" && "max-md:hidden",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
