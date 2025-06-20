import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/lib/restaurant/restaurant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import {TypographyLarge, TypographyP } from '@/lib/typography/Typography';

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

            {isWeekend && <Alert className="bg-amber-200">
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center gap-2">
                    <TypographyP>Menus on holidays and weekends may not appear properly</TypographyP>
                </AlertDescription>
            </Alert>}

            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.name} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}