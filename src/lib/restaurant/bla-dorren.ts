import {Restaurant} from './restaurant';
import {DailyMenu} from '../types';
import * as cheerio from "cheerio";

export class BlaDorren extends Restaurant {
    constructor() {
        super(
            "Blå dörren",
            "https://bla-dorren.se/lunch",
            "https://bla-dorren.se/lunch/placeholder"
        );
        this._additionalInformation = "No HTML or PDF menu to parse here, so please click button to view menu."
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

        this._menuImgUrl = $("img").last().attr("src");
        
        return menu;
    }


}