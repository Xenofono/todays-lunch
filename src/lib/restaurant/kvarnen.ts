import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class Kvarnen extends Restaurant {
    constructor() {
        super(
            "Kvarnen",
            "https://www.kvarnen.com/mat-dryck/",
            "https://www.kvarnen.com/wp-content/uploads/2017/01/kvarnen_3.jpg"
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
                revalidate: 3600
            }
        })).text();
        const $ = cheerio.load(html);
        const lunchContainer = $('.todays-lunch').parent()
        const href = $(lunchContainer).find("a[href*=\".pdf\"]").first().attr("href");
        if (!href) throw new Error("No PDF link found");
        this._url = href;
        return href.startsWith("http") ? href : new URL(href, this._url).href;
    }

    private _parseMenu(raw: string): DailyMenu {
        const menu: DailyMenu = {};

        // work on trimmed non-empty lines
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const startIndex = lines.findIndex(x => x.toLowerCase() == "måndag")
        const endIndex = lines.findIndex(x => x.toLowerCase() == "fredag")
        const linesToWorkWith = lines.slice(startIndex, endIndex+2)
        
        const priceLine = lines.find(x => x.toLowerCase().includes(":-"))
        
        if (priceLine) this._additionalInformation = priceLine;

        let currentDay: string | null = null;
        for (let i = 0; i < linesToWorkWith.length; i++) {
            
            const line = linesToWorkWith[i];
            
            if(Restaurant.isValidSeDay(line.toLowerCase()))
            {
                currentDay = line;
            }
            else
            {
                const dayEn = Restaurant.daySvToEn(currentDay!);
                
                if (menu?.[dayEn]) menu[dayEn].push(line)
                else menu[dayEn] = [line];
                
                
            }
            //console.log(i, line)
        }
        


        return menu;
    }
}
