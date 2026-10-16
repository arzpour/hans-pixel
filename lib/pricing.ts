export function unitPrice(price: string) {
  const match = price.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

export function formatDollars(amount: number) {
  return `${(Math.round(amount * 100) / 100).toFixed(2)}$`;
}

export function offerPayable(
  price: string,
  offer: { quantityLabel?: string; flatPrice?: boolean },
  quantity: string,
  ndeOn: boolean,
) {
  const each = unitPrice(price);
  const text = quantity.trim();
  const photoCount = Math.floor(Number(text));
  const quantityReady = text !== "" && Number.isFinite(photoCount) && photoCount > 0;
  if (!offer.quantityLabel) return offer.flatPrice ? each : null;
  if (each == null || !quantityReady) return null;
  return each * photoCount * (ndeOn ? 1.25 : 1);
}
