export interface DailyMenu {
    [day: string]: string[];
}

export interface RestaurantData {
    name: string;
    url: string;
    imageUrl: string;
    menu: DailyMenu;
    menuToday: string[];
    address?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}