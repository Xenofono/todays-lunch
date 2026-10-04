import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";
import { normalizeWhitespace } from "../utils";

// Big Ben's own site is down; their weekly menu is kept up to date on Kvartersmenyn
export class BigBen extends Restaurant {
    constructor() {
        super(
            "Big Ben Pub",
            "https://www.kvartersmenyn.se/index.php/rest/8702",
            "",
            "Folkungagatan 97, 116 30 Stockholm",
            { lat: 59.315561, lng: 18.08324 }
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        const html = await (await fetch(this._url, {
            next: {
                revalidate: 14400
            }
        })).text();
        return this._parseMenu(html);
    }

    private _parseMenu(html: string): DailyMenu {
        const $ = cheerio.load(html);
        const menu: DailyMenu = {};
        const weekly: string[] = [];

        // first .meny is the week: <strong>Måndag</strong><br>dish<br>dish<br><br><b>VECKANS PASTA</b>...
        // the second one holds price/included/opening hours
        const [week, details] = $(".meny").toArray();
        if (!week) throw new Error("No menu found");

        const box = $(week);
        box.find("i").remove(); // Kvartersmenyn hides near-invisible decoy words in <i> to trip scrapers
        box.find("strong, b").each((_, el) => { $(el).replaceWith(`\n#${$(el).text()}\n`); });
        box.find("br").replaceWith("\n");
        const lines = box.text().split("\n").map(normalizeWhitespace).filter(Boolean);

        let target: string[] | null = null;
        let label: string | undefined;
        for (const line of lines) {
            if (line.startsWith("#")) {
                const heading = line.slice(1).trim();
                const day = Restaurant.matchDayHeader(heading)?.dayEn;
                if (day) {
                    target = (menu[day] ??= []);
                    label = undefined;
                } else if (/^veckans\b/i.test(heading)) {
                    target = weekly;
                    label = heading;
                } else {
                    // "SERVERAS Hela veckan -185 /kr" — the standing à la carte list; not lunch specials
                    target = null;
                }
                continue;
            }
            target?.push(formatDish({ label, text: line }));
        }

        // "Pris: 155 kr", "Ingår: Smör, bröd sallad kaffe", "Lunch: 11:00-15:00"
        if (details) {
            const info = $(details).text();
            const price = /Pris:\s*([^\n]+?kr)/i.exec(info)?.[1];
            const included = /Ingår:\s*([^\n]+?)(?=Lunch:|$)/i.exec(info)?.[1];
            const hours = /Lunch:\s*([\d:.\-–]+)/i.exec(info)?.[1];
            this._additionalInformation = [
                price && `Lunch ${normalizeWhitespace(price)}`,
                hours,
                included && `incl. ${normalizeWhitespace(included).toLowerCase()}`,
            ].filter(Boolean).join(" · ");
        }

        this._weeklyMenu = weekly;
        return menu;
    }
}
