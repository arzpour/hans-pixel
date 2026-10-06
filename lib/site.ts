import type {
  NavNode,
  PageContent,
  ResolvedRoute,
  ServiceBrief,
} from "@/types/site";

export const SITE = {
  name: "Hans Pixel",
  tagline: "Photo. Video. Graphic. Shop.",
  description:
    "Hans Pixel edits photographs, films, and graphic work — with packages, presets, and a studio shop.",
  telegram: "https://t.me/hanspixel",
  instagram: "https://www.instagram.com/hans.pixel?stkn=MWxnYzFiNHA5YWVzNw==",
  email: "mailto:hello@hanspixel.com",
};

function service(
  eyebrow?: string,
  title?: string,
  lead?: string,
  brief?: ServiceBrief,
  extras: string[] = [],
): PageContent {
  return {
    eyebrow: eyebrow || "",
    title: title || "",
    lead: lead || "",
    blocks: [
      {
        type: "service",
        brief: brief || {
          describe: "",
          beforeLabel: "",
          afterLabel: "",
          price: "",
          time: "",
        },
      },
      ...(extras.length ? [{ type: "list" as const, items: extras }] : []),
    ],
  };
}

function comingSoon(
  title = "Coming soon.",
  lead = "This desk is not open yet.",
  extras: string[] = [],
): PageContent {
  return {
    title,
    lead,
    layout: "viewport-center",
    blocks: extras.length ? [{ type: "list", items: extras }] : [],
  };
}

