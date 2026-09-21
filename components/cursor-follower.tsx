"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const DOTS = 10;

export function CursorFollower() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!fine.matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-cursor-dot]"));
    const points = nodes.map(() => ({ x: -80, y: -80 }));
    const mouse = { x: -80, y: -80 };
    let vis = 0;
    let hovering = false;
    let active = false;
    let raf = 0;

    const tick = () => {
      vis += ((active ? 1 : 0) - vis) * (active ? 0.14 : 0.22);

      points[0]!.x += (mouse.x - points[0]!.x) * 0.42;
      points[0]!.y += (mouse.y - points[0]!.y) * 0.42;

      for (let i = 1; i < points.length; i += 1) {
        const ease = 0.22 - i * 0.008;
        points[i]!.x += (points[i - 1]!.x - points[i]!.x) * ease;
        points[i]!.y += (points[i - 1]!.y - points[i]!.y) * ease;
      }

      nodes.forEach((node, index) => {
        const point = points[index]!;
        const hover = hovering && index < 2 ? 1.35 : 1;
        node.style.opacity = String(vis * (1 - index * 0.07));
        node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${hover})`;
      });

      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      active = true;
      const target = event.target;
      hovering = target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, label"));
    };

    const hide = () => {
      active = false;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[80] hidden mix-blend-difference md:block"
      aria-hidden="true"
    >
      {Array.from({ length: DOTS }, (_, index) => (
        <span
          key={index}
          data-cursor-dot
          className="absolute top-0 left-0 rounded-full bg-foreground will-change-transform"
          style={{
            width: `${Math.max(5, 12 - index * 0.7)}px`,
            height: `${Math.max(5, 12 - index * 0.7)}px`,
            boxShadow: index === 0 ? "0 0 16px 4px rgb(250 250 250 / 0.5)" : "0 0 8px 1px rgb(250 250 250 / 0.2)",
          }}
        />
      ))}
    </div>
  );
}
