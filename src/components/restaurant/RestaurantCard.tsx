import {Suspense} from 'react';
import {connection} from "next/server";
import {Restaurant} from '@/lib/restaurant/restaurant';
import {getMenuSnapshot} from "@/lib/restaurant/menu-cache";
import RestaurantCardError from "@/components/restaurant/RestaurantCardError";
import RestaurantCardSuccess from "./RestaurantCardSuccess";
import RestaurantEntry from "@/components/restaurant/RestaurantEntry";


interface RestaurantCardLoaderProps {
    name: string;
    num: string;
}

async function RestaurantCardLoader({name, num}: RestaurantCardLoaderProps) {
    const snapshot = await getMenuSnapshot(name);

    if (snapshot.error) {
        return (
            <RestaurantCardError
                num={num}
                name={snapshot.name}
                url={snapshot.url}
                didErrorMessage={snapshot.error}
            />
        );
    }

    // the menu is cached; which day is "today" is decided per request
    await connection();
    const menuToday = snapshot.menu[Restaurant.todayEn()] ?? [];

    return (
        <RestaurantCardSuccess
            num={num}
            name={snapshot.name}
            url={snapshot.url}
            additionalInformation={snapshot.additionalInformation}
            menuToday={menuToday}
            weeklyMenu={snapshot.weeklyMenu}
            totalDays={Object.keys(snapshot.menu).length}
            totalItems={Object.values(snapshot.menu).flat().length}
            menuImgUrl={snapshot.menuImgUrl}
            dailyMenu={snapshot.menu}
            address={snapshot.address}
            coordinates={snapshot.coordinates}
        />
    );
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

export default function RestaurantCard({name, index}: { name: string, index: number }) {
    const num = String(index).padStart(2, "0");
    return (
        <Suspense fallback={<RestaurantEntrySkeleton name={name} num={num}/>}>
            <RestaurantCardLoader name={name} num={num}/>
        </Suspense>
    );
}
