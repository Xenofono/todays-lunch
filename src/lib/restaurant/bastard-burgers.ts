import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class BastardBurgers extends Restaurant {
    constructor() {
        super(
            "Bastard Burgers",
            "https://bastardburgers.com/se/meny/",
            "https://bastardburgers.com/wp-content/themes/bastardburgers/dist/img/bastard_logo.svg"
        );
    }

    /* ---------- step 1 – fetch page ---------- */
    protected async _getMenu(): Promise<DailyMenu> {
        const html = await (await fetch(this._url)).text();
        return this._parseMenu(html);
    }

    /* ---------- step 2 – scrape with Cheerio ---------- */
    private _parseMenu(html: string): DailyMenu {
        const $ = cheerio.load(html);
        const menu: DailyMenu = {};
        
        const parentOfWeeklyMenu = $(".js-lunch-week-item").parent()
        
        
        for (let i = 0; i < parentOfWeeklyMenu.children().length; i++) {
            const child = parentOfWeeklyMenu.children()[i];
            const day = $(child).find("h3")
            const meal = $(child).find("h4")
            const mealDescription = $(child).find("p")

            const dayEn = Restaurant.daySvToEn(day.text().toLowerCase());
            menu[dayEn] = [meal.text() + " - " +  mealDescription.text()];
        }

        /* 1️⃣ find the section header  <h2>Dagens lunch</h2> */
        const lunchH2 = $("h2")
            .filter((_, el) =>
                $(el).text().trim().toLowerCase().startsWith("dagens lunch")
            )
            .first();
        

        if (!lunchH2.length) throw new Error('No "Dagens lunch" section found');

        /* 2️⃣ walk forward until the next <h2> */
        let currentDay: string | null = null;

        lunchH2.nextAll().each((_, el) => {
            if ($(el).is("h2")) return false; // ← break when next big section starts

            if ($(el).is("h3")) {
                /* weekday             e.g.  ### Måndag   */
                const daySv = $(el).text().trim().toLowerCase();
                currentDay = Restaurant.daySvToEn(daySv); // helper in your base class
                menu[currentDay] = [];
            } else if ($(el).is("h4") && currentDay) {
                /* burger name         e.g.  #### Texas Doritos */
                const dish = $(el).text().trim();
                if (dish) menu[currentDay].push(dish);
            }
        });

        return menu;
    }
}
