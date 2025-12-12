import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/lib/restaurant/restaurant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import {TypographyLarge, TypographyP } from '@/lib/typography/Typography';
import RestaurantSearchBar from "./RestaurantSearchBar";
import SelectRandom from "@/components/restaurant/SelectRandom";

interface RestaurantGridProps {
    restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
    
    const isWeekend = Restaurant.isWeekend()
    
    return (
        <div className="w-full max-w-7xl space-y-6">
            <Alert>
                <Info className="h-6 w-6" />
                <AlertTitle>
                    <TypographyLarge>Loading <Badge variant="secondary">{restaurants.length}</Badge> restaurants</TypographyLarge></AlertTitle>
                <AlertDescription className="flex items-center gap-2">
                    <TypographyP>Loading restaurants {restaurants.map(x => (<Badge key={x.name} className="m-1">{x.name}</Badge>))}</TypographyP>
                </AlertDescription>
            </Alert>

            <Alert className="bg-warning">
                <Info className="h-4 w-4 " color="black" />
                <AlertDescription className=" flex flex-col text-black">
                    <TypographyP>
                        {isWeekend && "Menus on holidays and weekends may be wonky. "}
                        Menus depend on the restaurant keeping their menu up to date and on the same place.
                    </TypographyP>
                </AlertDescription>
            </Alert>
            <RestaurantSearchBar/>
            <SelectRandom restaurantNames={restaurants.map(x => x.name)} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.name} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}