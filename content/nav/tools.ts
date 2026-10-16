import type { NavNode } from "@/types/site";
import { comingSoon } from "@/content/pages";

export const tools: NavNode = {
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
}
