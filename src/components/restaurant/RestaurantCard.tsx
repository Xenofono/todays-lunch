import {Suspense} from 'react';
import {Restaurant} from '@/lib/restaurant/restaurant';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {CheckCircle, AlertCircle, Clock, ExternalLink, MessageCircleQuestion} from 'lucide-react';
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";
import RestaurantFullMenu from './RestaurantFullMenu';
import {TypographyH3, TypographyH4, TypographyLarge, TypographyMuted, TypographyP, TypographySmall} from '@/lib/typography/Typography';


interface RestaurantCardProps {
    restaurant: Restaurant;
}


async function RestaurantCardContent({restaurant}: RestaurantCardProps) {

        await restaurant.update();

        const totalDays = Object.keys(restaurant.menu).length;
        const totalItems = Object.values(restaurant.menu).flat().length;
        const didError = restaurant.didError
    

        return !didError
            ? (
                <Card
                    className="h-full shadow-lg hover:shadow-xl transition-shadow rounded-2xl text-foreground hover:bg-card/70">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <TypographyH3>{restaurant.name}</TypographyH3>
                                <Badge variant="success" className="flex">
                                    <CheckCircle className="w-3 h-3"/>
                                    <TypographySmall>Loaded</TypographySmall>
                                </Badge>
                            </CardTitle>
                        </div>
                        <CardDescription className="space-y-2 min-h-14 overflow-hidden">
                            <div className="flex gap-2">
                                <ExternalLink className="max-h-4 max-w-4"/>
                                <a
                                    href={restaurant.url}
                                    className="hover:underline truncate transition-colors duration-200 hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {restaurant.url}
                                </a>
                            </div>

                            {restaurant.additionalInformation && <div className="flex gap-2">
                                <MessageCircleQuestion className="max-w-4 max-h-4"/>
                                <TypographyMuted className="flex-1">{restaurant.additionalInformation}</TypographyMuted>
                            </div>}
                        </CardDescription>


                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Today's Menu */}
                        {restaurant.menuToday.length > 0 && (
                            <div>
                                <TypographyH4 className="flex items-center gap-2 mb-1">
                                    🍽️ Today's Menu
                                    <Badge variant="outline"><TypographyP>{restaurant.menuToday.length} items</TypographyP></Badge>
                                </TypographyH4>
                                <div className="space-y-1">
                                    {restaurant.menuToday.map((item: string, index: number) => (
                                        <TypographyP
                                            key={index}
                                            className="text-accent-foreground/80 border-l-2 border-primary pl-3 bg-accent/30 rounded-r hover:bg-accent/50 transition-colors duration-200"
                                        >
                                            {item}
                                        </TypographyP>
                                    ))}
                                </div>
                            </div>
                        )}

                        {totalDays > 0 && (
                            <RestaurantFullMenu menu={restaurant.menu} totalItems={totalItems} totalDays={totalDays}/>)}
                        <RestaurantMenuFallback totalDays={totalDays} menus={restaurant.menuToday}
                                                imgUrl={restaurant.menuImgUrl}/>

                    </CardContent>
                </Card>
            )
            : (
                <Card className="h-full border-destructive bg-destructive/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TypographyH3>{restaurant.name}</TypographyH3>
                            <Badge variant="destructive">
                                <AlertCircle className="w-3 h-3 mr-1"/>
                                Failed
                            </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4"/>
                            <a
                                href={restaurant.url}
                                className="hover:underline truncate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {restaurant.url}
                            </a>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>
                                <TypographyP>{didError}</TypographyP>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
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

    export default function RestaurantCard({restaurant}: RestaurantCardProps) {
        return (
            <Suspense fallback={<RestaurantCardSkeleton name={restaurant.name}/>}>
                <RestaurantCardContent restaurant={restaurant}/>
            </Suspense>
        );
    }