"use client"

import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import MapButton from "@/components/restaurant/MapButton";
import RestaurantEntry from "@/components/restaurant/RestaurantEntry";
import DishList from "@/components/restaurant/DishList";
import RestaurantFullMenu from "@/components/restaurant/RestaurantFullMenu";
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import {TypographyEditorial} from "@/lib/typography/Typography";
import {isMatch} from "@/lib/utils";

type RestaurantCardSuccessProps = {
    num: string
    name: string
    url: string
    additionalInformation: string | undefined
    menuToday: string[]
    weeklyMenu: string[]
    totalDays: number
    totalItems: number
    menuImgUrl: string | undefined
    dailyMenu: {
        [day: string]: string[]
    }
    address?: string
    coordinates?: {
        lat: number
        lng: number
    }
}

const RestaurantCardSuccess = ({
                                   num,
                                   name,
                                   url,
                                   additionalInformation,
                                   menuToday,
                                   weeklyMenu,
                                   totalDays,
                                   totalItems,
                                   menuImgUrl,
                                   dailyMenu,
                                   address,
                                   coordinates
                               }: RestaurantCardSuccessProps) => {
    const q = useAtomValue(searchAtom);

    if (q) {
        const nameMatch = isMatch(name, q);
        const match = (item: string) => isMatch(item, q);
        const menuMatch = Object.values(dailyMenu ?? {}).some((items) => items.some(match)) || weeklyMenu.some(match);
        if (!(nameMatch || menuMatch)) return null;
    }

    return (
        <RestaurantEntry
            num={num}
            name={name}
            url={url}
            headerExtra={<MapButton name={name} address={address} coordinates={coordinates}/>}
        >
            {additionalInformation && (
                <TypographyEditorial className="mb-2 ml-[21px] text-[12.5px] leading-normal">
                    {additionalInformation}
                </TypographyEditorial>
            )}

            {(menuToday.length > 0 || weeklyMenu.length > 0) && (
                <div className="mt-1 flex flex-col gap-3.5">
                    {menuToday.length > 0 && (
                        <DishList items={menuToday} heading={weeklyMenu.length > 0 ? "Today" : undefined}/>
                    )}
                    {weeklyMenu.length > 0 && (
                        <DishList
                            items={weeklyMenu}
                            heading={totalDays > 0 ? "All week" : "Weekly menu — same all week, Mon–Fri"}
                        />
                    )}
                </div>
            )}

            {totalDays > 0 && (
                <RestaurantFullMenu menu={dailyMenu} totalItems={totalItems} totalDays={totalDays}/>
            )}

            <RestaurantMenuFallback name={name} totalDays={totalDays} menus={[...menuToday, ...weeklyMenu]} imgUrl={menuImgUrl}/>
        </RestaurantEntry>
    );
}

export default RestaurantCardSuccess
