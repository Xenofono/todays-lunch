import {DailyMenu} from "@/lib/types";

type VALID_SE_DAYS = typeof Restaurant.WEEKDAYS_SE[number]
type VALID_EN_DAYS = typeof Restaurant.WEEKDAYS_EN[number]

export abstract class Restaurant {
    static readonly WEEKDAYS_EN = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
    static readonly WEEKDAYS_SE = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"] as const;
    static _debugDay: string | undefined = undefined; // override day name for testing

    // look like a browser: some sites serve bot checks or trimmed pages to unknown clients
    private static readonly FETCH_HEADERS = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8",
    };

    private _currentMenu: DailyMenu = {};
    // dishes served every weekday (veckans lunch / weekly specials), kept apart from the per-day menu
    protected _weeklyMenu: string[] = [];
    private _name: string;
    protected _url: string;
    private _didError: string | undefined = undefined
    protected _additionalInformation: string | undefined = undefined;
    protected _menuImgUrl: string | undefined = undefined;
    private _address: string | undefined = undefined;
    private _coordinates: { lat: number; lng: number } | undefined = undefined;

    constructor(name: string, url: string, address?: string, coordinates?: { lat: number; lng: number }) {
        this._name = name;
        this._url = url;
        this._address = address;
        this._coordinates = coordinates;
    }

    /** Scrapes the menu. Caching is done by the caller (see menu-cache.ts), not here. */
    async update(): Promise<void> {
        try {
            console.log(`Updating restaurant menu: ${this._name}`);
            this._currentMenu = await this._getMenu();
        } catch (error) {
            const message = `ERROR: Failed to update restaurant menu (${this._name}): ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.error(message);
            this._didError = message;
        }
    }

    private async _fetch(url: string): Promise<Response> {
        const res = await fetch(url, { headers: Restaurant.FETCH_HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
        return res;
    }

    protected async fetchText(url: string = this._url): Promise<string> {
        return (await this._fetch(url)).text();
    }

    protected async fetchBuffer(url: string): Promise<Buffer> {
        return Buffer.from(await (await this._fetch(url)).arrayBuffer());
    }

    get didError(): string | undefined {
        return this._didError
    }

    get menu(): DailyMenu {
        return this._currentMenu;
    }
    
    get weeklyMenu(): string[] {
        return this._weeklyMenu;
    }

    get additionalInformation(): string | undefined {
        return this._additionalInformation;
    }
    
    get menuImgUrl(): string | undefined {
        return this._menuImgUrl;
    }

    get menuToday(): string[] {
        return this.menu[Restaurant.todayEn()] || [];
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get address(): string | undefined {
        return this._address;
    }

    get coordinates(): { lat: number; lng: number } | undefined {
        return this._coordinates;
    }
    
    protected abstract _getMenu(): Promise<DailyMenu>;

    static todayEn(): string {
        if (Restaurant._debugDay) return Restaurant._debugDay;
        // the server may run in UTC; the menus are for Stockholm's "today"
        return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "Europe/Stockholm" })
            .format(new Date())
            .toLowerCase();
    }

    static todaySe(): string {
        const idx = Restaurant.WEEKDAYS_EN.indexOf(Restaurant.todayEn() as typeof Restaurant.WEEKDAYS_EN[number]);
        return Restaurant.WEEKDAYS_SE[idx];
    }
    
    static daySvToEn (day: string): string {
        const idx = Restaurant.WEEKDAYS_SE.findIndex(x => x === day)
        return Restaurant.WEEKDAYS_EN[idx]
    }
    
    static isWeekend(): boolean {
        const today = Restaurant.todayEn()
        return ["saturday", "sunday"].includes(today)
    }

    private static readonly DAY_HEADERS_SE = Restaurant.WEEKDAYS_SE.map(
        day => new RegExp(`^${day}(?![a-zåäö])`, "i")
    );
    // the trailing class only admits times/punctuation, so a day-range dish
    // header like "Måndag–Fredag: Grönsakssoppa" is NOT treated as opening hours
    private static readonly OPENING_HOURS_RANGE_SE = new RegExp(
        `^(${Restaurant.WEEKDAYS_SE.join("|")})\\s*(till|[-–—])\\s*(${Restaurant.WEEKDAYS_SE.join("|")})[\\s0-9:.,–—-]*$`,
        "i"
    );

    /**
     * Matches a line that starts with a Swedish weekday (with or without a
     * trailing colon), e.g. "Måndag:  Biff ..." or "Tisdag  BBQ ...".
     * Returns the English day plus any menu text on the same line.
     */
    static matchDayHeader(line: string): { dayEn: string; rest: string } | null {
        for (let i = 0; i < Restaurant.DAY_HEADERS_SE.length; i++) {
            const match = Restaurant.DAY_HEADERS_SE[i].exec(line);
            if (match) {
                return {
                    dayEn: Restaurant.WEEKDAYS_EN[i],
                    rest: line.slice(match[0].length).replace(/^[:\s]+/, "").trim(),
                };
            }
        }
        return null;
    }

    /** Matches opening-hours ranges like "Måndag till Fredag 11-14". */
    static isOpeningHoursRange(line: string): boolean {
        return Restaurant.OPENING_HOURS_RANGE_SE.test(line);
    }

    static isValidSeDay(day: string): day is VALID_SE_DAYS {
        return (Restaurant.WEEKDAYS_SE as readonly string[]).includes(day);
    }

    static isValidEnDay(day: string): day is VALID_EN_DAYS {
        return (Restaurant.WEEKDAYS_EN as readonly string[]).includes(day);
    }
}