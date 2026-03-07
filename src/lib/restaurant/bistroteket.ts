import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class Bistroteket extends Restaurant {
    constructor() {
        super(
            "Bistroteket",
            "https://www.bistroteket.se",
            "https://www.bistroteket.se/placeholder",
            "Bondegatan 54, 116 33 Stockholm",
            { lat: 59.313533803531136, lng: 18.084612856319417}
        );
    }


    protected async _getMenu(): Promise<DailyMenu> {
        const pdfUrl = await this._lunchPdf();
        const buf = await (await fetch(pdfUrl)).arrayBuffer();
        const text = (await pdf(Buffer.from(buf))).text;
        return this._parseMenu(text);
    }

    private async _lunchPdf(): Promise<string> {
        const html = await (await fetch(this._url, {
            next: {
                revalidate: 14400
            }
        })).text();
        const $ = cheerio.load(html);
        const href = $('a:contains("Lunch")').first().attr("href");
        if (!href) throw new Error("No PDF link found");
        this._url = this._url+href
        return href.startsWith("http") ? href : new URL(href, this._url).href;
    }

    private _parseMenu(raw: string): DailyMenu {
        const menu: DailyMenu = {};
        // work on trimmed non-empty lines
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const firstLineIndex = lines.findIndex(x => x.trim() === "MÅNDAG")
        const lastLineIndex = lines.findIndex(x => x.trim().includes(" kr") && x.trim().length == 6)
        
        this._additionalInformation = "THIS SITES PDF IS FUCKED UP, HOPE THEY COOK BETTER THAN THEY PDF..." + lines.find(x => x.includes("VECKANS LUNCH"))?.split(" ")?.filter(x => x)?.join(" ");
        const linesToWorkWith = lines.slice(firstLineIndex, lastLineIndex)

        let currentDay: string | null = null;


        for (let i = 0; i < linesToWorkWith.length; i++) {
            const line = linesToWorkWith[i];
            if (Restaurant.isValidSeDay(line.trim().toLowerCase()))
            {
                currentDay = Restaurant.daySvToEn(line.trim().toLowerCase());
            }
            else
            {
                if (currentDay && line[0] !== "(")
                {
                    if (!menu?.[currentDay]) menu[currentDay] = [];
                    if (!line.includes(":")) menu[currentDay][menu[currentDay].length-1] += ` ${line}`;
                    else menu[currentDay].push(line);
                    
                }

            }
        }

        return menu;
    }
}
