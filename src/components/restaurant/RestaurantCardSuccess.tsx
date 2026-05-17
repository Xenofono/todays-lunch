"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TypographyH3, TypographyH4, TypographyMuted, TypographyP} from "@/lib/typography/Typography";
import {Badge} from "@/components/ui/badge";
import {ExternalLink, MessageCircleQuestion} from "lucide-react";
import RestaurantFullMenu from "@/components/restaurant/RestaurantFullMenu";
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import {randomizedRestaurantAtom} from "@/store/randomizer";
import MapButton from "@/components/restaurant/MapButton";
import {useEffect, useRef, useState} from "react";

type RestaurantCardSuccessProps = {
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

function isMatch(text: string, query: string) {
    return query ? text.toLowerCase().includes(query.toLowerCase()) : false;
}

const RestaurantCardSuccess = ({
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
    const randomizedRestaurant = useAtomValue(randomizedRestaurantAtom);
    const [isJustPicked, setIsJustPicked] = useState(false);
    const prevRandomized = useRef(randomizedRestaurant);

    useEffect(() => {
        if (randomizedRestaurant === name && prevRandomized.current !== name) {
            setIsJustPicked(true);
            const t = setTimeout(() => setIsJustPicked(false), 700);
            return () => clearTimeout(t);
        }
        prevRandomized.current = randomizedRestaurant;
    }, [randomizedRestaurant, name]);

    if (randomizedRestaurant && randomizedRestaurant !== name) return null;

    if (q) {
        const queryLower = q.toLowerCase()
        const nameMatch = name.toLowerCase().includes(queryLower);
        const todayMatch = Array.isArray(menuToday) && menuToday.some((i) => i.toLowerCase().includes(queryLower));
        const weeklyItems = Object.values(dailyMenu ?? {}).flat();
        const weeklyMatch = weeklyItems.some((i) => i.toLowerCase().includes(queryLower));
        if (!(nameMatch || todayMatch || weeklyMatch)) return null;
    }

    return (
        <Card className={`shadow-lg hover:shadow-xl transition-all rounded-2xl text-foreground hover:bg-card/70 xs:w-[26rem] min-h-[32rem] ${isJustPicked ? "animate-in zoom-in-95 fade-in duration-500" : ""}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TypographyH3>{name}</TypographyH3>
                        {menuToday.length > 0 && (
                            <Badge variant="secondary">{menuToday.length} dishes today</Badge>
                        )}
                    </CardTitle>
                    <MapButton name={name} address={address} coordinates={coordinates} />
                </div>
                <CardDescription className="space-y-2 min-h-14 overflow-hidden">
                    <div className="flex gap-2">
                        <ExternalLink className="max-h-4 max-w-4"/>
                        <a
                            href={url}
                            className="hover:underline truncate transition-colors duration-200 hover:text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {url}
                        </a>
                    </div>
                    {additionalInformation && (
                        <div className="flex gap-2">
                            <MessageCircleQuestion className="max-w-4 max-h-4"/>
                            <TypographyMuted className="flex-1">{additionalInformation}</TypographyMuted>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
                {menuToday.length > 0 && (
                    <div>
                        <TypographyH4 className="flex items-center gap-2 mb-3">
                            🍽️ Today's Menu
                        </TypographyH4>
                        <div className="flex flex-wrap gap-2 overflow-hidden">
                            {menuToday.map((item: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant={isMatch(item, q) ? "success" : "secondary"}
                                    size="menuItem"
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {totalDays > 0 && (
                    <RestaurantFullMenu menu={dailyMenu} totalItems={totalItems} totalDays={totalDays}/>
                )}
                <RestaurantMenuFallback totalDays={totalDays} menus={menuToday} imgUrl={menuImgUrl}/>
            </CardContent>
        </Card>
    );
}

export default RestaurantCardSuccess