import { Restaurant } from './restaurant';
import { DailyMenu } from '../types';
import * as cheerio from "cheerio";
import { formatDish, formatPrice } from '../dish';
import { normalizeWhitespace } from '../utils';

export class Usine extends Restaurant {
    constructor() {
        super(
            "Usine",
            "https://www.usine.se/bistro38",
            "https://www.usine.se/bistro38/placeholder",
            "Södermalmsallén 38, 118 28 Stockholm",
            { lat: 59.313747, lng: 18.070368 }
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

        const text = (el: Parameters<typeof $>[0], selector: string) => normalizeWhitespace($(el).find(selector).text());
        const dishRow = (row: Parameters<typeof $>[0]) => ({
            label: text(row, ".MenyRattRadUnderrubrik"),
            text: text(row, ".MenyRattRadVanster"),
            price: text(row, ".MenyRattRadHogerMarginal"),
        });

        // day blocks: <div class="MenyRattRubrik">Måndag 5/10</div> followed by one or more dish rows.
        // Only look at direct siblings — the wrapping containers nest every day inside each other.
        $(".MenyRattRubrik").each((_, header) => {
            const day = Restaurant.matchDayHeader(normalizeWhitespace($(header).text()))?.dayEn;
            if (!day) return;

            $(header).siblings(".MenyRattRadHallare").each((_, row) => {
                const { text, price } = dishRow(row);
                if (text) (menu[day] ??= []).push(formatDish({ text, price }));
            });
        });

        const sectionRows = (title: string) => $(".MenyRattRubrikStor")
            .filter((_, el) => normalizeWhitespace($(el).text()).toUpperCase().startsWith(title))
            .first()
            .parent()
            .find(".MenyRattRadHallare")
            .toArray()
            .map(dishRow);

        // the rest of the "veckans à la carte" list is their standing menu; only the weekly specials rotate
        this._weeklyMenu = sectionRows("VECKANS A LA CARTE")
            .filter(r => r.label.toUpperCase().startsWith("VECKANS") && r.text)
            .map(formatDish);

        // e.g. "Late lunch 13:00-14:00: Dagens lunch eller veckans vegetariska 129 kr · Veckans fisk 139 kr"
        const offers = sectionRows("ERBJUDANDEN");
        if (offers.length > 0) {
            this._additionalInformation = `${offers[0].label}: ` +
                offers.map(o => `${o.text} ${formatPrice(o.price)}`.trim()).join(" · ");
        }

        if (Object.keys(menu).length === 0 && this._weeklyMenu.length === 0) {
            throw new Error("No lunch menu found");
        }

        return menu;
    }
}
