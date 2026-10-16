import type { NavNode } from "@/types/site";
import { service } from "@/content/pages";

export const web: NavNode = {
  id: "web",
  label: "Web Design",
  href: "/web",
  index: "05",
  content: service(
    undefined,
    "Any site. Designed and built.",
    "Tell us the site you need. It can be a single page, a shop, a booking desk, a web app, or something that does not fit a list. We design it, code it, or both, and confirm the price from your brief before the work begins.",
    {
      beforeLabel: "Brief",
      afterLabel: "Site",
      price: "Quoted from the brief",
      time: "From 5 days",
      offer: {
        services: ["Structure", "Visual design", "Front-end code", "Mobile layout", "Forms and accounts", "Handover"],
        priceNote:
          "There is no fixed rate, because the sites are not the same. Send the type, the pages, and what the site has to do. We reply with the price and the time before any work starts.",
        noteBeforeUploads: true,
        noteLabel: "Describe the site",
        noteHint: "What it is for, who uses it, what each page must do, and anything that must be possible to update later.",
        fields: [
          {
            label: "Number of pages",
            hint: "Count every page in this version. Home counts as one. If you are not sure yet, leave this blank and describe the site below.",
            kind: "number",
          },
          {
            label: "Current address",
            hint: "If this replaces a site you already have, paste the address.",
          },
        ],
        groups: [
          {
            label: "Site",
            options: [
              "Landing page",
              "Portfolio",
              "Business",
              "Shop",
              "Blog",
              "Booking",
              "Web app",
              "Redesign of a current site",
            ],
            custom: { label: "Another kind of site", placeholder: "What kind of site" },
          },
          {
            label: "Work",
            options: ["Design", "Design and code", "Code from a design I have"],
          },
          {
            label: "Style",
            options: ["Quiet", "Editorial", "Bold", "Match my reference"],
            custom: { label: "Custom", placeholder: "Describe the style" },
          },
        ],
        uploads: [
          { id: "references", label: "Upload references", tag: "References", accept: "image/*,.pdf" },
          { id: "assets", label: "Upload assets", tag: "Assets", accept: "image/*,.pdf,.zip" },
        ],
      },
    },
  ),
};
