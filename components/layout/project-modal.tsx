"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useId, useRef } from "react";
import { cn, focusRing, primaryButton } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
};

export function ProjectModal({ open, onClose, onStart }: ProjectModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => startRef.current?.focus());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey, true);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;
      if (reduced) {
        gsap.set(panelRef.current, { clearProps: "all" });
        return;
      }
      const pieces = panelRef.current.querySelectorAll<HTMLElement>("[data-modal-piece]");
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 28, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" },
      );
      gsap.fromTo(
        pieces,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.08,
        },
      );
    },
    { dependencies: [open, reduced] },
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5 max-md:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(20_20_20_/_0.55),rgb(0_0_0_/_0.88))]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-[440px] overflow-hidden bg-[linear-gradient(165deg,rgb(18_18_18)_0%,rgb(8_8_8)_55%,rgb(4_4_4)_100%)] px-9 py-10 max-md:px-6 max-md:py-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
        />

        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute end-2 top-2 inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
            focusRing,
          )}
          aria-label="Close"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>

        <p
          data-modal-piece
          className="text-[length:var(--text-label)] uppercase tracking-[0.18em] text-accent"
        >
          Hans Pixel
        </p>
        <h2
          data-modal-piece
          id={titleId}
          className="mt-4 max-w-[14ch] font-heading text-[clamp(1.7rem,4vw,2.15rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground text-balance"
        >
          Have a project in mind?
        </h2>
        <p
          data-modal-piece
          id={descId}
          className="mt-4 max-w-[34ch] text-[length:var(--text-lead)] leading-[1.65] text-muted-foreground"
        >
          Send us the files. Tell us what you need. We’ll take it from there.
        </p>

        <div data-modal-piece className="mt-8 flex flex-wrap items-center gap-4">
          <button
            ref={startRef}
            type="button"
            onClick={onStart}
            className={cn(primaryButton, focusRing, "gap-2.5 px-5")}
          >
            Start a project
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex min-h-11 items-center text-[length:var(--text-label)] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground",
              focusRing,
            )}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
