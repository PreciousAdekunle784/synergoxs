/** Prices are stored as whole numbers in the smallest unit (kobo for NGN). */
const SYMBOLS: Record<string, string> = { NGN: "₦", GHS: "GH₵", KES: "KSh ", ZAR: "R", USD: "$" };

export function formatMoney(minor: number | null | undefined, currency = "NGN") {
  if (minor === null || minor === undefined || !Number.isFinite(minor)) return "—";
  const major = minor / 100;
  const whole = Number.isInteger(major);
  const n = major.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
  return `${SYMBOLS[currency] ?? `${currency} `}${n}`;
}

/** "150000" / "150,000.50" typed into a form → minor units, or null if it isn't a price. */
export function parseMajor(input: string): number | null {
  const v = input.replace(/[,\s₦$]/g, "");
  if (!/^\d{1,11}(\.\d{1,2})?$/.test(v)) return null;
  return Math.round(Number(v) * 100);
}

export const toMajorInput = (minor: number | null | undefined) =>
  minor === null || minor === undefined ? "" : String(minor / 100);

/** Share saved, as a whole percentage, for "save 33%" style labels. */
export function percentOff(total: number, price: number) {
  if (!total || price >= total) return 0;
  return Math.round(((total - price) / total) * 100);
}
