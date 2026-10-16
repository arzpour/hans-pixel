import { ChevronDown } from "lucide-react";
import { cn, fieldControl, fieldLabel, focusRing } from "@/lib/cn";
import { groupValue, type OfferFormState } from "@/lib/offer-form";
import type { ServiceOffer } from "@/types/site";
import { sectionTitle } from "@/components/service/offer-styles";

export function OfferFields({
  id,
  offer,
  form,
  onNde,
  onQuantity,
  onField,
  onGroup,
}: {
  id: string;
  offer: ServiceOffer;
  form: OfferFormState;
  onNde: (value: boolean) => void;
  onQuantity: (value: string) => void;
  onField: (label: string, value: string) => void;
  onGroup: (label: string, choice: string, custom: string) => void;
}) {
  const noteId = `${id}-quantity-note`;
  const nde =
    offer.ndeTitle && offer.ndeDetail && offer.ndeFee
      ? { title: offer.ndeTitle, detail: offer.ndeDetail, fee: offer.ndeFee }
      : null;

  return (
    <>
      {nde ? (
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.ndeOn}
            onChange={(event) => onNde(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-accent"
          />
          <span className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-semibold uppercase tracking-[0.08em] text-foreground">{nde.title}</span>
              <span className="block text-sm leading-relaxed text-foreground">({nde.fee})</span>
            </div>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">({nde.detail})</span>
          </span>
        </label>
      ) : null}

      {offer.quantityLabel ? (
        <div className="flex flex-col gap-1.5">
          <input
            id={`${id}-quantity`}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={form.quantity}
            aria-describedby={offer.quantityNote ? noteId : undefined}
            placeholder={offer.quantityLabel}
            onChange={(event) => onQuantity(event.target.value)}
            className={cn(fieldControl, "w-28", focusRing)}
          />
          {offer.quantityNote ? (
            <p id={noteId} className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
              Note: {offer.quantityNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {offer.fields?.map((field, index) => {
        const fieldId = `${id}-field-${index}`;
        const hintId = `${fieldId}-hint`;
        if (field.options?.length) {
          return (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label htmlFor={fieldId} className={fieldLabel}>
                {field.label}
              </label>
              {field.hint ? (
                <p id={hintId} className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                  {field.hint}
                </p>
              ) : null}
              <div className="relative max-w-md">
                <select
                  id={fieldId}
                  value={form.fields[field.label] ?? ""}
                  aria-describedby={field.hint ? hintId : undefined}
                  onChange={(event) => onField(field.label, event.target.value)}
                  className={cn(fieldControl, "cursor-pointer appearance-none pr-10", focusRing)}
                >
                  <option value="">Select a size</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        }
        return (
          <div key={field.label} className="flex flex-col gap-1.5">
            <input
              id={fieldId}
              type={field.kind === "number" ? "number" : "text"}
              inputMode={field.kind === "number" ? "numeric" : undefined}
              min={field.kind === "number" ? 1 : undefined}
              step={field.kind === "number" ? 1 : undefined}
              value={form.fields[field.label] ?? ""}
              aria-describedby={field.hint ? hintId : undefined}
              placeholder={field.label}
              onChange={(event) => onField(field.label, event.target.value)}
              className={cn(fieldControl, field.kind === "number" ? "w-28" : "max-w-md", focusRing)}
            />
            {field.hint ? (
              <p id={hintId} className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                {field.hint}
              </p>
            ) : null}
          </div>
        );
      })}

      {offer.groups?.length ? (
        <section className="flex max-w-md flex-col gap-3">
          <h2 className={sectionTitle}>Output</h2>
          {offer.groups.map((group, index) => {
            const value = groupValue(form, group.label);
            const selectId = `${id}-group-${index}`;
            const customId = `${selectId}-custom`;
            const customOpen = Boolean(group.custom && value.choice === group.custom.label);
            return (
              <div key={group.label} className="flex flex-col gap-1.5">
                <label htmlFor={selectId} className={fieldLabel}>
                  {group.label}
                </label>
                <div className="relative">
                  <select
                    id={selectId}
                    value={value.choice}
                    onChange={(event) => onGroup(group.label, event.target.value, value.custom)}
                    className={cn(fieldControl, "cursor-pointer appearance-none pr-10", focusRing)}
                  >
                    <option value="">Select</option>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    {group.custom ? <option value={group.custom.label}>{group.custom.label}</option> : null}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                {customOpen && group.custom ? (
                  <input
                    id={customId}
                    type="text"
                    value={value.custom}
                    placeholder={group.custom.placeholder}
                    aria-label={group.custom.placeholder}
                    onChange={(event) => onGroup(group.label, value.choice, event.target.value)}
                    className={cn(fieldControl, focusRing)}
                  />
                ) : null}
              </div>
            );
          })}
        </section>
      ) : null}
    </>
  );
}
