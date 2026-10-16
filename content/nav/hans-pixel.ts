import type { NavNode } from "@/types/site";

export const hansPixel: NavNode = {
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
}
