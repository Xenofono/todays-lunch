import {RestaurantData} from "@/lib/types";
import {Restaurant} from "@/lib/restaurant/restaurant";

export class RestaurantManager {
    private restaurants: Restaurant[] = [];

    addRestaurant(restaurant: Restaurant): void {
        this.restaurants.push(restaurant);
    }

    async updateAll(): Promise<void> {
        console.log(`Updating ${this.restaurants.length} restaurants...`);

        const promises = this.restaurants.map(restaurant => restaurant.update());
        await Promise.allSettled(promises);

        console.log('All restaurants updated');
    }

    getAllMenus(): RestaurantData[] {
        return this.restaurants.map(restaurant => ({
            name: restaurant.name,
            url: restaurant.url,
            imageUrl: restaurant.imageUrl,
            menu: restaurant.menu,
            menuToday: restaurant.menuToday
        }));
    }

    getRestaurant(name: string): Restaurant | undefined {
        return this.restaurants.find(r => r.name === name);
    }

    get restaurantCount(): number {
        return this.restaurants.length;
    }
}