import * as cheerio from 'cheerio';
import { Restaurant } from './restaurant';
import { DailyMenu } from '../types';
import pdf from "pdf-parse";

export class OliverTwist extends Restaurant {
    constructor() {
        super(
            "Oliver Twist",
            "https://www.olivertwist.se/"
        );
    }

    protected async _getMenu(): Promise<DailyMenu> {
        try {
            // Fetch the webpage
            const response = await fetch(this._url);
            if (!response.ok) {
                throw new Error(`Failed to fetch website: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Find lunch PDF link using the same selectors
            const selectors = [
                'a[aria-label*="lunch" i]',
                'a[href*="lunch"]',
                'a[href*=".pdf"]'
            ];

            let pdfUrl: string | null = null;
            for (const selector of selectors) {
                const element = $(selector).first();
                if (element.length > 0) {
                    pdfUrl = element.attr('href') || null;
                    if (pdfUrl) break;
                }
            }

            if (!pdfUrl) throw new Error('No lunch menu PDF found');

            // Make absolute URL
            if (!pdfUrl.startsWith('http')) {
                pdfUrl = new URL(pdfUrl, this._url).href;
            }

            // Update URL for future use
            this._url = pdfUrl;

            // Download and parse PDF
            const pdfResponse = await fetch(pdfUrl);
            if (!pdfResponse.ok) {
                throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
            }

            const buffer = await pdfResponse.arrayBuffer();
            const pdfData = await pdf(Buffer.from(buffer));

            return this._parseMenu(pdfData.text);

        } catch (error) {
            throw new Error(`Failed to get menu: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private _parseMenu(text: string): DailyMenu {
        const menu: DailyMenu = {};
        const lines = text.split('\n');
        let currentDay: string | null = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Check for day headers
            for (let i = 0; i < Restaurant.WEEKDAYS_SE.length; i++) {
                const daySe = Restaurant.WEEKDAYS_SE[i];
                const dayEn = Restaurant.WEEKDAYS_EN[i];

                if (line.toLowerCase().includes(daySe.toLowerCase())) {
                    currentDay = dayEn;
                    menu[currentDay] = [];
                    // Extract any text after the day name
                    const afterDay = line.split(':').slice(1).join(':').trim();
                    if (afterDay) menu[currentDay].push(afterDay);
                    break;
                }
            }

            if (!currentDay) continue;
            if (/hela veckan/i.test(line)) break;


            if (currentDay && !Restaurant.WEEKDAYS_SE.some(day =>line.toLowerCase().includes(day.toLowerCase())
            )) {
                // Check if it's a continuation (starts with lowercase)
                if (menu[currentDay].length > 0 && line[0] === line[0].toLowerCase()) {
                    menu[currentDay][menu[currentDay].length - 1] += ` ${line}`;
                } else {
                    menu[currentDay].push(line);
                }
            }
        }

        return menu;
    }
}