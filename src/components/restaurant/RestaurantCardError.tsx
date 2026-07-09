"use client"

import {useAtomValue} from "jotai";
import {searchAtom} from "@/store/search";
import RestaurantEntry from "@/components/restaurant/RestaurantEntry";
import {TypographyBody, TypographyEditorial} from "@/lib/typography/Typography";
import {isMatch} from "@/lib/utils";

type RestaurantCardErrorProps = {
    num: string,
    name: string,
    url: string,
    didErrorMessage: string | undefined
}

const RestaurantCardError = ({num, name, url, didErrorMessage}: RestaurantCardErrorProps) => {
    const q = useAtomValue(searchAtom);

    if (q && !isMatch(name, q)) return null;

    return (
        <RestaurantEntry num={num} name={name} url={url}>
            <TypographyEditorial className="mt-2 text-destructive">
                Press error — could not reach the source.
            </TypographyEditorial>
            {didErrorMessage && (
                <TypographyBody className="mt-1.5 text-[12px] break-words text-muted-foreground">
                    {didErrorMessage}
                </TypographyBody>
            )}
        </RestaurantEntry>
    )
}

export default RestaurantCardError
