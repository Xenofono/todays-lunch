import {Suspense} from 'react';
import {Restaurant} from '@/lib/restaurant/restaurant';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {CheckCircle, Clock, ExternalLink, MessageCircleQuestion} from 'lucide-react';
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import RestaurantFullMenu from './RestaurantFullMenu';
import {TypographyH3, TypographyH4, TypographyMuted, TypographyP, TypographySmall} from '@/lib/typography/Typography';
import RestaurantCardError from "@/components/restaurant/RestaurantCardError";
import RestaurantCardSuccess from "./RestaurantCardSuccess";


interface RestaurantCardLoaderProps {
    restaurant: Restaurant;
}


async function RestaurantCardLoader({restaurant}: RestaurantCardLoaderProps) {

    await restaurant.update();


    const dailyMenu = (restaurant.menu ?? {}) as Record<string, string[]>;
    const totalDays = Object.keys(restaurant.menu).length;
    const totalItems = Object.values(restaurant.menu).flat().length;
    const didError = restaurant.didError

    const props = {
        name: restaurant.name,
        url: restaurant.url,
        additionalInformation: restaurant.additionalInformation,
        menuToday: restaurant.menuToday ?? [],
        totalDays,
        totalItems,
        menuImgUrl: restaurant.menuImgUrl,
        dailyMenu,
    } satisfies React.ComponentProps<typeof RestaurantCardSuccess>;


    return !didError
        ? (
            <RestaurantCardSuccess {...props} />
        )
        : (
            <RestaurantCardError name={restaurant.name} url={restaurant.url} didErrorMessage={didError}/>
        )

}

function RestaurantCardSkeleton({name}: { name: string }) {
    return (
        <Card className="h-full animate-pulse">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TypographyH3>{name}</TypographyH3>
                    <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1 animate-spin"/>
                        Loading
                    </Badge>
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-48"/>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32"/>
                    <Skeleton className="h-3 w-full"/>
                    <Skeleton className="h-3 w-3/4"/>
                    <Skeleton className="h-3 w-1/2"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24"/>
                    <Skeleton className="h-3 w-16"/>
                </div>
            </CardContent>
        </Card>
    );
}

export default function RestaurantCard({restaurant}: RestaurantCardLoaderProps) {
    return (
        <Suspense fallback={<RestaurantCardSkeleton name={restaurant.name}/>}>
            <RestaurantCardLoader restaurant={restaurant}/>
        </Suspense>
    );
}