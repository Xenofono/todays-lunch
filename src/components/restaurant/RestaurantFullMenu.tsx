"use client"

import {DailyMenu} from "@/lib/types";
import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import {useId, useState} from "react";
import {TypographyBody, TypographyKicker} from "@/lib/typography/Typography";
import {cn, isMatch} from "@/lib/utils";

type props = {
    menu: DailyMenu
    totalDays: number
    totalItems: number
}

const RestaurantFullMenu = ({menu, totalDays, totalItems}: props) => {
    const q = useAtomValue(searchAtom);
    const panelId = useId();
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
        <div>
            <button
                onClick={() => setManualOpen(!open)}
                aria-expanded={open}
                aria-controls={panelId}
                className="mt-3 flex cursor-pointer items-center gap-2 bg-transparent p-0 text-muted-foreground transition-colors hover:text-primary"
            >
                <TypographyKicker>
                    FULL WEEK — {totalDays} DAYS · {totalItems} DISHES
                </TypographyKicker>
                <span aria-hidden className="text-[8px]">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div id={panelId} className="mt-2.5 flex flex-col gap-2.5 border-l-2 border-hairline pl-3">
                    {Object.entries(menu).map(([day, items]) => (
                        <div key={day}>
                            <TypographyKicker className="mb-1 block text-[10.5px] text-primary uppercase">
                                {day}
                            </TypographyKicker>
                            <div className="flex flex-col gap-[3px]">
                                {items.map((item, index) => (
                                    <TypographyBody
                                        key={index}
                                        className={cn(
                                            "text-[13px]",
                                            isMatch(item, q) && "text-primary underline underline-offset-[3px]"
                                        )}
                                    >
                                        {item}
                                    </TypographyBody>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RestaurantFullMenu
