"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ContentPanel } from "@/components/layout/content-panel";
import { CursorFollower } from "@/components/layout/cursor-follower";
import { MotionBackground, sceneFromPath } from "@/components/layout/motion-background";
import { NavList } from "@/components/layout/nav-list";
import { ProjectModal } from "@/components/layout/project-modal";
import { SkipLink } from "@/components/layout/skip-link";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useRouteGuards } from "@/hooks/use-route-guards";
import { useStageMotion } from "@/hooks/use-stage-motion";
import { cn, focusRing } from "@/lib/cn";
import { ACCOUNT, NAV, SITE, accountLabel, accountMenu, activeContent, parentHref, resolveRoute } from "@/lib/site";
import { useSession } from "@/providers/session-provider";
import type { NavNode, PageContent } from "@/types/site";

function BrandLogo() {
  return (
    <Image
      src="/logo-pixel.png"
      alt={SITE.name}
      width={1200}
      height={171}
      priority
      unoptimized
      className="h-7 w-auto max-w-[min(240px,46vw)] [image-rendering:pixelated] max-md:h-7"
    />
  );
}

const openingAccount: PageContent = {
  title: "Loading your account.",
  lead: "",
  pending: true,
  blocks: [],
};

export function Stage() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const { user, status, logout } = useSession();
  const route = resolveRoute(pathname);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const section = route.section;
  const item = route.item;
  const accountSection = section?.id === "account";
  const submenuItems = accountSection ? (user ? accountMenu() : []) : (section?.children ?? []);
  const hasSubmenu = submenuItems.length > 0;
  const page = activeContent(route);
  const content: PageContent | null =
    accountSection && status === "loading"
      ? openingAccount
      : accountSection && user && !item
        ? null
        : accountSection && !user && item
          ? (ACCOUNT.content ?? null)
          : page;
  const viewportCenter = content?.layout === "viewport-center" && !hasSubmenu;
  const mode = route.depth === 0 ? "home" : content ? "leaf" : "branch";
  const scene = sceneFromPath(pathname);

  useRouteGuards(route);
  const { contentRef, captureFlip } = useStageMotion({
    pathname,
    reduced,
    content,
    route,
    projectModalOpen,
  });

  const openProjectModal = useCallback(() => {
    setProjectModalOpen(true);
  }, [setProjectModalOpen]);

  const closeProjectModal = useCallback(() => {
    setProjectModalOpen(false);
  }, [setProjectModalOpen]);

  const startProject = useCallback(() => {
    setProjectModalOpen(false);
  }, [setProjectModalOpen]);

  const onPrimaryItemClick = useCallback(
    (navItem: NavNode) => {
      if (navItem.id !== "hans-pixel") return false;
      openProjectModal();
      if (pathname !== "/hans-pixel") {
        captureFlip();
        router.push("/hans-pixel");
      }
      return true;
    },
    [captureFlip, openProjectModal, pathname, router],
  );

  const onAccountItemClick = useCallback(
    (navItem: NavNode) => {
      if (navItem.id !== "account-sign-out") return false;
      void logout().then(() => router.replace("/account"));
      return true;
    },
    [logout, router],
  );

  const hidePrimaryOnNarrow = mode !== "home";

  return (
    <div className="relative isolate grid h-dvh grid-rows-[auto_1fr_auto] p-[max(1rem,env(safe-area-inset-top))_max(1rem,env(safe-area-inset-right))_max(1rem,env(safe-area-inset-bottom))_max(1rem,env(safe-area-inset-left))] max-md:p-[max(12px,env(safe-area-inset-top))_max(12px,env(safe-area-inset-right))_max(12px,env(safe-area-inset-bottom))_max(12px,env(safe-area-inset-left))]">
      <SkipLink />
      <MotionBackground paused={false} scene={scene} />
      <CursorFollower />

      <header className="relative z-20 grid min-h-11 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="justify-self-start">
          {hidePrimaryOnNarrow ? (
            <Link
              href={parentHref(route)}
              onClick={() => captureFlip()}
              className={cn(
                "hidden min-h-11 items-center gap-2 text-[length:var(--text-label)] uppercase tracking-[0.14em] text-muted-foreground no-underline hover:text-foreground max-lg:inline-flex",
                focusRing,
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Link>
          ) : null}
        </div>
        <Link
          href="/"
          onClick={() => captureFlip()}
          className={cn("inline-flex min-h-11 items-center justify-self-center text-foreground no-underline", focusRing)}
        >
          <BrandLogo />
        </Link>
      </header>

      <div
        className={cn(
          "relative z-10 grid min-h-0 w-full items-center overflow-auto",
          mode === "home" && "grid-cols-1 justify-items-center max-md:px-1 max-md:py-2",
          mode === "branch" && hasSubmenu && "grid-cols-[1fr_auto_1fr] max-lg:grid-cols-1",
          mode === "leaf" &&
            hasSubmenu &&
            "grid-cols-[auto_auto_minmax(0,1fr)] max-lg:grid-cols-[minmax(140px,34%)_minmax(0,1fr)] max-md:grid-cols-[minmax(104px,38%)_minmax(0,1fr)] max-md:gap-2.5",
          mode === "leaf" && !hasSubmenu && "grid-cols-[auto_minmax(0,1fr)] max-lg:grid-cols-1",
        )}
      >
        <div
          id={content || hasSubmenu ? undefined : "main"}
          data-flip-id="rail-primary"
          className={cn(
            "relative z-20 flex min-h-0 min-w-0 flex-col",
            mode === "home" && "w-full max-w-md items-center",
            mode !== "home" && "w-max max-w-[min(240px,32vw)] items-start justify-self-start self-center ps-2 md:ps-7",
            hidePrimaryOnNarrow && "max-lg:hidden",
          )}
        >
          <NavList
            items={NAV.map((node) => (node.id === "account" && user ? { ...node, label: accountLabel(user) } : node))}
            activeId={item ? null : (section?.id ?? null)}
            ancestorId={item ? (section?.id ?? null) : null}
            flipPrefix="nav"
            ariaLabel="Primary"
            variant={mode === "home" ? "hero" : "rail"}
            align={mode === "home" ? "center" : "start"}
            onCapture={captureFlip}
            onItemClick={onPrimaryItemClick}
          />
        </div>

        {hasSubmenu ? (
          <div
            id={content ? undefined : "main"}
            data-flip-id="rail-sub"
            className={cn(
              "relative z-20 flex min-h-0 min-w-0 w-max max-w-[min(280px,36vw)] flex-col justify-center self-center px-3 md:px-7 max-lg:max-w-none max-lg:w-auto max-lg:px-1",
              mode === "branch" && "justify-self-center",
              mode === "leaf" && "justify-self-start max-md:px-1",
            )}
          >
            <NavList
              items={submenuItems}
              activeId={item?.id ?? null}
              flipPrefix={`sub-${section!.id}`}
              ariaLabel={`${user ? accountLabel(user) : section!.label} submenu`}
              variant="rail"
              tone="sub"
              onCapture={captureFlip}
              onItemClick={accountSection ? onAccountItemClick : undefined}
            />
          </div>
        ) : null}

        {content ? (
          <main
            id="main"
            ref={contentRef}
            tabIndex={-1}
            className={cn(
              "flex min-h-0 min-w-0 max-h-full flex-col overflow-auto",
              viewportCenter
                ? "absolute inset-0 z-[5] items-center justify-center px-4 py-6 pointer-events-none"
                : cn(
                    "w-full self-stretch px-2 py-1 md:px-7 max-md:px-1 max-md:pb-2",
                    accountSection || content.layout === "viewport-center"
                      ? "items-center justify-safe-center"
                      : "items-center justify-start max-md:items-stretch",
                  ),
            )}
          >
            <div className={cn(viewportCenter && "pointer-events-auto w-full max-w-[560px]", content.layout === "wide" && "w-full max-w-[1040px]")}>
              <ContentPanel key={pathname} content={content} serviceHref={item?.href ?? null} />
            </div>
          </main>
        ) : null}
      </div>

      <footer className="relative z-20 min-h-11" />
      <ProjectModal open={projectModalOpen} onClose={closeProjectModal} onStart={startProject} />
    </div>
  );
}
