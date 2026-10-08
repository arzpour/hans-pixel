import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { Stage } from "@/components/layout/stage";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { SessionProvider } from "@/providers/session-provider";
import { SITE } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black",
  },
  icons: {
    icon: [
      { url: "/hans-pixel-mark.png?v=hp-mark-1", type: "image/png", sizes: "64x64" },
      { url: "/hans-pixel-mark.svg?v=hp-mark-1", type: "image/svg+xml" },
    ],
    apple: { url: "/hans-pixel-mark-180.png?v=hp-mark-1", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-background font-sans text-foreground">
        <SessionProvider>
          {children}
          <Stage />
          <ServiceWorkerRegister />
        </SessionProvider>
      </body>
    </html>
  );
}
