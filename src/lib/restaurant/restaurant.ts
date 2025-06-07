import {DailyMenu} from "@/lib/types";

export abstract class Restaurant {
    static readonly WEEKDAYS_EN = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
    static readonly WEEKDAYS_SE = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"] as const;
    static readonly MENU_TIME = 3600000; // 1 hour in milliseconds

    private _currentMenu: DailyMenu = {};
    private _menuFrom: number = -Restaurant.MENU_TIME;
    private _name: string;
    protected _url: string;
    private _imageUrl: string | undefined;
    private _updating: boolean = false;

    constructor(name: string, url: string, imageUrl: string = "") {
        this._name = name;
        this._url = url;
        this._imageUrl = imageUrl;
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
        } finally {
            this._updating = false;
        }
    }

    get menu(): DailyMenu {
        return this._currentMenu;
    }

    get menuToday(): string[] {
        const weekday = new Date().getDay();
        const day = Restaurant.WEEKDAYS_EN[weekday === 0 ? 6 : weekday - 1]; 
        return this.menu[day] || [];
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get imageUrl(): string | undefined {
        return this._imageUrl;
    }
    
    protected abstract _getMenu(): Promise<DailyMenu>;

    static todayEn(): string {
        const weekday = new Date().getDay();
        return Restaurant.WEEKDAYS_EN[weekday === 0 ? 6 : weekday - 1];
    }

    static todaySe(): string {
        const weekday = new Date().getDay();
        return Restaurant.WEEKDAYS_SE[weekday === 0 ? 6 : weekday - 1];
    }
    
    static daySvToEn (day: string): string {
        const idx = Restaurant.WEEKDAYS_SE.findIndex(x => x === day)
        return Restaurant.WEEKDAYS_EN[idx]
    }
}