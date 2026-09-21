export type ServiceBrief = {
  describe: string;
  beforeLabel: string;
  afterLabel: string;
  price: string;
  time: string;
  days?: string;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "cases"; items: { title: string; meta: string; year: string; blurb: string }[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "service"; brief: ServiceBrief }
  | { type: "shop"; items: { title: string; price: string; days: string; blurb: string }[] }
  | { type: "auth" }
  | { type: "contact" };

export type PageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  blocks: ContentBlock[];
};

export type NavNode = {
  id: string;
  label: string;
  href: string;
  index: string;
  kicker?: string;
  content?: PageContent;
  children?: NavNode[];
};

export const SITE = {
  name: "Hans Pixel",
  tagline: "Photo. Video. Graphic. Shop.",
  description:
    "Hans Pixel edits photographs, films, and graphic work — with packages, presets, and a studio shop.",
  telegram: "https://t.me/hanspixel",
  telegramLabel: "تلگرام با ما",
};

function service(
  eyebrow: string,
  title: string,
  lead: string,
  brief: ServiceBrief,
  extras: string[] = [],
): PageContent {
  return {
    eyebrow,
    title,
    lead,
    blocks: [
      { type: "service", brief },
      ...(extras.length ? [{ type: "list" as const, items: extras }] : []),
    ],
  };
}

