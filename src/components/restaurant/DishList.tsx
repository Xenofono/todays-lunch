"use client"

import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import {splitDish} from "@/lib/dish";
import {TypographyBody, TypographyKicker} from "@/lib/typography/Typography";
import {cn, isMatch} from "@/lib/utils";

type DishListProps = {
    items: string[]
    heading?: string
    textClassName?: string
}

/**
 * Dish lines for a column entry, under an optional section kicker. Each dish
 * is its own row, set off from the next by a dashed hairline, so long
 * multi-line dishes don't run together.
 */
const DishList = ({items, heading, textClassName}: DishListProps) => {
    const q = useAtomValue(searchAtom);

    return (
        <div>
            {heading && (
                <TypographyKicker className="mb-1.5 block text-[10.5px] text-primary uppercase">{heading}</TypographyKicker>
            )}
            <ul className="flex flex-col">
                {items.map((item, index) => {
                    const {label, name, text, price} = splitDish(item);
                    const match = isMatch(item, q);
                    return (
                        <li
                            key={index}
                            className="flex items-baseline gap-3 border-t border-dashed border-hairline py-[7px] first:border-t-0 first:pt-0 last:pb-0"
                        >
                            <div className="min-w-0 flex-1">
                                {label && (
                                    <TypographyKicker className="mb-1 block text-[9.5px] text-primary">{label}</TypographyKicker>
                                )}
                                <TypographyBody
                                    className={cn(
                                        "leading-snug",
                                        textClassName,
                                        match && "text-primary underline underline-offset-[3px]"
                                    )}
                                >
                                    {name && <span className="font-semibold">{name} </span>}
                                    {name ? <span className={cn(!match && "text-muted-foreground")}>{text}</span> : text}
                                </TypographyBody>
                            </div>
                            {price && (
                                <TypographyKicker className="shrink-0 tracking-[.08em] whitespace-nowrap text-muted-foreground">
                                    {price}
                                </TypographyKicker>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default DishList
