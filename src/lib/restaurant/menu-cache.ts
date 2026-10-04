import { cacheLife } from "next/cache";
import { DailyMenu } from "../types";
import { createRestaurant } from "./registry";

/** Everything a card needs from a scrape, as plain (cacheable) data. */
export type MenuSnapshot = {
    name: string
    url: string
    address?: string
    coordinates?: { lat: number; lng: number }
    menu: DailyMenu
    weeklyMenu: string[]
    additionalInformation?: string
    menuImgUrl?: string
    error?: string
}

/**
 * Scrapes one restaurant, cached per restaurant so page views don't hit the
 * restaurants' sites (and re-parse their PDFs) every time.
 *
 * Menus change at most daily, so a successful scrape is reused for 30 minutes
 * and refreshed in the background after that. A failed scrape is only kept
 * for a minute, so a site that was briefly down recovers on its own.
 */
export async function getMenuSnapshot(name: string): Promise<MenuSnapshot> {
    "use cache";

    const restaurant = createRestaurant(name);
    await restaurant.update();

    cacheLife(restaurant.didError
        ? { stale: 0, revalidate: 60, expire: 300 }
        : { stale: 300, revalidate: 30 * 60, expire: 24 * 60 * 60 });

    return {
        name: restaurant.name,
        url: restaurant.url,
        address: restaurant.address,
        coordinates: restaurant.coordinates,
        menu: restaurant.menu,
        weeklyMenu: restaurant.weeklyMenu,
        additionalInformation: restaurant.additionalInformation,
        menuImgUrl: restaurant.menuImgUrl,
        error: restaurant.didError,
    };
}
