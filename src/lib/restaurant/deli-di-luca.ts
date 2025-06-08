import * as cheerio from "cheerio";
import {Restaurant} from "./restaurant";
import {DailyMenu} from "../types";

export class DeliDiLuca extends Restaurant {
    constructor() {
        super(
            "Deli Di Luca",
            "https://www.delidiluca.se/lunchmeny/",
            "https://www.delidiluca.se/placeholder"
        );
    }


    protected async _getMenu(): Promise<DailyMenu> {
        const html = await (await fetch(this._url)).text();
        return this._parseMenu(html);
    }

    private _parseMenu(html: string): DailyMenu {
        const $ = cheerio.load(html);
        const menu: DailyMenu = {};

        this._additionalInformation =  $(html).find(".lunch-menu__description").text();
        
        const lunchUl = $(".lunch-menu__category-list").first()
        const dailyLunches = $(lunchUl).children("li")


        for (let i = 0; i < dailyLunches.length; i++) {
            const daily = dailyLunches[i];
            const day = $(daily).find("h4")
            const meals = $(daily).find("h6")

            const dayEn = Restaurant.daySvToEn(day.text().toLowerCase());
            menu[dayEn] = [];
            
            for (let meal of meals) {
                menu[dayEn].push($(meal).text())
            }
        }


        return menu;
    }
}
