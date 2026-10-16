import { account } from "@/content/nav/account";
import { ai } from "@/content/nav/ai";
import { graphic } from "@/content/nav/graphic";
import { hansPixel } from "@/content/nav/hans-pixel";
import { membership } from "@/content/nav/membership";
import { photo } from "@/content/nav/photo";
import { tools } from "@/content/nav/tools";
import { video } from "@/content/nav/video";
import { web } from "@/content/nav/web";
import type { NavNode, PageContent, ResolvedRoute } from "@/types/site";

export const SITE = {
  name: "Hans Pixel",
  tagline: "Photo. Video. Graphic. Shop.",
  description:
    "Hans Pixel edits photographs, films, and graphic work — with packages, presets, and a studio shop.",
  telegram: "https://t.me/hanspixel",
  instagram: "https://www.instagram.com/hans.pixel?stkn=MWxnYzFiNHA5YWVzNw==",
  email: "mailto:hello@hanspixel.com",
};

export const NAV: NavNode[] = [hansPixel, photo, video, ai, web, graphic, tools, membership, account];

export const ACCOUNT: NavNode = NAV[NAV.length - 1]!;

export function accountLabel(user: { name: string | null; email: string }) {
  const name = user.name?.trim();
  if (name) return name;
  const local = user.email.split("@")[0]?.trim();
  return local || "Account";
}

export function serviceTitle(href: string) {
  const clean = href === "/" ? "/" : href.replace(/\/$/, "");
  for (const section of NAV) {
    if (section.href === clean) return section.label;
    for (const child of section.children ?? []) {
      if (child.href === clean) return `${section.label} · ${child.label}`;
    }
  }
  return clean || "Order";
}

export function accountMenu(): NavNode[] {
  return [
    ...(ACCOUNT.children ?? []),
    // {
    //   id: "account-sign-out",
    //   label: "Sign out",
    //   href: "/account",
    //   index: "04",
    // },
  ];
}

export function resolveRoute(pathname: string): ResolvedRoute {
  const clean = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  if (clean === "/") {
    return { pathname: "/", section: null, item: null, depth: 0 };
  }

  if (clean === ACCOUNT.href) {
    return { pathname: clean, section: ACCOUNT, item: null, depth: 1 };
  }

  for (const section of NAV) {
    if (clean === section.href) {
      return { pathname: clean, section, item: null, depth: 1 };
    }

    if (section.children) {
      for (const child of section.children) {
        if (clean === child.href) {
          return { pathname: clean, section, item: child, depth: 2 };
        }
      }
    }
  }

  return { pathname: clean, section: null, item: null, depth: 0 };
}

export function isOrderablePath(pathname: string): boolean {
  const route = resolveRoute(pathname);
  return Boolean(route.item?.content?.blocks.some((block) => block.type === "service"));
}

export function isValidPath(pathname: string): boolean {
  const clean = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  if (clean === "/") return true;
  return getAllHrefs().includes(clean);
}

export function getAllHrefs(): string[] {
  const hrefs = ["/", ACCOUNT.href];
  for (const section of NAV) {
    hrefs.push(section.href);
    section.children?.forEach((child) => hrefs.push(child.href));
  }
  return hrefs;
}

export function getAllSlugs(): string[][] {
  return getAllHrefs()
    .filter((href) => href !== "/")
    .map((href) => href.split("/").filter(Boolean));
}

export function parentHref(route: ResolvedRoute): string {
  if (route.depth === 2 && route.section) return route.section.href;
  return "/";
}

export function getPageMeta(pathname: string): { title: string; description: string } | null {
  const route = resolveRoute(pathname);
  if (!isValidPath(pathname) && pathname !== "/") return null;

  if (route.item?.content) {
    return {
      title: `${route.item.label} — ${SITE.name}`,
      description: route.item.content.lead || "",
    };
  }

  if (route.section?.content) {
    return {
      title: `${route.section.label} — ${SITE.name}`,
      description: route.section.content.lead || "",
    };
  }

  if (route.section) {
    return {
      title: `${route.section.label} — ${SITE.name}`,
      description: route.section.kicker || "",
    };
  }

  return {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  };
}

export function activeContent(route: ResolvedRoute): PageContent | null {
  if (route.item?.content) return route.item.content;
  if (route.section?.id === "account" && !route.item) return route.section.content ?? null;
  if (route.section?.content && !route.section.children) return route.section.content;
  return null;
}