export const NAV: NavNode[] = [
  {
    id: "hans-pixel",
    label: "Hans Pixel",
    href: "/hans-pixel",
    index: "01",
    content: {
      title:
        "A visual post-production studio for images, film, and digital work.",
      lead: "We edit, refine, and shape visual content for photographers, filmmakers, brands, and creative teams.",
      blocks: [
        { type: "heading", text: "About Hans Pixel" },
        {
          type: "paragraph",
          text: "Hans Pixel is an independent visual post-production studio built around one simple idea: good visuals deserve thoughtful finishing.",
        },
        {
          type: "paragraph",
          text: "We work across photography, video, AI-assisted editing, and digital design — helping creative work become cleaner, stronger, and ready to be seen.",
        },
        {
          type: "paragraph",
          text: "Whether it's a single image, a full photo set, a campaign, or an ongoing creative workflow, we adapt our process to the project and its visual language.",
        },
        { type: "heading", text: "Our Approach" },
        {
          type: "paragraph",
          text: "Clean. Intentional. Consistent.",
        },
        {
          type: "paragraph",
          text: "We don't believe in one-size-fits-all editing. Every project has its own mood, purpose, and visual language. Our job is to understand that direction and build the final image around it.",
        },
        { type: "heading", text: "How It Works" },
        {
          type: "steps",
          items: [
            {
              index: "01",
              title: "Send",
              text: "Send us your files, references, and project details.",
            },
            {
              index: "02",
              title: "Define",
              text: "We review the material and align on the visual direction.",
            },
            {
              index: "03",
              title: "Edit",
              text: "Our team works through the project with a focus on detail, consistency, and finish.",
            },
            {
              index: "04",
              title: "Deliver",
              text: "You receive the final files, ready for publication, print, or your next creative step.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "photo",
    label: "Photo Edit",
    href: "/photo",
    index: "02",
    children: [
      {
        id: "lr-basic",
        label: "Lr Basic",
        href: "/photo/lr-basic",
        index: "01",
        content: service(
          // eyebrow
          undefined,
          // title
          "Clean, balanced, natural.",
          // lead
          "Simple and refined color correction made easy for photographers. Create clean, balanced, and natural-looking images with our Lightroom Basic service.",
          // brief
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "0.15$ / image",
            time: "Up to 1000 pictures / 72 hours",
            offer: {
              services: [
                "Culling",
                "Exposure balance",
                "Color adjustment",
                "Noise reduction",
              ],
              ndeTitle: "NDE",
              ndeDetail:
                "Fast, polished edits delivered the next day, keeping your workflow moving without compromising on quality.",
              ndeFee: "+ 25% additional fee",
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
            },
          },
        ),
      },
      {
        id: "lr-pro",
        label: "Lr Pro",
        href: "/photo/lr-pro",
        index: "02",
        content: service(
          undefined,
          "More depth. More polish.",
          "Go beyond basic color correction with a more refined Lightroom workflow. Enhance colors, recover details, refine tones, and add depth to create polished, professional-looking images.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "0.23$ / image",
            time: "Up to 600 pictures / 72 hours",
            offer: {
              services: [
                "Culling",
                "Brushing",
                "Lens correction",
                "Vignette",
                "Exposure balance",
                "Color adjustment",
                "Noise reduction",
              ],
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
            },
          },
        ),
      },
      {
        id: "ps-basic",
        label: "Ps Basic",
        href: "/photo/ps-basic",
        index: "03",
        content: service(
          undefined,
          "Natural. Polished. True.",
          "A clean and refined edit for images that need a natural, polished finish. Designed to enhance your photos while keeping their original look, feel, and character.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "3.2$ / image",
            time: "Up to 200 pictures / 72 hours",
            offer: {
              services: ["Color correction", "Retouch", "Body liquify"],
              ndeTitle: "NDE",
              ndeDetail:
                "Fast, polished edits delivered the next day, keeping your workflow moving without compromising on quality.",
              ndeFee: "+ 25% additional fee",
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
            },
          },
        ),
      },
      {
        id: "ps-pro",
        label: "Ps Pro",
        href: "/photo/ps-pro",
        index: "04",
        content: service(
          undefined,
          "Precision in every detail.",
          "For images that need a little more attention. Our advanced editing service brings precision, depth, and a polished finish to every detail, creating visuals that feel refined, balanced, and professional.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "24$ / image",
            time: "Up to 50 pictures / 72 hours",
            offer: {
              services: [
                "Color correction",
                "Retouch",
                "Body liquify",
                "Removal",
                "Color preset",
              ],
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
            },
          },
        ),
      },
      {
        id: "creative",
        label: "Creative Edit",
        href: "/photo/creative",
        index: "05",
        content: service(
          undefined,
          "Beyond the ordinary.",
          "Turn your vision into a finished visual. A high-end editing experience created for images that need an artistic touch, creative direction, and a little something beyond the ordinary.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "72$ / image",
            time: "Up to 20 pictures / 72 hours",
            offer: {
              services: [
                "Color correction",
                "Retouch",
                "Body liquify",
                "Professional removal",
                "Color preset",
                "Color grading",
                "Professional sky replacement",
              ],
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
            },
          },
        ),
      },
      {
        id: "manipulation",
        label: "Manipulation",
        href: "/photo/manipulation",
        index: "06",
        content: service(
          undefined,
          "What was not in the camera.",
          "Go beyond traditional editing with our Manipulation service. Combine advanced retouching, creative compositing, professional sky replacement, studio background creation, and typography to transform your ideas into striking, polished visuals.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "95$ / 2 hours edit",
            time: "",
            offer: {
              services: [
                "Color correction",
                "Retouch",
                "Body liquify",
                "Professional removal",
                "Color preset",
                "Color grading",
                "Professional sky replacement",
                "Professional add object (smoke, light ...)",
                "Add subject (things...)",
                "Studio background creations",
                "Manipulation typography",
              ],
              priceNote:
                "Our Manipulation service is priced based on the editing time required for each project. The base rate is $95 USD for up to 2 hours of editing. If your project requires additional time, the cost will increase accordingly based on the extra editing time. Each project is carefully reviewed to estimate the required editing time before the work begins.",
              noteLabel: "Add your editing notes",
              noteHint:
                "Tell us what you'd like to change or achieve with your image.",
            },
          },
        ),
      },
      {
        id: "album",
        label: "Album Design",
        href: "/photo/album",
        index: "07",
        content: service(
          undefined,
          "A story you can hold.",
          "Thoughtfully designed albums that turn your photographs into a timeless story. Every layout is created to complement your images and reflect your personal style.",
          {
            beforeLabel: "Before",
            afterLabel: "After",
            price: "4$ / image",
            time: "10 pages / 24 hours",
            offer: {
              services: [
                "Color correction",
                "Retouch",
                "Body liquify",
                "Removal",
                "Design",
              ],
              quantityLabel: "Number of photos",
              quantityNote:
                "If you submit fewer photos than the selected quantity, the remaining balance will be refunded to your wallet. If you submit more, we will randomly select the specified number of photos for editing.",
              fields: [
                {
                  label: "Number of Pages",
                  hint: "Enter the number of album pages you would like to design.",
                  kind: "number",
                },
                {
                  label: "Album Size",
                  hint: "Enter your preferred album size (e.g., 30 × 30 cm)",
                },
              ],
              noteLabel: "Add your editing notes",
              noteHint:
                "Tell us what you'd like to change or achieve with your image.",
            },
          },
        ),
      },
      // {
      //   id: "photo-social",
      //   label: "Social Media",
      //   href: "/photo/social",
      //   index: "08",
      //   content: service(
      //     undefined,
      //     "Stills that fit the grid.",
      //     "Ratio, color, retouch, layout, and type for posts and stories.",
      //     {
      //       // describe: "Social stills: aspect ratio, retouch, layout, and text. Preview before the pack.",
      //       beforeLabel: "Master",
      //       afterLabel: "Feed",
      //       price: "From $12 / frame",
      //       time: "24 hours",
      //       days: "1 day",
      //     },
      //     ["Aspect ratio", "Color correction", "Retouch", "Layout design", "Add text"],
      //   ),
      // },
      // {
      //   id: "nde",
      //   label: "NDE",
      //   href: "/photo/nde",
      //   index: "09",
      //   content: service(
      //     undefined,
      //     "Natural density, open shadows.",
      //     "An NDE pass for frames that need lift without a heavy grade.",
      //     {
      //       // describe: "NDE: exposure recovery, shadow detail, and a quiet natural finish.",
      //       beforeLabel: "Flat",
      //       afterLabel: "Open",
      //       price: "From $28 / image",
      //       time: "2–3 days",
      //       days: "3 days",
      //     },
      //     ["Exposure recovery", "Shadow detail", "Highlight control", "Natural color"],
      //   ),
      // },
    ],
  },
  {
    id: "video",
    label: "Video Edit",
    href: "/video",
    index: "03",
    children: [
      {
        id: "classic",
        label: "Classic",
        href: "/video/classic",
        index: "01",
        content: service(
          undefined,
          "Clean. Balanced. Ready to share.",
          "A clean and consistent visual treatment for your footage. We refine the overall look of your videos to create a smooth, balanced, and ready-to-share result.",
          {
            // describe: "Classic: cut and trim, color correction, music sync, and transitions.",
            beforeLabel: "Rushes",
            afterLabel: "Cut",
            price: "From $180 / minute",
            time: "3–7 days",
            days: "7 days",
          },
          [
            "Cut and trimming",
            "Color correction",
            "Music synchronization",
            "Transition",
          ],
        ),
      },
      {
        id: "cinematic",
        label: "Cinematic",
        href: "/video/cinematic",
        index: "02",
        content: service(
          undefined,
          "Depth, character, cinema.",
          "Take your footage to the next level with a more refined and cinematic finish. Every frame is carefully shaped to create a cohesive visual experience with depth and character.",
          {
            // describe: "Cinematic: locked picture, grade, sound, ramps, and captions.",
            beforeLabel: "Rushes",
            afterLabel: "Grade",
            price: "From $260 / minute",
            time: "5–10 days",
            days: "10 days",
          },
          [
            "Cut and trimming",
            "Color correction",
            "Music synchronization",
            "Transition",
            "Color grading",
            "Audio",
            "Speed ramping",
            "Caption",
            "Story-driven",
          ],
        ),
      },
      {
        id: "motion",
        label: "Motion",
        href: "/video/motion",
        index: "03",
        content: service(
          undefined,
          "Dynamic Visuals",
          "Bring your visuals to life with smooth motion, creative transitions, and a polished cinematic feel.",
          {
            // describe: "Motion: picture, grade, graphics, sound, and creative direction.",
            beforeLabel: "Rushes",
            afterLabel: "Film",
            price: "From $380 / minute",
            time: "7–14 days",
            days: "14 days",
          },
          [
            "Cut and trimming",
            "Color correction",
            "Music synchronization",
            "Transition",
            "Color grading",
            "Audio",
            "Speed ramping",
            "Caption",
            "Story-driven",
            "Motion graphic",
            "Creative direction",
            "Visual effect",
            "Sound effect",
          ],
        ),
      },
      {
        id: "full-film-wedding",
        label: "Full film wedding",
        href: "/video/full-film-wedding",
        index: "04",
        content: service(
          undefined,
          "Complete Story",
          "A complete wedding film crafted to preserve every emotion, detail, and unforgettable moment of the day.",
          {
            // describe: "Full film wedding: long-form edit from the card. Trailer optional.",
            beforeLabel: "Rushes",
            afterLabel: "Film",
            price: "From $1,200 / film",
            time: "14–28 days",
            days: "28 days",
          },
          [
            "Full-day story cut",
            "Color grading",
            "Music and sound",
            "Titles and end card",
            "Optional trailer",
          ],
        ),
      },
      {
        id: "video-nde",
        label: "NDE",
        href: "/video/nde",
        index: "05",
        content: service(
          undefined,
          "Open shadows on the timeline.",
          "An NDE grade pass for footage that needs lift without a heavy cinematic look.",
          {
            // describe: "Video NDE: exposure recovery, shadow detail, and a natural finish on the cut.",
            beforeLabel: "Flat",
            afterLabel: "Open",
            price: "From $120 / minute",
            time: "3–5 days",
            days: "5 days",
          },
          [
            "Exposure recovery",
            "Shadow detail",
            "Highlight control",
            "Natural grade",
          ],
        ),
      },
    ],
  },
  {
    id: "ai",
    label: "AI Edit",
    href: "/ai",
    index: "04",
    content: comingSoon(),
  },
  {
    id: "web",
    label: "Web Design",
    href: "/web",
    index: "05",
    content: comingSoon(),
  },
  {
    id: "graphic",
    label: "Graphic Design",
    href: "/graphic",
    index: "06",
    children: [
      {
        id: "brand",
        label: "Brand Identity",
        href: "/graphic/brand",
        index: "01",
        content: comingSoon(
          "Coming soon.",
          "Brand identity work is on the way.",
          [
            "Logo Design",
            "Color System",
            "Typography",
            "Brand Guidelines",
            "Custom Icons",
            "Pattern Design",
          ],
        ),
      },
      {
        id: "stationery",
        label: "Stationery Design",
        href: "/graphic/stationery",
        index: "02",
        content: comingSoon(
          "Coming soon.",
          "Stationery design work is on the way.",
          [
            "Business Cards",
            "Letterheads",
            "Envelopes",
            "Presentation Folders",
            "Notepads",
            "Employee ID Cards",
            "Email Signatures",
          ],
        ),
      },
      {
        id: "social",
        label: "Social Media",
        href: "/graphic/social",
        index: "03",
        content: comingSoon(
          "Coming soon.",
          "Social media design work is on the way.",
          [
            "Social Media Posts",
            "Carousels",
            "Stories",
            "Highlight Covers",
            "Social Media Templates",
          ],
        ),
      },
      {
        id: "print",
        label: "Marketing & Print",
        href: "/graphic/print",
        index: "04",
        content: comingSoon(
          "Coming soon.",
          "Marketing and print work is on the way.",
          [
            "Poster Design",
            "Banner Design",
            "Menu Design",
            "Catalog Design",
            "Packaging Design",
            "Print Design",
          ],
        ),
      },
      {
        id: "digital",
        label: "Digital",
        href: "/graphic/digital",
        index: "05",
        content: comingSoon(
          "Coming soon.",
          "Digital design work is on the way.",
          ["Website Design", "Web Banners", "Digital Templates"],
        ),
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    href: "/tools",
    index: "07",
    children: [
      {
        id: "tools-photo",
        label: "Photo",
        href: "/tools/photo",
        index: "01",
        content: comingSoon(
          "Coming soon.",
          "Photo assets for the still desk.",
          [
            "Color Presets",
            "Retouching Brushes",
            "Creative Assets",
            "Album PSD Templates",
          ],
        ),
      },
      {
        id: "tools-video",
        label: "Video",
        href: "/tools/video",
        index: "02",
        content: comingSoon("Coming soon.", "Video assets for the timeline.", [
          "LUTs",
          "SFX — Sound Effects",
          "VFX — Visual Effects",
          "Video Templates",
          "Music & Audio Assets",
        ]),
      },
      {
        id: "tools-graphic",
        label: "Graphic Design",
        href: "/tools/graphic",
        index: "03",
        content: comingSoon(
          "Coming soon.",
          "Graphic assets for the mark and the feed.",
          [
            "Social Media Templates",
            "Vector Assets",
            "Mockups",
            "Fonts & Typography",
            "Banners & Ads",
            "Icons",
            "Patterns",
            "Textures",
          ],
        ),
      },
    ],
  },
  {
    id: "membership",
    label: "Membership",
    href: "/membership",
    index: "08",
    content: {
      eyebrow: "Membership",
      title: "Credit for the work ahead.",
      lead: "Deposit the minimum for a term. Extra credit is added to your wallet. Anything left unused expires when the membership ends.",
      layout: "wide",
      blocks: [
        {
          type: "membership",
          plans: [
            {
              name: "Essential",
              term: "3 Months",
              deposit: "$500",
              bonus: "5%",
              credit: "$525",
              line: "Deposit $500 → Get $525 in Wallet Credit",
              expiry:
                "Your credit must be used within 3 months. Any unused balance will expire at the end of the membership period.",
            },
            {
              name: "Advanced",
              term: "6 Months",
              deposit: "$1,000",
              bonus: "10%",
              credit: "$1,100",
              line: "Deposit $1,000 → Get $1,100 in Wallet Credit",
              expiry:
                "Your credit must be used within 6 months. Any unused balance will expire at the end of the membership period.",
            },
            {
              name: "Elite",
              term: "12 Months",
              deposit: "$2,000",
              bonus: "15%",
              credit: "$2,300",
              line: "Deposit $2,000 → Get $2,300 in Wallet Credit",
              expiry:
                "Your credit must be used within 12 months. Any unused balance will expire at the end of the membership period.",
              featured: true,
            },
          ],
        },
      ],
    },
  },
  {
    id: "account",
    label: "Sign in / Sign up",
    href: "/account",
    index: "09",
    // kicker: "Member",
    content: {
      eyebrow: "Account",
      title: "Sign in to the desk.",
      lead: "We email a code. Open the link, and it is entered for you. No password.",
      blocks: [{ type: "auth" }],
    },
    children: [
      {
        id: "account-profile",
        label: "Profile",
        href: "/account/profile",
        index: "01",
        content: {
          eyebrow: "Account",
          title: "Your place on the desk.",
          lead: "The name and email on your orders.",
          blocks: [{ type: "profile" }],
        },
      },
      {
        id: "account-orders",
        label: "Orders",
        href: "/account/orders",
        index: "02",
        content: {
          eyebrow: "Account",
          title: "Your orders.",
          lead: "Who sent it, the service, the note, and the files.",
          blocks: [{ type: "orders" }],
        },
      },
      {
        id: "wallet",
        label: "Wallet",
        href: "/account/wallet",
        index: "03",
        content: {
          eyebrow: "Account",
          title: "Your wallet.",
          lead: "Coming soon.",
          blocks: [{ type: "wallet" }],
        },
      },
    ],
  },
];

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
  return Boolean(
    route.item?.content?.blocks.some((block) => block.type === "service"),
  );
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

export function getPageMeta(
  pathname: string,
): { title: string; description: string } | null {
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
  if (route.section?.id === "account" && !route.item)
    return route.section.content ?? null;
  if (route.section?.content && !route.section.children)
    return route.section.content;
  return null;
}
