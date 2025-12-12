"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TypographyH3, TypographyH4, TypographyMuted, TypographyP, TypographySmall} from "@/lib/typography/Typography";
import {Badge} from "@/components/ui/badge";
import {CheckCircle, ExternalLink, MessageCircleQuestion} from "lucide-react";
import RestaurantFullMenu from "@/components/restaurant/RestaurantFullMenu";
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import {randomizedRestaurantAtom} from "@/store/randomizer";

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
}

const RestaurantCardSuccess = ({
                                   name,
                                   url,
                                   additionalInformation,
                                   menuToday,
                                   totalDays,
                                   totalItems,
                                   menuImgUrl,
                                   dailyMenu
                               }: RestaurantCardSuccessProps) => {
    const q = useAtomValue(searchAtom);
    const randomizedRestaurant = useAtomValue(randomizedRestaurantAtom);

    if(randomizedRestaurant && randomizedRestaurant !== name) return null;

    if (q) {
        const queryLower = q.toLowerCase()

        const nameMatch = name.toLowerCase().includes(queryLower);

        const todayMatch =
            Array.isArray(menuToday) && menuToday.some((i) => i.toLowerCase().includes(queryLower));

        const weeklyItems = Object.values(dailyMenu ?? {}).flat();
        const weeklyMatch = weeklyItems.some((i) => i.toLowerCase().includes(queryLower));

        if (!(nameMatch || todayMatch || weeklyMatch)) {
            return null;
        }
    }

    return (<Card
        className="shadow-lg hover:shadow-xl transition-shadow rounded-2xl text-foreground hover:bg-card/70 xs:w-[26rem] min-h-[32rem]">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <TypographyH3>{name}</TypographyH3>
                    <Badge variant="success" className="flex">
                        <CheckCircle className="w-3 h-3"/>
                        <TypographySmall>Loaded</TypographySmall>
                    </Badge>
                </CardTitle>
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

                {additionalInformation && <div className="flex gap-2">
                    <MessageCircleQuestion className="max-w-4 max-h-4"/>
                    <TypographyMuted className="flex-1">{additionalInformation}</TypographyMuted>
                </div>}
            </CardDescription>


        </CardHeader>

        <CardContent className="space-y-8">
            {menuToday.length > 0 && (
                <div>
                    <TypographyH4 className="flex items-center gap-2 mb-1">
                        🍽️ Today's Menu
                        <Badge variant="outline"><TypographyP>{menuToday.length} items</TypographyP></Badge>
                    </TypographyH4>
                    <div className="space-y-1">
                        {menuToday.map((item: string, index: number) => (
                            <TypographyP
                                key={index}
                                className="text-accent-foreground/80 border-l-2 border-primary pl-3 bg-accent/30 rounded-r hover:bg-accent/50 transition-colors duration-200"
                            >
                                {item}
                            </TypographyP>
                        ))}
                    </div>
                </div>
            )}

            {totalDays > 0 && (
                <RestaurantFullMenu menu={dailyMenu} totalItems={totalItems} totalDays={totalDays}/>)}
            <RestaurantMenuFallback totalDays={totalDays} menus={menuToday}
                                    imgUrl={menuImgUrl}/>

        </CardContent>
    </Card>)
}

export default RestaurantCardSuccess