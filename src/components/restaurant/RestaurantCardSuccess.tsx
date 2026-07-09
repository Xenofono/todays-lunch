"use client"

import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import MapButton from "@/components/restaurant/MapButton";
import RestaurantEntry from "@/components/restaurant/RestaurantEntry";
import RestaurantFullMenu from "@/components/restaurant/RestaurantFullMenu";
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import {TypographyBody, TypographyEditorial} from "@/lib/typography/Typography";
import {cn, isMatch} from "@/lib/utils";

type RestaurantCardSuccessProps = {
    num: string
    name: string
    url: string
    additionalInformation: string | undefined
    menuToday: string[]
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
        const todayMatch = menuToday.some((item) => isMatch(item, q));
        const weeklyMatch = Object.values(dailyMenu ?? {}).flat().some((item) => isMatch(item, q));
        if (!(nameMatch || todayMatch || weeklyMatch)) return null;
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

            {menuToday.length > 0 && (
                <div className="mt-1 flex flex-col gap-[5px]">
                    {menuToday.map((item, index) => (
                        <TypographyBody
                            key={index}
                            className={cn(isMatch(item, q) && "text-primary underline underline-offset-[3px]")}
                        >
                            — {item}
                        </TypographyBody>
                    ))}
                </div>
            )}

            {totalDays > 0 && (
                <RestaurantFullMenu menu={dailyMenu} totalItems={totalItems} totalDays={totalDays}/>
            )}

            <RestaurantMenuFallback name={name} totalDays={totalDays} menus={menuToday} imgUrl={menuImgUrl}/>
        </RestaurantEntry>
    );
}

export default RestaurantCardSuccess
