import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";

export class Florentine extends Restaurant {
    constructor() {
        super(
            "Florentine",
            "https://www.florentinerestaurants.com/stockholm/veckans-lunch",
            "https://cdn.prod.website-files.com/63728bf3f3f63c22f5b62cb0/63d3f1e9697c54721bda4755_Basd.svg",
            "Folkungagatan 44, 118 26 Stockholm",
            { lat: 59.313866, lng: 18.07171 }
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

        // Extract additional information (lunch hours)
        const lunchInfo = $(".paragraph-tier-1.weekly-menu-main-para").text().trim();
        this._additionalInformation = lunchInfo;

        const menuItems = $(".weekly-menu-items-wrapper").toArray()
            .map(el => ({
                label: $(el).find(".menu-name").text(),
                name: $(el).find(".menu-item-name").text(),
                text: $(el).find(".menu-item-description").text(),
                price: $(el).find(".menu-item-price").text(),
            }))
            .filter(d => d.name.trim())
            .map(formatDish);

        // Florentine serves one menu all week (Monday-Friday), not a daily one
        this._weeklyMenu = menuItems;

        return {};
    }
}
