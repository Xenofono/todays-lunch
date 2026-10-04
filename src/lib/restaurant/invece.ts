import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";
import { normalizeWhitespace } from "../utils";

export class Invece extends Restaurant {
    constructor() {
        super(
            "Invece",
            "https://invece.se/lunch/",
            "https://invece.se/wp-content/uploads/2023/01/invece-white.png",
            "Götgatan 73, 116 62 Stockholm",
            { lat: 59.311375, lng: 18.075058 }
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        const pdfUrl = await this._findPdfLink();
        const buf = await (await fetch(pdfUrl)).arrayBuffer();
        const text = (await pdf(Buffer.from(buf))).text;
        return this._parseMenu(text);
    }

    private async _findPdfLink(): Promise<string> {
        const html = await (await fetch(this._url, {
            next: {
                revalidate: 14400
            }
        })).text();
        const $ = cheerio.load(html);
        const href = $('a[href*=".pdf"]').first().attr("href");
        if (!href) throw new Error("No PDF link found");
        this._url = href;
        return href.startsWith("http") ? href : new URL(href, this._url).href;
    }

    private _parseMenu(raw: string): DailyMenu {
        const menu: DailyMenu = {};
        const lines = raw.split(/\r?\n/).map(normalizeWhitespace).filter(Boolean);
        const startIndex = lines.findIndex(x => x.toLowerCase() === "måndag");
        const endIndex = lines.findIndex(x => x.toUpperCase().startsWith("PASTA DEL GIORNO"));
        if (startIndex < 0) throw new Error("No 'MÅNDAG' found in lunch PDF");
        const linesToWorkWith = lines.slice(startIndex, endIndex < 0 ? undefined : endIndex);

        // "VECKANS LUNCH 155: -" -> "Veckans lunch 155 kr"
        const priceLine = lines.find(x => x.toUpperCase().startsWith("VECKANS LUNCH"));
        if (priceLine) {
            const price = /\d+/.exec(priceLine)?.[0];
            this._additionalInformation = `Veckans lunch${price ? ` ${price} kr` : ""}`;
        }

        // A dish is wrapped over several PDF lines and ends with a full stop, e.g.
        //   "Köttfärslimpa" / "Potatispuré, gräddsås & svartvinbärsgelé."
        // so keep joining lines until one ends with "." (or the day/section ends).
        let target: string[] | null = null;
        // set by a "VECKANS FISK 155:-" section header, cleared by a day header
        let label: string | undefined;
        let price: string | undefined;
        let pending: string | null = null;
        const weekly: string[] = [];

        const flush = () => {
            if (pending && target) target.push(formatDish({label, text: pending, price}));
            pending = null;
        };

        for (const line of linesToWorkWith) {
            if (/^_+$/.test(line)) { flush(); continue; }

            const day = line.toLowerCase();
            if (Restaurant.isValidSeDay(day)) {
                flush();
                target = (menu[Restaurant.daySvToEn(day)] ??= []);
                label = price = undefined;
                continue;
            }

            // "VECKANS FISK 155:-" — a weekly dish, served alongside the daily ones
            const section = /^(VECKANS [A-ZÅÄÖ]+)\s*(\d+)?/.exec(line);
            if (section) {
                flush();
                target = weekly;
                [, label, price] = section;
                continue;
            }

            if (!target) continue;
            if (pending === null) {
                pending = line;
            } else {
                // "Köttfärslimpa" + "Potatispuré, ..." -> name, then description
                const continues = /[,&]$|\b(med|och|på|i)$/i.test(pending) || /^[a-zåäö]/.test(line);
                pending += continues ? ` ${line}` : ` - ${line}`;
            }
            if (pending.endsWith(".")) flush();
        }
        flush();

        this._weeklyMenu = weekly;

        return menu;
    }
}
