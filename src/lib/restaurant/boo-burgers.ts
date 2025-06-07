import { Restaurant } from './restaurant';
import { DailyMenu } from '../types';
import * as cheerio from "cheerio";

export class BooBurgers extends Restaurant {
    constructor() {
        super(
            "Boo Burgers",
            "https://boogotgatan.gastrogate.com/lunch-deal/", 
            "https://gastrogate.com/files/homepage/logotype/32966/booburgerslogo-nav_infopage.png" 
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        const html = await (await fetch(this._url)).text();
        return this._parseMenu(html);
    }

    private _parseMenu(html: string): DailyMenu {
        const menu: DailyMenu = {};
        const today = Restaurant.todayEn()
        menu[today] = []
        
        const $ = cheerio.load(html);
        
        const todaysDeals = $(".menu-item")
        
        console.log(todaysDeals.length)
        
        for (let i = 0; i < todaysDeals.length; i++) {
            const deal =  todaysDeals[i];
            const name = $(deal).find("h4").text();
            const description = $(deal).find("p").text();
            const price  = $(deal).find(".price-tag").text();
            menu[today].push(name + " " + description + " - " + price);
        }
        
        return menu;
    }

   
}