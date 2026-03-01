import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class Invece extends Restaurant {
    constructor() {
        super(
            "Invece",
            "https://invece.se/lunch/",
            "https://invece.se/wp-content/uploads/2023/01/invece-white.png"
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
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const startIndex = lines.findIndex(x => x.toLowerCase() === "måndag");
        const endIndex = lines.findIndex(x => x.includes("PASTA DEL GIORNO"));
        const linesToWorkWith = lines.slice(startIndex, endIndex);

        const priceLine = lines.find(x => x.includes("VECKANS LUNCH"));
        if (priceLine) this._additionalInformation = priceLine;

        let currentDay: string | null = null;

        for (let i = 0; i < linesToWorkWith.length; i++) {
            const line = linesToWorkWith[i];

            if (Restaurant.isValidSeDay(line.toLowerCase())) {
                currentDay = Restaurant.daySvToEn(line.toLowerCase());
            } else if (line !== "____________________________________________") {
                if (currentDay) {
                    if (!menu?.[currentDay]) menu[currentDay] = [];
                    
                    if (menu[currentDay].length > 0 && (/^[a-zåäö]/.test(line) || line.startsWith("Med ") || line.startsWith("Alternativt "))) {
                        menu[currentDay][menu[currentDay].length - 1] += ` ${line}`;
                    } else {
                        menu[currentDay].push(line);
                    }
                }
            }
        }

        return menu;
    }
}
