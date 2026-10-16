import type { NavNode } from "@/types/site";
import { service } from "@/content/pages";

export const video: NavNode = {
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
          beforeLabel: "Rushes",
          afterLabel: "Cut",
          price: "35$ / minute",
          time: "72 hours",
          video: { poster: "/bg/video.jpg" },
          offer: {
            services: ["Cut & trimming", "Color correction", "Music synchronization", "Transition"],
            ndeTitle: "NDE",
            ndeDetail:
              "Fast, polished edits delivered the next day, keeping your workflow moving without compromising on quality.",
            ndeFee: "+ 25% additional fee",
            noteLabel: "Add your editing note",
            noteHint: "Tell us what you'd like to change or achieve with your film.",
            noteBeforeUploads: true,
            groups: [
              {
                label: "Size",
                options: ["Horizontal 16:9", "Vertical 9:16", "Square 1:1"],
                custom: { label: "Custom", placeholder: "Custom size" },
              },
              {
                label: "Resolution",
                options: ["Full HD 1920*1080", "4K UHD 3840*2160", "Match original footage"],
                custom: { label: "Custom resolution", placeholder: "Custom resolution" },
              },
              {
                label: "Duration",
                options: ["Under 30 seconds", "30-60 seconds", "1-2 minutes", "2-3 minutes", "3-5 minutes"],
              },
              {
                label: "Format",
                options: ["MP4 (H.264)", "MP4 (H.265 / HEVC)", "MOV"],
                custom: { label: "Custom", placeholder: "Custom format" },
              },
              {
                label: "Frame rate (fps)",
                options: ["24 fps", "25 fps", "30 fps", "50/60 fps"],
              },
              {
                label: "Music selection",
                options: [
                  "I'll provide the music",
                  "Editor selects suitable music",
                  "I'll provide the reference track",
                  "Multiple tracks / medley",
                ],
              },
            ],
            uploads: [
              { id: "movies", label: "Upload movies", tag: "Movies", accept: "video/*" },
              { id: "music", label: "Upload music", tag: "Music", accept: "audio/*" },
            ],
          },
        },
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
          beforeLabel: "Rushes",
          afterLabel: "Grade",
          price: "65$ / minute",
          time: "96 hours",
          video: { poster: "/bg/video.jpg" },
          offer: {
            services: [
              "Cut & trimming",
              "Color correction",
              "Music synchronization",
              "Transition",
              "Color grading",
              "Audio",
              "Speed ramping",
              "Title & text",
              "Story-driven",
            ],
            noteLabel: "Add your editing note",
            noteHint: "Tell us what you'd like to change or achieve with your film.",
            noteBeforeUploads: true,
            groups: [
              {
                label: "Size",
                options: ["Horizontal 16:9", "Vertical 9:16", "Square 1:1"],
                custom: { label: "Custom", placeholder: "Custom size" },
              },
              {
                label: "Resolution",
                options: ["Full HD 1920*1080", "4K UHD 3840*2160", "Match original footage"],
                custom: { label: "Custom resolution", placeholder: "Custom resolution" },
              },
              {
                label: "Duration",
                options: ["Under 30 seconds", "30-60 seconds", "1-2 minutes", "2-3 minutes", "3-5 minutes"],
              },
              {
                label: "Format",
                options: ["MP4 (H.264)", "MP4 (H.265 / HEVC)", "MOV"],
                custom: { label: "Custom", placeholder: "Custom format" },
              },
              {
                label: "Frame rate (fps)",
                options: ["24 fps", "25 fps", "30 fps", "50/60 fps"],
              },
              {
                label: "Editing style",
                options: [
                  "Clean & minimal",
                  "Cinematic",
                  "Emotional & romantic",
                  "Dynamic & energetic",
                  "Documentary",
                  "Creative / experimental",
                ],
              },
              {
                label: "Color grading style",
                options: [
                  "Natural & timeless",
                  "Warm & romantic",
                  "Moody & cinematic",
                  "Bright & airy",
                  "Vintage / film look / match reference video",
                ],
              },
              {
                label: "Music selection",
                options: [
                  "I'll provide the music",
                  "Editor selects suitable music",
                  "I'll provide the reference track",
                  "Multiple tracks / medley",
                ],
              },
              {
                label: "Audio editing",
                options: [
                  "Basic cleanup & music balance",
                  "Detailed audio mixing",
                  "Cinematic sound design",
                  "Preserve original audio / vows / speeches",
                ],
              },
              {
                label: "Slow motion & speed ramping",
                options: [
                  "No slow motion / speed ramping",
                  "Subtle slow motion",
                  "Speed ramping",
                  "As needed by the editor",
                ],
              },
            ],
            uploads: [
              { id: "movies", label: "Upload movies", tag: "Movies", accept: "video/*" },
              { id: "music", label: "Upload music", tag: "Music", accept: "audio/*" },
            ],
          },
        },
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
          beforeLabel: "Rushes",
          afterLabel: "Film",
          price: "105$ / minute",
          time: "A week",
          video: { poster: "/bg/video.jpg" },
          offer: {
            services: [
              "Cut & trimming",
              "Color correction",
              "Music synchronization",
              "Transition",
              "Color grading",
              "Audio",
              "Speed ramping",
              "Title & text",
              "Story-driven",
              "Motion graphics",
              "Creative direction",
              "Visual effects",
              "Sound effects",
            ],
            noteLabel: "Add your editing note",
            noteHint: "Tell us what you'd like to change or achieve with your film.",
            noteBeforeUploads: true,
            groups: [
              {
                label: "Size",
                options: ["Horizontal 16:9", "Vertical 9:16", "Square 1:1"],
                custom: { label: "Custom", placeholder: "Custom size" },
              },
              {
                label: "Resolution",
                options: ["Full HD 1920*1080", "4K UHD 3840*2160", "Match original footage"],
                custom: { label: "Custom resolution", placeholder: "Custom resolution" },
              },
              {
                label: "Duration",
                options: ["Under 30 seconds", "30-60 seconds", "1-2 minutes", "2-3 minutes", "3-5 minutes"],
              },
              {
                label: "Format",
                options: ["MP4 (H.264)", "MP4 (H.265 / HEVC)", "MOV"],
                custom: { label: "Custom", placeholder: "Custom format" },
              },
              {
                label: "Frame rate (fps)",
                options: ["24 fps", "25 fps", "30 fps", "50/60 fps"],
              },
              {
                label: "Editing style",
                options: [
                  "Clean & minimal",
                  "Cinematic",
                  "Emotional & romantic",
                  "Dynamic & energetic",
                  "Documentary",
                  "Creative / experimental",
                ],
              },
              {
                label: "Color grading style",
                options: [
                  "Natural & timeless",
                  "Warm & romantic",
                  "Moody & cinematic",
                  "Bright & airy",
                  "Vintage / film look / match reference video",
                ],
              },
              {
                label: "Music selection",
                options: [
                  "I'll provide the music",
                  "Editor selects suitable music",
                  "I'll provide the reference track",
                  "Multiple tracks / medley",
                ],
              },
              {
                label: "Audio editing",
                options: [
                  "Basic cleanup & music balance",
                  "Detailed audio mixing",
                  "Cinematic sound design",
                  "Preserve original audio / vows / speeches",
                ],
              },
              {
                label: "Slow motion & speed ramping",
                options: [
                  "No slow motion / speed ramping",
                  "Subtle slow motion",
                  "Speed ramping",
                  "As needed by the editor",
                ],
              },
            ],
            uploads: [
              { id: "movies", label: "Upload movies", tag: "Movies", accept: "video/*" },
              { id: "music", label: "Upload music", tag: "Music", accept: "audio/*" },
            ],
          },
        },
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
          beforeLabel: "Rushes",
          afterLabel: "Film",
          price: "150$ / 30 minutes",
          time: "A week",
          video: { poster: "/bg/video.jpg" },
          offer: {
            services: [
              "Story-driven cinematic editing",
              "Music & beat synchronization",
              "Speech, vows & sound design",
              "Cinematic color grading",
              "Speed ramping & slow motion",
              "Transitions & visual effects",
              "Multi-camera editing & stabilization",
              "Titles, highlights & emotional storytelling",
            ],
            noteLabel: "Add your editing note",
            noteHint: "Tell us what you'd like to change or achieve with your film.",
            noteBeforeUploads: true,
            groups: [
              {
                label: "Size",
                options: ["Horizontal 16:9", "Vertical 9:16", "Square 1:1"],
                custom: { label: "Custom", placeholder: "Custom size" },
              },
              {
                label: "Resolution",
                options: ["Full HD 1920*1080", "4K UHD 3840*2160", "Match original footage"],
                custom: { label: "Custom resolution", placeholder: "Custom resolution" },
              },
              {
                label: "Duration",
                options: ["30-60 minutes", "60-90 minutes", "90-120 minutes", "120-150 minutes"],
              },
              {
                label: "Format",
                options: ["MP4 (H.264)", "MP4 (H.265 / HEVC)", "MOV"],
                custom: { label: "Custom", placeholder: "Custom format" },
              },
              {
                label: "Frame rate (fps)",
                options: ["24 fps", "25 fps", "30 fps", "50/60 fps"],
              },
              {
                label: "Editing style",
                options: [
                  "Clean & minimal",
                  "Cinematic",
                  "Emotional & romantic",
                  "Dynamic & energetic",
                  "Documentary",
                  "Creative / experimental",
                ],
              },
              {
                label: "Color grading style",
                options: [
                  "Natural & timeless",
                  "Warm & romantic",
                  "Moody & cinematic",
                  "Bright & airy",
                  "Vintage / film look / match reference video",
                ],
              },
              {
                label: "Music selection",
                options: [
                  "I'll provide the music",
                  "Editor selects suitable music",
                  "I'll provide the reference track",
                  "Multiple tracks / medley",
                ],
              },
              {
                label: "Audio editing",
                options: [
                  "Basic cleanup & music balance",
                  "Detailed audio mixing",
                  "Cinematic sound design",
                  "Preserve original audio / vows / speeches",
                ],
              },
              {
                label: "Slow motion & speed ramping",
                options: [
                  "No slow motion / speed ramping",
                  "Subtle slow motion",
                  "Speed ramping",
                  "As needed by the editor",
                ],
              },
            ],
            uploads: [
              { id: "movies", label: "Upload movies", tag: "Movies", accept: "video/*" },
              { id: "music", label: "Upload music", tag: "Music", accept: "audio/*" },
            ],
          },
        },
      ),
    },
  ],
}
