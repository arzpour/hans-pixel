import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn(
        "shrink-0 motion-safe:animate-spin motion-reduce:animate-none",
        className ?? "size-4",
      )}
      aria-hidden="true"
    />
  );
}
