import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <h1 className="sr-only">
      {SITE.name}. {SITE.tagline}
    </h1>
  );
}
