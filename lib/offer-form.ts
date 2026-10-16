import type { ServiceOffer } from "@/types/site";

export type GroupValue = {
  choice: string;
  custom: string;
};

export type OfferFormState = {
  ndeOn: boolean;
  quantity: string;
  note: string;
  fields: Record<string, string>;
  groups: Record<string, GroupValue>;
};

export const initialOfferForm: OfferFormState = {
  ndeOn: false,
  quantity: "",
  note: "",
  fields: {},
  groups: {},
};

export type OfferFormAction =
  | { type: "nde"; value: boolean }
  | { type: "quantity"; value: string }
  | { type: "note"; value: string }
  | { type: "field"; label: string; value: string }
  | { type: "group"; label: string; value: GroupValue };

export function offerFormReducer(state: OfferFormState, action: OfferFormAction): OfferFormState {
  switch (action.type) {
    case "nde":
      return { ...state, ndeOn: action.value };
    case "quantity":
      return { ...state, quantity: action.value };
    case "note":
      return { ...state, note: action.value };
    case "field":
      return { ...state, fields: { ...state.fields, [action.label]: action.value } };
    case "group":
      return { ...state, groups: { ...state.groups, [action.label]: action.value } };
  }
}

export function groupValue(state: OfferFormState, label: string): GroupValue {
  return state.groups[label] ?? { choice: "", custom: "" };
}

export function buildOfferNote(offer: ServiceOffer, form: OfferFormState) {
  const lines: string[] = [];
  if (form.ndeOn && offer.ndeTitle) lines.push("NDE: yes (+25%)");
  if (offer.quantityLabel && form.quantity.trim()) lines.push(`${offer.quantityLabel}: ${form.quantity.trim()}`);
  for (const field of offer.fields ?? []) {
    const value = form.fields[field.label]?.trim();
    if (value) lines.push(`${field.label}: ${value}`);
  }
  for (const group of offer.groups ?? []) {
    const value = form.groups[group.label];
    if (!value?.choice) continue;
    const customName = group.custom?.label;
    if (customName && value.choice === customName) {
      const text = value.custom.trim();
      lines.push(`${group.label}: ${text ? `${customName}: ${text}` : customName}`);
    } else {
      lines.push(`${group.label}: ${value.choice}`);
    }
  }
  if (form.note.trim()) lines.push(form.note.trim());
  return lines.join("\n");
}
