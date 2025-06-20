import { Restaurant } from './restaurant';
import { DailyMenu } from '../types';
import * as cheerio from "cheerio";

export class Usine extends Restaurant {
    constructor() {
        super(
            "Usine",
            "https://www.usine.se/bistro38",
            "https://www.usine.se/bistro38/placeholder"
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
        const menu: DailyMenu = {};

        const $ = cheerio.load(html);

        const lunchDivs = $(".RutaMarginalSidorMindre")

        for (let i = 0; i < lunchDivs.length; i++) {
            const deal =  lunchDivs[i];
            const possibleDayDiv = $(deal).find(".MenyRattRubrik")?.text()
            const possibleDayDivSplit = possibleDayDiv?.split(" ")
            
            if (Restaurant.isValidSeDay(possibleDayDivSplit[0]?.toLowerCase()))
            {
                const day = Restaurant.daySvToEn(possibleDayDivSplit[0]?.toLowerCase())
                const food = $(deal).find(".MenyRattRadHallare")
                menu[day] = [food.text()]
            }
            
        }

        return menu;
    }


}