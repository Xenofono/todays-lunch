import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMatch(text: string, query: string): boolean {
    return query ? text.toLowerCase().includes(query.toLowerCase()) : false;
}

export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


/** Collapses runs of whitespace (incl. &nbsp; and PDF line noise) to single spaces. */
export function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, " ").trim();
}
