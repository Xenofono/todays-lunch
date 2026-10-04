import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish, formatPrice } from "../dish";
import { normalizeWhitespace } from "../utils";

type TextItem = { x: number; y: number; str: string };

export class Bistroteket extends Restaurant {
    constructor() {
        super(
            "Bistroteket",
            "https://www.bistroteket.se",
            "Bondegatan 54, 116 33 Stockholm",
            { lat: 59.313533803531136, lng: 18.084612856319417}
        );
    }


    protected async _getMenu(): Promise<DailyMenu> {
        const pdfUrl = await this._lunchPdf();
        const buf = await this.fetchBuffer(pdfUrl);
        return this._parseMenu(await Bistroteket._pdfRows(buf));
    }

    private async _lunchPdf(): Promise<string> {
        const html = await this.fetchText();
        const $ = cheerio.load(html);
        const href = $('a:contains("Lunch")').first().attr("href");
        if (!href) throw new Error("No PDF link found");
        this._url = this._url+href
        return href.startsWith("http") ? href : new URL(href, this._url).href;
    }

    /**
     * The PDF's text stream is out of reading order (all day headers first, then
     * all "Kött:/Fisk:" labels, then all dishes), so plain pdf-parse text is useless.
     * Rebuild the visual lines from each text item's position instead.
     */
    private static async _pdfRows(buf: Buffer): Promise<string[]> {
        const items: TextItem[] = [];
        await pdf(buf, {
            pagerender: async (page: { getTextContent: () => Promise<{ items: { str: string; transform: number[] }[] }> }) => {
                const content = await page.getTextContent();
                for (const it of content.items) {
                    if (it.str.trim()) items.push({ x: it.transform[4], y: it.transform[5], str: it.str });
                }
                return "";
            },
        });

        // top-to-bottom; items within a few points vertically are on the same line
        // (labels sit 1-2pt off their dish text)
        items.sort((a, b) => b.y - a.y);
        const rows: TextItem[][] = [];
        for (const item of items) {
            const row = rows[rows.length - 1];
            if (row && Math.abs(row[0].y - item.y) <= 3) row.push(item);
            else rows.push([item]);
        }

        return rows.map(row => row
            .sort((a, b) => a.x - b.x)
            .map(i => i.str.trim())
            .join(" ")
            .replace(/\s+:/g, ":")   // "Kött" + ":" are separate items
        ).map(normalizeWhitespace);
    }

    private _parseMenu(rows: string[]): DailyMenu {
        const menu: DailyMenu = {};
        const weekly: string[] = [];

        const start = rows.findIndex(r => r.toLowerCase() === "måndag");
        if (start < 0) throw new Error("No 'MÅNDAG' found in lunch PDF");

        // header block: "VECKANS LUNCH", "149:-", "Sallad, färskt bröd, ... ingår!"
        const header = rows.slice(0, start);
        const lunchIdx = header.findIndex(r => r.toUpperCase().startsWith("VECKANS LUNCH"));
        if (lunchIdx >= 0) {
            const isPrice = (r: string) => /^\d+:-$/.test(r);
            const price = header.find(isPrice);
            const included = header.slice(lunchIdx + 1).filter(r => !isPrice(r)).join(" ");
            this._additionalInformation = [`Veckans lunch${price ? ` ${formatPrice(price)}` : ""}`, included].filter(Boolean).join(" — ");
        }

        // a dish line starts with a label ("Kött: ...", "Fisk: ...", "Alltid på tisdagar: ...");
        // label-less lines continue the dish above. "VECKANS VEGETARISKA"/"VECKANS PASTA" start weekly sections.
        let target: string[] | null = null;
        let weeklyLabel: string | null = null;
        for (const row of rows.slice(start)) {
            const lower = row.toLowerCase();
            if (Restaurant.isValidSeDay(lower)) {
                target = (menu[Restaurant.daySvToEn(lower)] ??= []);
                continue;
            }
            if (/^VECKANS [A-ZÅÄÖ ]+$/.test(row)) {
                target = weekly;
                weeklyLabel = row;
                continue;
            }
            if (/^välkomna/i.test(row)) break;
            if (!target) continue;

            const labelled = /^([^:]{2,30}):\s*(.+)$/.exec(row);
            if (labelled) {
                target.push(formatDish({ label: labelled[1], text: labelled[2] }));
            } else if (target === weekly && weeklyLabel) {
                target.push(formatDish({ label: weeklyLabel, text: row }));
                weeklyLabel = null;
            } else if (target.length > 0) {
                target[target.length - 1] += ` ${row}`;
            } else {
                target.push(row);
            }
        }

        this._weeklyMenu = weekly;
        return menu;
    }
}
