import { cn, fieldControl, focusRing } from "@/lib/cn";

export function NoteField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        placeholder={label}
        className={cn(fieldControl, "min-h-[5.5rem] resize-none", focusRing)}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
