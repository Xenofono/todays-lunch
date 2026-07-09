import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/lib/restaurant/restaurant';
import RestaurantSearchBar from "./RestaurantSearchBar";
import SelectRandom from "@/components/restaurant/SelectRandom";

interface RestaurantGridProps {
    restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {

    return (
        <div className="w-full">
            <div className="flex flex-col justify-between gap-6 px-6 pt-[18px] pb-2 sm:px-12 lg:flex-row lg:items-end">
                <RestaurantSearchBar/>
                <SelectRandom restaurantNames={restaurants.map(x => x.name)} />
            </div>

            <div className="grid items-start gap-x-9 gap-y-8 px-6 pt-5 pb-11 sm:px-12 md:grid-cols-2 md:gap-y-0 xl:grid-cols-3">
                {restaurants.map((restaurant, index) => (
                    <RestaurantCard key={restaurant.name} restaurant={restaurant} index={index + 1} />
                ))}
            </div>
        </div>
    );
}
