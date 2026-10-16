import type { PageContent, ServiceBrief } from "@/types/site";

export function service(
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

export function comingSoon(
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
