"use client"

import Image from 'next/image'
import {Dialog, DialogContent, DialogHeaderRow, DialogTrigger} from "@/components/ui/dialog";
import {TypographyEditorial, TypographyKicker} from "@/lib/typography/Typography";


export function RestaurantMenuFallback(props: { name: string, totalDays: number, menus: string[], imgUrl: string | undefined }) {

    if (props.imgUrl) {

        return (
            <div className="mt-2 border border-hairline p-3.5">
                <div className="mb-2.5 h-[84px] overflow-hidden border border-dashed border-hairline">
                    <Image
                        src={props.imgUrl}
                        alt={`${props.name} menu`}
                        width={400}
                        height={84}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex items-center justify-between gap-2.5">
                    <TypographyEditorial className="text-[12.5px] leading-snug">
                        Prints their menu as an image only.
                    </TypographyEditorial>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="cursor-pointer border border-foreground bg-transparent px-3 py-2 whitespace-nowrap text-foreground transition-colors hover:bg-foreground hover:text-background">
                                <TypographyKicker className="tracking-[.14em]">VIEW MENU IMAGE</TypographyKicker>
                            </button>
                        </DialogTrigger>
                        <DialogContent
                            className="max-h-[98vh] w-[98vw] max-w-[98vw] gap-0 overflow-y-auto p-3 sm:w-fit sm:max-w-[95vw] sm:p-6"
                            showCloseButton={false}
                            aria-describedby={undefined}
                        >
                            <DialogHeaderRow title={`${props.name} — the menu`} className="mb-3 px-1 sm:px-0"/>
                            <Image
                                src={props.imgUrl}
                                alt={`${props.name} menu`}
                                width={1240}
                                height={1754}
                                className="mx-auto h-auto w-full sm:max-h-[86vh] sm:w-auto sm:max-w-full"
                                priority
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    if (props.totalDays === 0 && props.menus.length === 0) {
        return (
            <TypographyEditorial className="mt-2">
                No menu at press time — did the kitchen move their page, or are they just lazy this week?
            </TypographyEditorial>
        );
    }

    return null;
}
