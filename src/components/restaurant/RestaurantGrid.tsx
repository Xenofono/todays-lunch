import { Suspense } from 'react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/lib/restaurant/restaurant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface RestaurantGridProps {
    restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
    
    const isWeekend = Restaurant.isWeekend()
    
    return (
        <div className="w-full max-w-7xl space-y-6">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Loading <Badge variant="secondary">{restaurants.length}</Badge> restaurants.</AlertTitle>
                <AlertDescription className="flex items-center gap-2">
                    Loading restaurants {restaurants.map(x => x.name).join(", ")}.
                    Each will appear when ready.
                </AlertDescription>
            </Alert>

            {isWeekend && <Alert className="bg-amber-200">
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center gap-2">
                    Menus on holidays and weekends may not appear properly
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