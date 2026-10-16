"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { parentHref } from "@/lib/site";
import type { PageContent, ResolvedRoute } from "@/types/site";

gsap.registerPlugin(Flip, useGSAP);

const FLIP_SELECTOR = "[data-flip-id]";
const FLIP_PROPS = "fontSize,letterSpacing,lineHeight,padding";

function flipElements() {
  return gsap.utils.toArray<HTMLElement>(FLIP_SELECTOR);
}

function resetFlipMotion() {
  const elements = flipElements();
  gsap.killTweensOf(elements);
  Flip.killFlipsOf(elements);
  gsap.set(elements, {
    clearProps: "transform,translate,x,y,top,left,width,height,position,opacity,visibility",
  });
}

function flipRootsOrLinks(elements: Element[]) {
  const roots = elements.filter((element) => element instanceof HTMLElement && element.dataset.flipId?.startsWith("rail-"));
  if (roots.length) return roots;
  return elements.filter((element) => element instanceof HTMLAnchorElement);
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;
}

export function useStageMotion({
  pathname,
  reduced,
  content,
  route,
  projectModalOpen,
}: {
  pathname: string;
  reduced: boolean;
  content: PageContent | null;
  route: ResolvedRoute;
  projectModalOpen: boolean;
}) {
  const router = useRouter();
  const pendingFlip = useRef<Flip.FlipState | null>(null);
  const introPlayed = useRef(false);
  const contentRef = useRef<HTMLElement>(null);

  const captureFlip = useCallback(() => {
    if (reduced) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    resetFlipMotion();
    pendingFlip.current = Flip.getState(flipElements(), { props: FLIP_PROPS });
  }, [reduced]);

  useEffect(() => {
    const onPop = () => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        resetFlipMotion();
        pendingFlip.current = Flip.getState(flipElements(), { props: FLIP_PROPS });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useLayoutEffect(() => {
    const state = pendingFlip.current;
    pendingFlip.current = null;

    if (!reduced && state) {
      Flip.from(state, {
        targets: flipElements(),
        duration: 1.05,
        ease: "power2.inOut",
        absolute: false,
        prune: true,
        scale: false,
        nested: true,
        props: FLIP_PROPS,
        absoluteOnLeave: true,
        overwrite: true,
        onEnter: (elements) => {
          const incoming = flipRootsOrLinks(elements);
          if (!incoming.length) return;
          gsap.fromTo(
            incoming,
            { autoAlpha: 0, x: 48 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.92,
              ease: "power2.out",
              stagger: incoming[0] instanceof HTMLAnchorElement ? 0.045 : 0,
              overwrite: true,
            },
          );
        },
        onLeave: (elements) => {
          const outgoing = flipRootsOrLinks(elements);
          if (!outgoing.length) return;
          gsap.to(outgoing, {
            autoAlpha: 0,
            x: -16,
            duration: 0.4,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }

    const panel = contentRef.current;
    if (!panel) return;

    const pieces = panel.querySelectorAll<HTMLElement>(".content-piece");
    gsap.killTweensOf([panel, pieces]);

    if (reduced) {
      gsap.set([panel, pieces], { clearProps: "all" });
      return;
    }

    gsap.fromTo(
      panel,
      { autoAlpha: 0, x: 72 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1.25,
        ease: "power2.out",
        delay: 0.16,
        overwrite: true,
      },
    );

    if (pieces.length) {
      gsap.fromTo(
        pieces,
        {
          autoAlpha: 0,
          x: 56,
          y: 10,
          scale: (_index, target) => ((target as HTMLElement).hasAttribute("data-content-media") ? 1.06 : 1),
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.15,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.28,
          overwrite: true,
          transformOrigin: "center center",
        },
      );
    }

    return () => {
      gsap.killTweensOf([panel, pieces]);
      gsap.set(panel, { autoAlpha: 1, x: 0 });
      if (pieces.length) gsap.set(pieces, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    };
  }, [pathname, reduced, content]);

  useGSAP(
    () => {
      if (reduced || introPlayed.current) return;
      introPlayed.current = true;
      gsap.from("a[data-nav-link]", {
        opacity: 0,
        y: 28,
        duration: 0.85,
        stagger: 0.06,
        ease: "expo.out",
      });
    },
    { dependencies: [reduced, pathname] },
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isTypingTarget(event.target)) return;
      if (projectModalOpen) return;
      if (route.depth === 0) return;
      event.preventDefault();
      captureFlip();
      router.push(parentHref(route));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [captureFlip, projectModalOpen, route, router]);

  return { contentRef, captureFlip };
}
