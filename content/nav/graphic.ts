import type { NavNode } from "@/types/site";
import { comingSoon } from "@/content/pages";

export const graphic: NavNode = {
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
}
