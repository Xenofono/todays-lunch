import {DailyMenu} from "@/lib/types";

type VALID_SE_DAYS = typeof Restaurant.WEEKDAYS_SE[number]
type VALID_EN_DAYS = typeof Restaurant.WEEKDAYS_EN[number]

export abstract class Restaurant {
    static readonly WEEKDAYS_EN = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
    static readonly WEEKDAYS_SE = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"] as const;
    static readonly MENU_TIME = 3600000; // 1 hour in milliseconds
    static _debugDay: string | undefined = undefined; // override day name for testing

    private _currentMenu: DailyMenu = {};
    private _menuFrom: number = -Restaurant.MENU_TIME;
    private _name: string;
    protected _url: string;
    private _imageUrl: string;
    private _updating: boolean = false;
    private _didError: string | undefined = undefined
    protected _additionalInformation: string | undefined = undefined;
    protected _menuImgUrl: string | undefined = undefined;
    private _address: string | undefined = undefined;
    private _coordinates: { lat: number; lng: number } | undefined = undefined;

    constructor(name: string, url: string, imageUrl: string = "", address?: string, coordinates?: { lat: number; lng: number }) {
        this._name = name;
        this._url = url;
        this._imageUrl = imageUrl;
        this._address = address;
        this._coordinates = coordinates;
    }

    async update(): Promise<void> {
        if (this._updating) return;

        try {
            const currentTime = Date.now();
            if (currentTime > (this._menuFrom + Restaurant.MENU_TIME)) {
                console.log(`Updating restaurant menu: ${this._name}`);
                this._updating = true;
                this._currentMenu = await this._getMenu();
                this._menuFrom = currentTime;
            }
        } catch (error) {
            console.error(`ERROR: Failed to update restaurant menu (${this._name}):`, error instanceof Error ? error.message : 'Unknown error');
            this._didError = `ERROR: Failed to update restaurant menu (${this._name}): ${error instanceof Error ? error.message : 'Unknown error'}`
        } finally {
            this._updating = false;
        }
    }
    
    get didError(): string | undefined {
        return this._didError
    }

    get menu(): DailyMenu {
        return this._currentMenu;
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

    get imageUrl(): string {
        return this._imageUrl;
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