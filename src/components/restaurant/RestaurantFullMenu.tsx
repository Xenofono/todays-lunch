"use client"

import {DailyMenu} from "@/lib/types";
import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import {useState} from "react";
import {isMatch} from "@/lib/utils";
import DishList from "@/components/restaurant/DishList";
import {Button} from "@/components/ui/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

type props = {
    menu: DailyMenu
    totalDays: number
    totalItems: number
}

const RestaurantFullMenu = ({menu, totalDays, totalItems}: props) => {
    const q = useAtomValue(searchAtom);
    const [manualOpen, setManualOpen] = useState<boolean | null>(null);
    const [prevQ, setPrevQ] = useState(q);

    // a search hit inside the week auto-opens the panel; manual toggling wins until the query changes
    if (prevQ !== q) {
        setPrevQ(q);
        setManualOpen(null);
    }

    const weeklyMatch = !!q && Object.values(menu).flat().some((item) => isMatch(item, q));
    const open = manualOpen ?? weeklyMatch;

    return (
        <Collapsible open={open} onOpenChange={setManualOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="kicker" size="inline" className="mt-1.5">
                    FULL WEEK — {totalDays} DAYS · {totalItems} DISHES
                    <span aria-hidden className="text-[8px]">{open ? "▲" : "▼"}</span>
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2.5 flex flex-col gap-2.5 border-l-2 border-hairline pl-3">
                {Object.entries(menu).map(([day, items]) => (
                    <DishList key={day} items={items} heading={day} textClassName="text-[13px]"/>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

export default RestaurantFullMenu
