import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";
import { normalizeWhitespace } from "../utils";

export class UrbanDeli extends Restaurant {
    constructor() {
        super(
            "Urban Deli Nytorget",
            "https://urbandeli.se/nytorget/",
            "Nytorget 4, 116 40 Stockholm",
            { lat: 59.312405, lng: 18.082756 }
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        const html = await this.fetchText();
        return this._parseMenu(html);
    }

    private _parseMenu(html: string): DailyMenu {
        const $ = cheerio.load(html);
        const menu: DailyMenu = {};

        // "V 40- Oktoberfestvecka Lunch specials Mon-Fri 11.30-14.30" heads a table of
        // alternating rows: a weekday heading, then that day's dish
        const section = $(".menu-section").filter(
            (_, el) => /lunch/i.test($(el).find(".menu-section-title").text())
        ).first();
        if (section.length === 0) throw new Error("No lunch section found");

        this._additionalInformation = normalizeWhitespace(section.find(".menu-section-title").text());

        let currentDay: string | undefined;
        section.find("tr").each((_, row) => {
            const heading = normalizeWhitespace($(row).find(".menu-item-day-heading").text());
            if (heading) {
                currentDay = Restaurant.matchDayHeader(heading)?.dayEn;
                return;
            }
            const name = $(row).find(".menu-item-title").text();
            if (!currentDay || !name.trim()) return;
            (menu[currentDay] ??= []).push(formatDish({
                name,
                text: $(row).find(".menu-item-description").text(),
                price: $(row).find(".menu-item-price").text(),
            }));
        });

        return menu;
    }
}
