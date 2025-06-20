"use client"

import {Badge} from "@/components/ui/badge";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DailyMenu} from "@/lib/types";

type props = {
    menu: DailyMenu
    totalDays: number
    totalItems: number
}

const RestaurantFullMenu = ({menu, totalDays, totalItems}: props) => {
    
    
    
    return  <div>
        <h3 className="font-semibold flex items-center gap-2">
            📅 Full Week
            <Badge variant="outline">{totalDays} days</Badge>
            <Badge variant="outline">{totalItems} items</Badge>
        </h3>

        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>View all days</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                        {Object.entries(menu).map(([day, items]: [string, any]) => (
                            <div key={day}
                                 className="bg-accent/20 p-3 rounded hover:bg-accent/40 transition-colors duration-200">
                                <h4 className="font-medium capitalize text-primary">{day}</h4>
                                <div className="space-y-1 mt-1">
                                    {items.map((item: string, index: number) => (
                                        <div key={index}
                                             className="text-sm text-accent-foreground/80 hover:scale-105">
                                            • {item}
                                        </div>
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