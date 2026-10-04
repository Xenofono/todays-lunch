import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";

export class VillaValentina extends Restaurant {
    constructor() {
        super(
            "Villa Valentina",
            "https://www.villavalentina.se/stockholm/veckans-lunch",
            "https://cdn.prod.website-files.com/69de817fa43b7efc02084f7f/69df993bc99ea9e324857903_Varl%C4%B1k%202.svg",
            "Slussbrogatan 10, 116 45 Stockholm",
            { lat: 59.320128, lng: 18.071319 }
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

        // e.g. "Veckans lunch serveras mån - fre kl 11.30-14:00. Välkomna!"
        const lunchInfo = $(".paragraph.kontakt.hero").first().text().trim();
        if (lunchInfo) this._additionalInformation = lunchInfo;

        const menuItems = $(".section-kontakt.veckans .div-block-42").toArray()
            .map(el => ({
                label: $(el).find(".text-block-7").text(),
                name: $(el).find(".text-block-8").text(),
                text: $(el).find(".text-block-9").text(),
                price: $(el).find(".text-block-10").text(),
            }))
            .filter(d => d.name.trim())
            .map(formatDish);

        if (menuItems.length === 0) throw new Error("No menu items found");

        // Villa Valentina serves one menu all week (Monday-Friday), not a daily one
        this._weeklyMenu = menuItems;

        return {};
    }
}
