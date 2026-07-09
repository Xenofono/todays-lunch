import {Suspense} from 'react';
import {Restaurant} from '@/lib/restaurant/restaurant';
import RestaurantCardError from "@/components/restaurant/RestaurantCardError";
import RestaurantCardSuccess from "./RestaurantCardSuccess";
import RestaurantEntry from "@/components/restaurant/RestaurantEntry";


interface RestaurantCardLoaderProps {
    restaurant: Restaurant;
    num: string;
}

async function RestaurantCardLoader({restaurant, num}: RestaurantCardLoaderProps) {

    await restaurant.update();


    const dailyMenu = (restaurant.menu ?? {}) as Record<string, string[]>;
    const totalDays = Object.keys(restaurant.menu).length;
    const totalItems = Object.values(restaurant.menu).flat().length;
    const didError = restaurant.didError

    const props = {
        num,
        name: restaurant.name,
        url: restaurant.url,
        additionalInformation: restaurant.additionalInformation,
        menuToday: restaurant.menuToday ?? [],
        totalDays,
        totalItems,
        menuImgUrl: restaurant.menuImgUrl,
        dailyMenu,
        address: restaurant.address,
        coordinates: restaurant.coordinates,
    } satisfies React.ComponentProps<typeof RestaurantCardSuccess>;


    return !didError
        ? (
            <RestaurantCardSuccess {...props} />
        )
        : (
            <RestaurantCardError
                num={num}
                name={restaurant.name}
                url={restaurant.url}
                didErrorMessage={didError}
            />
        )

}

function RestaurantEntrySkeleton({name, num}: { name: string, num: string }) {
    return (
        <RestaurantEntry num={num} name={name}>
            <div className="mt-3 animate-pulse space-y-2.5">
                <div className="h-3 w-full bg-hairline"/>
                <div className="h-3 w-3/4 bg-hairline"/>
                <div className="h-3 w-1/2 bg-hairline"/>
            </div>
        </RestaurantEntry>
    );
}

export default function RestaurantCard({restaurant, index}: { restaurant: Restaurant, index: number }) {
    const num = String(index).padStart(2, "0");
    return (
        <Suspense fallback={<RestaurantEntrySkeleton name={restaurant.name} num={num}/>}>
            <RestaurantCardLoader restaurant={restaurant} num={num}/>
        </Suspense>
    );
}
