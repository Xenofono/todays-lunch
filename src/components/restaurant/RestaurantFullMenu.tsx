"use client"

import {Badge} from "@/components/ui/badge";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DailyMenu} from "@/lib/types";
import { TypographyH4, TypographyLarge, TypographyP, TypographySmall } from "@/lib/typography/Typography";

type props = {
    menu: DailyMenu
    totalDays: number
    totalItems: number
}

const RestaurantFullMenu = ({menu, totalDays, totalItems}: props) => {
    
    
    return  <div>
        <TypographyH4 className="font-semibold flex items-center gap-2">
                📅 Full Week
            <Badge variant="outline"><TypographyP>{totalDays} days</TypographyP></Badge>
            <Badge variant="outline"><TypographyP>{totalItems} items</TypographyP></Badge>
        </TypographyH4>

        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger><TypographyLarge>View all days</TypographyLarge></AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                        {Object.entries(menu).map(([day, items]: [string, any]) => (
                            <div key={day}
                                 className="bg-accent/20 p-3 rounded">
                                <h4 className="font-medium capitalize text-primary">{day}</h4>
                                <div className="space-y-2 mt-1">
                                    {items.map((item: string, index: number) => (
                                        <TypographySmall key={index}
                                             className="block text-accent-foreground/80 border-l-2 border-primary pl-3 py-2 bg-success/10">
                                            {item}
                                        </TypographySmall>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>

    </div>
}

export default RestaurantFullMenu