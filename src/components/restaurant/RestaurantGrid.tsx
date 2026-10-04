import RestaurantCard from './RestaurantCard';
import RestaurantSearchBar from "./RestaurantSearchBar";
import SelectRandom from "@/components/restaurant/SelectRandom";

interface RestaurantGridProps {
    restaurantNames: string[];
}

export default function RestaurantGrid({ restaurantNames }: RestaurantGridProps) {

    return (
        <div className="w-full">
            <div className="flex flex-col justify-between gap-6 px-6 pt-[18px] pb-2 sm:px-12 lg:flex-row lg:items-end">
                <RestaurantSearchBar/>
                <SelectRandom restaurantNames={restaurantNames} />
            </div>

            <div className="px-6 pt-5 pb-11 sm:px-12">
                <div className="relative grid items-start gap-x-9 gap-y-8 md:grid-cols-2 md:gap-y-0 xl:grid-cols-3">
                    {/* hairline column rules, centred in the 36px gutters (2 columns at md, 3 at xl) */}
                    <div className="absolute inset-y-0 hidden w-px bg-hairline md:block md:left-1/2 xl:left-[calc(100%/3-6px)]"/>
                    <div className="absolute inset-y-0 left-[calc(200%/3+6px)] hidden w-px bg-hairline xl:block"/>

                    {restaurantNames.map((name, index) => (
                        <RestaurantCard key={name} name={name} index={index + 1} />
                    ))}
                </div>
            </div>
        </div>
    );
}
