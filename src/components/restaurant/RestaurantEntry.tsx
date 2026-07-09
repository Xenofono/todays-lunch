"use client"

import {ReactNode} from "react";
import {useAtomValue} from "jotai";
import {randomizedRestaurantAtom} from "@/store/randomizer";
import {TypographyHeadline, TypographyKicker} from "@/lib/typography/Typography";
import {cn} from "@/lib/utils";

type RestaurantEntryProps = {
    num: string
    name: string
    url?: string
    headerExtra?: ReactNode
    children: ReactNode
}

/**
 * The newspaper "column entry" shell shared by the success, error and
 * skeleton cards: top rule, numbered serif header, winner wash + stamp,
 * and the dimming of losers while a randomized pick is active.
 */
const RestaurantEntry = ({num, name, url, headerExtra, children}: RestaurantEntryProps) => {
    const randomizedRestaurant = useAtomValue(randomizedRestaurantAtom);

    const isWinner = randomizedRestaurant === name;
    const isLoser = !!randomizedRestaurant && !isWinner;

    return (
        <article
            className={cn(
                "border-t border-border px-0.5 pt-4 pb-5 transition-all duration-300 hover:bg-wash",
                isWinner && "bg-primary/10",
                isLoser && "opacity-25"
            )}
        >
            <div className="mb-1 flex items-baseline gap-2.5">
                <TypographyKicker className="text-[11px] tracking-[.1em] text-primary">{num}</TypographyKicker>
                <TypographyHeadline>
                    {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-primary"
                        >
                            {name}
                        </a>
                    ) : name}
                </TypographyHeadline>
                {headerExtra}
            </div>

            {children}

            {isWinner && (
                <TypographyKicker className="mt-2.5 block text-primary">
                    ★ EDITORS&apos; CHOICE
                </TypographyKicker>
            )}
        </article>
    );
}

export default RestaurantEntry
