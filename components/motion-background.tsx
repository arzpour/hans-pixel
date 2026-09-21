"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Mote = {
  x: number;
  y: number;
  r: number;
  s: number;
  a: number;
};

type SceneId = "home" | "photo" | "video" | "graphic" | "shop" | "package";

const SCENES: { id: SceneId; src: string; alt: string }[] = [
  { id: "home", src: "/bg/home.jpg", alt: "Photography studio with cameras and lights" },
  { id: "photo", src: "/bg/photo.jpg", alt: "Camera on a studio set" },
  { id: "video", src: "/bg/video.jpg", alt: "Film camera and crew on a shoot" },
  { id: "graphic", src: "/bg/graphic.jpg", alt: "Graphic design workspace with color swatches" },
  { id: "shop", src: "/bg/shop.jpg", alt: "Printed photographs laid out for review" },
  { id: "package", src: "/bg/package.jpg", alt: "Desk with a creative project in progress" },
];

export function sceneFromPath(pathname: string): SceneId {
  if (pathname.startsWith("/photo")) return "photo";
  if (pathname.startsWith("/video")) return "video";
  if (pathname.startsWith("/graphic")) return "graphic";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/package")) return "package";
  return "home";
}

export function MotionBackground({
  paused,
  scene,
}: {
  paused: boolean;
  scene: SceneId;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const freeze = paused || reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motes: Mote[] = Array.from({ length: 36 }, () => ({
      x: 0.12 + Math.random() * 0.8,
      y: 0.08 + Math.random() * 0.7,
      r: Math.random() * 1.3 + 0.35,
      s: Math.random() * 0.1 + 0.03,
      a: Math.random() * 0.18 + 0.04,
    }));

    let frameId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const mote of motes) {
        if (!freeze) {
          mote.y -= mote.s * 0.08;
          mote.x += Math.sin(mote.y * 8) * 0.00025;
          if (mote.y < 0.04) {
            mote.y = 0.82;
            mote.x = 0.1 + Math.random() * 0.8;
          }
        }
        ctx.beginPath();
        ctx.globalAlpha = mote.a;
        ctx.fillStyle = "#FAFAFA";
        ctx.arc(mote.x * width, mote.y * height, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [freeze]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {SCENES.map((item) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-[900ms]",
            scene === item.id && "z-[1] opacity-100",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            className={cn(
              "size-full origin-center object-cover object-center",
              scene === item.id && !freeze
                ? "animate-kenburns will-change-transform"
                : "scale-[1.08]",
              freeze && "transform-none",
            )}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgb(0_0_0_/_0.82)_0%,rgb(0_0_0_/_0.58)_46%,rgb(0_0_0_/_0.76)_100%),linear-gradient(180deg,rgb(0_0_0_/_0.5)_0%,transparent_28%,rgb(0_0_0_/_0.72)_100%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 z-[3]" />
      <div className="grain absolute inset-0 z-[4] opacity-[0.08] mix-blend-overlay" />
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_42%,#000_100%)]" />
    </div>
  );
}
