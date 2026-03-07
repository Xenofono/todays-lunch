import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

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
        const menu: DailyMenu = {};

        // Extract additional information (lunch hours)
        const lunchInfo = $(".paragraph-tier-1.weekly-menu-main-para").text().trim();
        this._additionalInformation = lunchInfo;

        // Extract all menu items
        const menuItems: string[] = [];
        $(".weekly-menu-items-wrapper").each((_, element) => {
            const menuName = $(element).find(".menu-name").text().trim().toUpperCase();
            const itemName = $(element).find(".menu-item-name").text().trim();
            const description = $(element).find(".menu-item-description").text().trim();
            const price = $(element).find(".menu-item-price").text().trim();

            if (itemName) {
                menuItems.push(`${menuName}: ${itemName} - ${description} (${price})`);
            }
        });

        // Florentine has the same menu all week (Monday-Friday)
        // Populate all weekdays with the same menu
        const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        weekdays.forEach(day => {
            menu[day] = [...menuItems];
        });

        return menu;
    }
}
