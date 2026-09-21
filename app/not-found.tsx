import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-20 flex h-dvh flex-col items-start justify-end p-8">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Lost frame
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        That path is not on this stage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center border border-border px-4 text-sm uppercase tracking-[0.16em] text-foreground hover:border-accent"
      >
        Return home
      </Link>
    </div>
  );
}
