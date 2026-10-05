export function SkipLink() {
  return (
    <a
      href="#main"
      className="pointer-events-none absolute left-4 top-4 z-[1000] -translate-y-20 rounded-sm bg-foreground px-4 py-3 text-sm font-medium text-background opacity-0 outline-none transition-[transform,opacity] duration-200 focus:pointer-events-auto focus:translate-y-0 focus:opacity-100 focus:outline-2 focus:outline-offset-4 focus:outline-accent"
    >
      Skip to main content
    </a>
  );
}
