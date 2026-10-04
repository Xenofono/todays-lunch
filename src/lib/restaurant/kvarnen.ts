import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";
import { formatDish } from "../dish";

export class Kvarnen extends Restaurant {
    constructor() {
        super(
            "Kvarnen",
            "https://www.kvarnen.com/sv/lunch",
            "Tjärhovsgatan 4, 116 21 Stockholm",
            { lat: 59.314846, lng: 18.0742 }
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        const html = await this.fetchText();
        return this._parseMenu(html);
    }

    private _parseMenu(html: string): DailyMenu {
        const $ = cheerio.load(html);
        const menu: DailyMenu = {};

        // each menu category is a .meny-section with a title, e.g. "Dagens lunch", "Veckans fisk"
        const section = (title: string) => $(".meny-section").filter(
            (_, el) => $(el).find(".meny-section-title").text().trim().toLowerCase() === title
        ).first();

        const rows = (el: ReturnType<typeof section>) => el.find(".meny-row").toArray().map(row => ({
            name: $(row).find(".meny-name").text().trim(),
            desc: $(row).find(".meny-desc").text().trim(),
            price: $(row).find(".meny-pris").text().trim(),
        }));

        const daily = section("dagens lunch");
        if (daily.length === 0) throw new Error("No 'Dagens lunch' section found");

        // e.g. "Serveras måndag till fredag kl. 11–15. Ingår: sallad, bröd, smör, kaffe/te och liten kaka."
        const info = daily.find(".meny-sub").text().trim();
        if (info) this._additionalInformation = info;

        // rows are named after the weekday; a non-day row (e.g. "Varm punsch" after
        // Thursday's pea soup) is an add-on to the day above it
        let currentDay: string | null = null;
        for (const { name, desc, price } of rows(daily)) {
            const dayEn = Restaurant.isValidSeDay(name.toLowerCase()) ? Restaurant.daySvToEn(name.toLowerCase()) : null;
            if (dayEn) currentDay = dayEn;
            if (!currentDay) continue;

            const dish = dayEn ? { text: desc, price } : { name, text: desc, price };
            if (!dish.name && !dish.text) continue;
            (menu[currentDay] ??= []).push(formatDish(dish));
        }

        this._weeklyMenu = rows(section("veckans fisk"))
            .filter(r => r.name)
            .map(r => formatDish({ label: "VECKANS FISK", name: r.name, text: r.desc, price: r.price }));

        return menu;
    }
}
