import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class BiblioteketLive extends Restaurant {
    constructor() {
        super(
            "Biblioteket Live",
            "https://biblioteketlive.se",
            "https://biblioteketlive.se/placeholder"
        );
    }


    protected async _getMenu(): Promise<DailyMenu> {
        const pdfUrl = await this._firstPdf();
        const buf = await (await fetch(pdfUrl)).arrayBuffer();
        const text = (await pdf(Buffer.from(buf))).text;
        return this._parseMenu(text);
    }

    private async _firstPdf(): Promise<string> {
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

        // work on trimmed non-empty lines
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const firstLineIndex = lines.findIndex(x => x.trim() === "MÅNDAG")
        const lastLineIndex = lines.findIndex(x => x.trim().includes(" kr") && x.trim().length == 6)

        this._additionalInformation =  lines[lastLineIndex];
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
                    menu[currentDay].push(line);
                }
                
            }
        }
        
        return menu;
    }
}
