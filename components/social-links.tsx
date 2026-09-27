import { cn, focusRing } from "@/lib/cn";
import { SITE } from "@/lib/site";

const links = [
  {
    id: "instagram",
    label: "Instagram",
    href: SITE.instagram,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-[1em]"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    href: SITE.email,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-[1em]"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    href: SITE.telegram,
    icon: (
      <svg viewBox="0 0 24 24" className="size-[1em]" aria-hidden="true" fill="currentColor">
        <path d="M21.8 4.3 2.9 11.6c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.7.1.9.8.9.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.5c.3-1.4-.5-2-1.8-1.5Z" />
      </svg>
    ),
  },
] as const;

type SocialLinksProps = {
  align?: "start" | "center";
  variant?: "hero" | "rail";
  className?: string;
};

export function SocialLinks({
  align = "start",
  variant = "rail",
  className,
}: SocialLinksProps) {
  return (
    <ul
      className={cn(
        "mt-2 flex items-center px-0.5",
        align === "center" ? "justify-center" : "justify-start",
        className,
      )}
      aria-label="Social"
    >
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            data-nav-link
            data-flip-id={`social-${link.id}`}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
            aria-label={link.label}
            className={cn(
              "inline-flex items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-accent",
              focusRing,
              variant === "hero" && "size-12 text-[1.55rem]",
              variant === "rail" && "size-10 text-[1.25rem]",
            )}
          >
            {link.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
