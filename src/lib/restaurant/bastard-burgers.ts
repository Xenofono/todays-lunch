import * as cheerio from "cheerio";
import { Restaurant } from "./restaurant";
import { DailyMenu } from "../types";

export class BastardBurgers extends Restaurant {
    constructor() {
        super(
            "Bastard Burgers",
            "https://bastardburgers.com/se/meny/",
            "Folkungagatan 54, 116 22 Stockholm",
            { lat: 59.31436160454878, lng: 18.07469798465591 },
        );
    }


    protected async _getMenu(): Promise<DailyMenu> {
        const html = await this.fetchText();
        return this._parseMenu(html);
    }

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


        return menu;
    }
}
