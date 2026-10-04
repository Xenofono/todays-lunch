import {normalizeWhitespace} from "@/lib/utils";

/**
 * Dishes travel from the scrapers to the UI as plain strings in one format:
 *
 *   "VECKANS FISK: Halstrad lax - Hollandaisesås, kokt potatis (155 kr)"
 *    └─ label ─┘  └─ name ──┘   └──── description ────┘    └ price ┘
 *
 * Every part is optional except the description. Scrapers build the string
 * with formatDish(); DishList takes it apart again with splitDish().
 */
export type DishParts = { label?: string, name?: string, text: string, price?: string };

const NAME_SEPARATOR = " - ";
// an all-caps category prefix, e.g. "VECKANS FISK: "
const LABEL = /^([A-ZÅÄÖÉÈÜ][A-ZÅÄÖÉÈÜ0-9\s&'’./-]{2,}):\s*/;
// a trailing parenthesised price: "(155 kr)", "(149:-)", "(165 SEK)", "(165)"
const PRICE = /\s*\((\d[\d\s]*(?:kr|sek|:-)?)\)\s*$/i;

/** "149:-" / "149" / "149 kr" -> "149 kr"; anything else is left as-is. */
export function formatPrice(raw: string): string {
    const price = normalizeWhitespace(raw).replace(/\s*:-$/, "");
    return /^\d[\d\s]*$/.test(price) ? `${price} kr` : price;
}

export function formatDish({label, name, text, price}: Partial<DishParts>): string {
    const body = [name, text].map(s => normalizeWhitespace(s ?? "")).filter(Boolean).join(NAME_SEPARATOR);
    const p = price && formatPrice(price);
    return `${label ? `${normalizeWhitespace(label).toUpperCase()}: ` : ""}${body}${p ? ` (${p})` : ""}`;
}

export function splitDish(item: string): DishParts {
    let text = normalizeWhitespace(item);

    const labelMatch = LABEL.exec(text);
    if (labelMatch) text = text.slice(labelMatch[0].length);

    const priceMatch = PRICE.exec(text);
    if (priceMatch) text = text.slice(0, priceMatch.index);

    const sep = text.indexOf(NAME_SEPARATOR);
    const name = sep > 0 ? text.slice(0, sep) : undefined;
    if (name) text = text.slice(sep + NAME_SEPARATOR.length);

    return {
        label: labelMatch?.[1],
        name,
        text,
        price: priceMatch ? formatPrice(priceMatch[1]) : undefined,
    };
}