export const NAV: NavNode[] = [
  {
    id: "hans-pixel",
    label: "Hans Pixel",
    href: "/hans-pixel",
    index: "01",
    // kicker: "Studio", 
    children: [
      {
        id: "about",
        label: "About",
        href: "/hans-pixel/about",
        index: "01",
        // kicker: "Studio", 
        content: {
          eyebrow: "Hans Pixel / About",
          title: "A studio for stills, cuts, and marks.",
          lead: "We retouch photographs, edit film, and design graphics — then pack the work as presets, prints, and delivery kits.",
          blocks: [
            {
              type: "paragraph",
              text: "Hans Pixel is a small editing room. You send the file. We return a finished frame, a timeline, or a set you can sell.",
            },
            {
              type: "stats",
              items: [
                { value: "48h", label: "Typical turn" },
                { value: "RAW", label: "In" },
                { value: "Print", label: "Out" },
              ],
            },
          ],
        },
      },
      {
        id: "portfolio",
        label: "Portfolio",
        href: "/hans-pixel/portfolio",
        index: "02",
        // kicker: "Frames",
        content: {
          eyebrow: "Hans Pixel / Portfolio",
          title: "Before the client name, the picture.",
          lead: "A short index of recent photo, video, and graphic jobs.",
          blocks: [
            {
              type: "cases",
              items: [
                {
                  title: "North Glass",
                  meta: "Photo retouch",
                  year: "2026",
                  blurb: "Catalog stills: color, skin, and product edges for a glassware launch.",
                },
                {
                  title: "Redline Cut",
                  meta: "Video edit",
                  year: "2025",
                  blurb: "A 45-second brand cut with titles, grade, and sound bed.",
                },
                {
                  title: "Velvet Grid",
                  meta: "Graphic design",
                  year: "2025",
                  blurb: "Poster system and social set for an exhibition week.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "how-it-works",
        label: "How it works",
        href: "/hans-pixel/how-it-works",
        index: "03",
        // kicker: "Flow",
        content: {
          eyebrow: "Hans Pixel / How it works",
          title: "Pick a desk. Upload. We cut.",
          lead: "Every job follows the same path so you always know where the file sits.",
          blocks: [
            {
              type: "list",
              items: [
                "Choose Photo, Video, Graphic, Shop, or Package",
                "Open the service — read describe, price, and time",
                "Upload the file or drop a brief",
                "We return a preview, then the final set",
              ],
            },
          ],
        },
      },
      {
        id: "social",
        label: "Social media",
        href: "/hans-pixel/social",
        index: "04",
        // kicker: "Channels",
        content: {
          eyebrow: "Hans Pixel / Social",
          title: "The studio on air.",
          lead: "Short cuts, retouch reels, and preset drops. Telegram is the fastest line.",
          blocks: [
            {
              type: "list",
              items: [
                "Telegram — briefs and file drop",
                "Instagram — before / after frames",
                "YouTube — grade and cut process",
              ],
            },
            { type: "contact" },
          ],
        },
      },
    ],
  },
  {
    id: "photo",
    label: "Photo Edit",
    href: "/photo",
    index: "02",
    // kicker: "Stills",
    children: [
      {
        id: "ps-basic",
        label: "PS Basic",
        href: "/photo/ps-basic",
        index: "01",
        // kicker: "Clean",
        content: service(
          "Photo / PS Basic",
          "A clean file. Honest color.",
          "Exposure, white balance, crop, and light skin work for portraits, catalogs, and events.",
          {
            describe: "Basic Photoshop pass: dust, color, crop. No heavy reshape. You keep the person.",
            beforeLabel: "RAW",
            afterLabel: "Basic",
            price: "From $18 / image",
            time: "24–48 hours",
            days: "2 days",
          },
          ["JPEG or TIFF return", "One revision"],
        ),
      },
      {
        id: "ps-pro",
        label: "PS Pro",
        href: "/photo/ps-pro",
        index: "02",
        // kicker: "Retouch",
        content: service(
          "Photo / PS Pro",
          "The frame, finished.",
          "Full retouch: frequency, dodge and burn, product edges, and print-ready files.",
          {
            describe: "Pro Photoshop: skin, fabric, glass, sky. Layered PSD on request.",
            beforeLabel: "SOOC",
            afterLabel: "Pro",
            price: "From $45 / image",
            time: "2–4 days",
            days: "4 days",
          },
        ),
      },
      {
        id: "creative",
        label: "Creative Edit",
        href: "/photo/creative",
        index: "03",
        // kicker: "Look",
        content: service(
          "Photo / Creative",
          "A look, not a filter.",
          "Directed color, grain, and light for campaigns that need a signature grade.",
          {
            describe: "Creative stills: custom grade, atmosphere, and a locked look for the set.",
            beforeLabel: "Neutral",
            afterLabel: "Look",
            price: "From $60 / image",
            time: "3–5 days",
            days: "5 days",
          },
        ),
      },
      {
        id: "manipulation",
        label: "Manipulation",
        href: "/photo/manipulation",
        index: "04",
        // kicker: "Composite",
        content: service(
          "Photo / Manipulation",
          "What was not in the camera.",
          "Composites, sky swaps, object removal, and built scenes from multiple plates.",
          {
            describe: "Manipulation: plates in, one picture out. We need the RAW set and a brief.",
            beforeLabel: "Plates",
            afterLabel: "Scene",
            price: "From $120 / image",
            time: "5–8 days",
            days: "8 days",
          },
        ),
      },
      {
        id: "album",
        label: "Album Design",
        href: "/photo/album",
        index: "05",
        // kicker: "Book",
        content: service(
          "Photo / Album",
          "A book that holds the day.",
          "Spread design, sequencing, and print files for wedding and family albums.",
          {
            describe: "Album: story order, type, and bleed-safe print PDFs. Cover included.",
            beforeLabel: "Selects",
            afterLabel: "Spreads",
            price: "From $280 / album",
            time: "7–14 days",
            days: "14 days",
          },
        ),
      },
      {
        id: "photo-social",
        label: "Social Media",
        href: "/photo/social",
        index: "06",
        // kicker: "Feed",
        content: service(
          "Photo / Social",
          "Stills that fit the grid.",
          "Crop, type, and a repeating look for posts, stories, and carousels.",
          {
            describe: "Social stills: ratio set, safe type, and a three-frame preview before the pack.",
            beforeLabel: "Master",
            afterLabel: "Feed",
            price: "From $12 / frame",
            time: "24 hours",
            days: "1 day",
          },
        ),
      },
      {
        id: "nos",
        label: "NOS",
        href: "/photo/nos",
        index: "07",
        kicker: "Film",
        content: service(
          "Photo / NOS",
          "New pictures, old stock.",
          "A nostalgic film pass — grain, halation, and faded primaries without crushing the file.",
          {
            describe: "NOS look: film curve, grain, and a gentle fade. Works on portraits and streets.",
            beforeLabel: "Digital",
            afterLabel: "NOS",
            price: "From $22 / image",
            time: "24–48 hours",
            days: "2 days",
          },
        ),
      },
    ],
  },
  {
    id: "video",
    label: "Video Edit",
    href: "/video",
    index: "03",
    kicker: "Timeline",
    children: [
      {
        id: "cut",
        label: "Cut",
        href: "/video/cut",
        index: "01",
        kicker: "Assembly",
        content: service(
          "Video / Cut",
          "The story, in order.",
          "Selects, pace, and a locked cut from your rushes.",
          {
            describe: "Offline cut from the card. We return a review link, then the timeline.",
            beforeLabel: "Rushes",
            afterLabel: "Cut",
            price: "From $180 / minute",
            time: "3–7 days",
            days: "7 days",
          },
        ),
      },
      {
        id: "color",
        label: "Color",
        href: "/video/color",
        index: "02",
        kicker: "Grade",
        content: service(
          "Video / Color",
          "One look across the reel.",
          "Primary and secondary grade, shot match, and delivery for Rec.709 or HDR.",
          {
            describe: "Color: match cameras, lock skin, add the look. LUT included if you want it.",
            beforeLabel: "Log",
            afterLabel: "Grade",
            price: "From $140 / minute",
            time: "2–5 days",
            days: "5 days",
          },
        ),
      },
      {
        id: "motion",
        label: "Motion",
        href: "/video/motion",
        index: "03",
        kicker: "Titles",
        content: service(
          "Video / Motion",
          "Type that arrives on the beat.",
          "Titles, lower thirds, and simple 2D motion for ads and openers.",
          {
            describe: "Motion titles on the locked cut. We need the font and the end card.",
            beforeLabel: "Picture",
            afterLabel: "Titles",
            price: "From $90 / piece",
            time: "2–4 days",
            days: "4 days",
          },
        ),
      },
      {
        id: "reels",
        label: "Reels",
        href: "/video/reels",
        index: "04",
        kicker: "Short",
        content: service(
          "Video / Reels",
          "Vertical, fast, finished.",
          "Cuts for Reels, Shorts, and Stories with captions and safe margins.",
          {
            describe: "Short-form: 9:16, captions, hook in the first second. Pack of three if you want.",
            beforeLabel: "Clip",
            afterLabel: "Reel",
            price: "From $70 / reel",
            time: "48 hours",
            days: "2 days",
          },
        ),
      },
    ],
  },
  {
    id: "ai",
    label: "AI Edit",
    href: "/ai",
    index: "03",
    kicker: "AI",
    children: [
      {
        id: "ai-edit",
        label: "AI Edit",
        href: "/ai/ai-edit",
        index: "01",
        kicker: "AI",
        content: service(
          "AI / AI Edit",
          "The story, in order.",
          "Selects, pace, and a locked cut from your rushes.",
          {
            describe: "Offline cut from the card. We return a review link, then the timeline.",
            beforeLabel: "Rushes",
            afterLabel: "Cut",
            price: "From $180 / minute",
            time: "3–7 days",
            days: "7 days",
          },
        ),
      },
     {
      id: "ai-photo",
      label: "AI Photo",
      href: "/ai/ai-photo",
      index: "01",
      kicker: "Photo",
      content: service(
        "AI / AI Photo",
        "The story, in order.",
        "Selects, pace, and a locked cut from your rushes.",
        {
          describe: "Offline cut from the card. We return a review link, then the timeline.",
          beforeLabel: "Rushes",
          afterLabel: "Cut",
          price: "From $180 / minute",
          time: "3–7 days",
          days: "7 days",
        },
      ),
     },
    ],
  },
  {
    id: "web",
    label: "Web Design",
    href: "/web",
    index: "04",
    kicker: "Web",
      children: [
        {
          id: "web-design",
          label: "Web Design",
          href: "/web/web-design",
          index: "01",
          kicker: "Web",
          content: service(
            "Web / Web Design",
            "The story, in order.",
            "Selects, pace, and a locked cut from your rushes.",
            {
              describe: "Web design: a modern, responsive website with a clean design and a focus on user experience.",
              beforeLabel: "Brief",
              afterLabel: "Design",
              price: "From $1,200",
              time: "10–16 days",
              days: "16 days",
            },
          ),
        },
        {
          id: "web-development",
          label: "Web Development",
          href: "/web/web-development",
          index: "01",
          kicker: "Web",
          content: service(
            "Web / Web Development",
            "The story, in order.",
            "Selects, pace, and a locked cut from your rushes.",
            {
              describe: "Web development: a modern, responsive website with a clean design and a focus on user experience.",
              beforeLabel: "Brief",
              afterLabel: "Development",
              price: "From $1,200",
              time: "5–7 days",
              days: "16 days",
            },
          ),
        },
      ],
  },
  {
    id: "graphic",
    label: "Graphic Design",
    href: "/graphic",
    index: "04",
    kicker: "Mark",
    children: [
      {
        id: "logo",
        label: "Logo",
        href: "/graphic/logo",
        index: "01",
        kicker: "Identity",
        content: service(
          "Graphic / Logo",
          "A mark that survives motion.",
          "Wordmark or symbol, with a small set of lockups for print and screen.",
          {
            describe: "Logo: three directions, one finish, SVG and PNG pack. Color on black and white.",
            beforeLabel: "Brief",
            afterLabel: "Mark",
            price: "From $420",
            time: "7–12 days",
            days: "12 days",
          },
        ),
      },
      {
        id: "poster",
        label: "Poster",
        href: "/graphic/poster",
        index: "02",
        kicker: "Print",
        content: service(
          "Graphic / Poster",
          "Type, image, one sheet.",
          "Event and campaign posters with print and social crops.",
          {
            describe: "Poster: A2/A3 print file plus a 4:5 feed crop. Two revisions.",
            beforeLabel: "Copy",
            afterLabel: "Sheet",
            price: "From $160",
            time: "3–6 days",
            days: "6 days",
          },
        ),
      },
      {
        id: "brand",
        label: "Brand",
        href: "/graphic/brand",
        index: "03",
        kicker: "System",
        content: service(
          "Graphic / Brand",
          "A kit the editor can use.",
          "Color, type, and a one-page guide so photo and video stay in the same room.",
          {
            describe: "Mini brand kit: palette, type, logo use, and a motion note for editors.",
            beforeLabel: "Assets",
            afterLabel: "Kit",
            price: "From $680",
            time: "10–16 days",
            days: "16 days",
          },
        ),
      },
      {
        id: "covers",
        label: "Covers",
        href: "/graphic/covers",
        index: "04",
        kicker: "Thumb",
        content: service(
          "Graphic / Covers",
          "The first frame people see.",
          "YouTube, album, and event covers with type that holds at a thumbnail.",
          {
            describe: "Cover set: master plus platform crops. We need the title and a still.",
            beforeLabel: "Still",
            afterLabel: "Cover",
            price: "From $75",
            time: "48 hours",
            days: "2 days",
          },
        ),
      },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    index: "05",
    kicker: "Store",
    children: [
      {
        id: "presets",
        label: "Presets",
        href: "/shop/presets",
        index: "01",
        kicker: "Lightroom",
        content: {
          eyebrow: "Shop / Presets",
          title: "Looks you can run on the set.",
          lead: "Lightroom and Camera Raw presets from the studio desk. One-click, then you finish.",
          blocks: [
            {
              type: "shop",
              items: [
                {
                  title: "NOS Pack",
                  price: "$29",
                  days: "Instant",
                  blurb: "Eight faded film curves for portraits and streets.",
                },
                {
                  title: "Night Market",
                  price: "$24",
                  days: "Instant",
                  blurb: "Red-black urban grade for tungsten and neon.",
                },
                {
                  title: "Glass Catalog",
                  price: "$19",
                  days: "Instant",
                  blurb: "Clean product color with tight whites.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "luts",
        label: "LUTs",
        href: "/shop/luts",
        index: "02",
        kicker: "Grade",
        content: {
          eyebrow: "Shop / LUTs",
          title: "The same look on the timeline.",
          lead: "Rec.709 LUTs matched to the photo packs, for editors who share a desk with stills.",
          blocks: [
            {
              type: "shop",
              items: [
                {
                  title: "Hans Rec.709",
                  price: "$39",
                  days: "Instant",
                  blurb: "Neutral studio LUT plus a warmer variant.",
                },
                {
                  title: "Safelight",
                  price: "$35",
                  days: "Instant",
                  blurb: "Darkroom red in the shadows, silver mids.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "prints",
        label: "Prints",
        href: "/shop/prints",
        index: "03",
        kicker: "Paper",
        content: {
          eyebrow: "Shop / Prints",
          title: "A still you can hold.",
          lead: "Signed studio prints from the portfolio. Ships in a flat pack.",
          blocks: [
            {
              type: "shop",
              items: [
                {
                  title: "A3 Giclée",
                  price: "$85",
                  days: "7 days",
                  blurb: "Archival paper, signed on the back.",
                },
                {
                  title: "Contact Sheet",
                  price: "$40",
                  days: "5 days",
                  blurb: "A 35mm-style sheet of a chosen set.",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "package",
    label: "Package",
    href: "/package",
    index: "06",
    kicker: "Bundles",
    children: [
      {
        id: "starter",
        label: "Starter",
        href: "/package/starter",
        index: "01",
        kicker: "Entry",
        content: service(
          "Package / Starter",
          "A first desk.",
          "Ten basic photo edits or two short reels — enough to see how we work.",
          {
            describe: "Starter bundle: pick stills or shorts. One look, one revision, seven days.",
            beforeLabel: "Files",
            afterLabel: "Set",
            price: "$160",
            time: "7 days",
            days: "7 days",
          },
        ),
      },
      {
        id: "studio",
        label: "Studio",
        href: "/package/studio",
        index: "02",
        kicker: "Month",
        content: service(
          "Package / Studio",
          "A month on the bench.",
          "A mixed queue of photo, graphic, and short video with a standing look.",
          {
            describe: "Studio month: 20 stills or equivalent video/graphic hours. Slack or Telegram.",
            beforeLabel: "Queue",
            afterLabel: "Month",
            price: "$980",
            time: "30 days",
            days: "30 days",
          },
        ),
      },
      {
        id: "campaign",
        label: "Campaign",
        href: "/package/campaign",
        index: "03",
        kicker: "Full",
        content: service(
          "Package / Campaign",
          "Stills, cut, and the poster.",
          "One launch: photo set, a short film, and the graphic kit that holds them.",
          {
            describe: "Campaign: retouch, grade, titles, and a poster. Kickoff call included.",
            beforeLabel: "Brief",
            afterLabel: "Launch",
            price: "From $2,400",
            time: "21–30 days",
            days: "30 days",
          },
        ),
      },
    ],
  },
  {
    id: "account",
    label: "Sign in / Sign up",
    href: "/account",
    index: "07",
    // kicker: "Member",
    content: {
      eyebrow: "Account",
      title: "Sign in to the desk.",
      lead: "Orders, uploads, and package status live here. Paste is allowed — use a password manager.",
      blocks: [{ type: "auth" }],
    },
  },
];

export const ACCOUNT: NavNode = NAV[NAV.length - 1]!;

export type ResolvedRoute = {
  pathname: string;
  section: NavNode | null;
  item: NavNode | null;
  depth: 0 | 1 | 2;
};

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
      description: route.item.content.lead,
    };
  }

  if (route.section?.content) {
    return {
      title: `${route.section.label} — ${SITE.name}`,
      description: route.section.content.lead,
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
  if (route.section?.content && !route.section.children) return route.section.content;
  return null;
}
