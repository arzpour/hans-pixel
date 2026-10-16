import type { NavNode } from "@/types/site";
import { service } from "@/content/pages";

export const photo: NavNode = {
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
            flatPrice: true,
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
                hint: "Choose your preferred album size from the available options.",
                options: ["8*12 in", "10*10 in", "10*12 in", "12*12 in", "12*16 in", "14*14 in", "16*20 in"],
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
}
