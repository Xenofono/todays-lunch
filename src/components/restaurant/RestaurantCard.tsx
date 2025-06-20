import { Suspense } from 'react';
import { Restaurant } from '@/lib/restaurant/restaurant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, ExternalLink, DollarSign } from 'lucide-react';
import {RestaurantMenuFallback} from "@/components/restaurant/RestaurantMenuFallback";


interface RestaurantCardProps {
    restaurant: Restaurant;
}



async function RestaurantCardContent({ restaurant }: RestaurantCardProps) {
    try {
        await restaurant.update();

        const totalDays = Object.keys(restaurant.menu).length;
        const totalItems = Object.values(restaurant.menu).flat().length;

        return (
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow rounded-2xl text-foreground">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            {restaurant.name}
                            <Badge variant="success">
                                <CheckCircle className="w-3 h-3 mr-1"/>
                                Loaded
                            </Badge>
                        </CardTitle>
                    </div>
                    <CardDescription className="space-y-2 overflow-hidden">
                        <div className="flex gap-2">
                            <ExternalLink className="w-4 h-4"/>
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
                            <DollarSign className="w-4 h-4"/>
                            <span className="flex-1">{restaurant.additionalInformation}</span>
                        </div>}
                    </CardDescription>


                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Today's Menu */}
                    {restaurant.menuToday.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                🍽️ Today's Menu
                                <Badge variant="secondary">{restaurant.menuToday.length} items</Badge>
                            </h3>
                            <div className="space-y-1">
                                {restaurant.menuToday.map((item: string, index: number) => (
                                    <div
                                        key={index}
                                        className="text-accent-foreground/80 border-l-2 border-primary pl-3 py-1 bg-accent/30 rounded-r hover:bg-accent/50 transition-colors duration-200"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full Week Summary */}
                    {totalDays > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                📅 Full Week
                                <Badge variant="outline">{totalDays} days</Badge>
                                <Badge variant="outline">{totalItems} items</Badge>
                            </h3>

                            <details className="group">
                                <summary
                                    className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                                    View all days →
                                </summary>
                                <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                                    {Object.entries(restaurant.menu).map(([day, items]: [string, any]) => (
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
                            </details>
                        </div>
                    )}

                    <RestaurantMenuFallback totalDays={totalDays} menus={restaurant.menuToday} imgUrl={restaurant.menuImgUrl}/>
                </CardContent>
            </Card>
        );
    } catch (error) {
        return (
            <Card className="h-full border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {restaurant.name}
                        <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Failed
                        </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
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
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error instanceof Error ? error.message : 'Unknown error occurred'}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }
}

function RestaurantCardSkeleton({ name }: { name: string }) {
    return (
        <Card className="h-full animate-pulse">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {name}
                    <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1 animate-spin" />
                        Loading
                    </Badge>
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-48" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    return (
        <Suspense fallback={<RestaurantCardSkeleton name={restaurant.name} />}>
            <RestaurantCardContent restaurant={restaurant} />
        </Suspense>
    );
}