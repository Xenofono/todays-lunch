import RestaurantGrid from "@/components/restaurant/RestaurantGrid";
import { OliverTwist } from "@/lib/restaurant/oliver-twist";
import { Kvarnen } from "@/lib/restaurant/kvarnen";
import {BastardBurgers} from "@/lib/restaurant/bastard-burgers";
import { BooBurgers } from "@/lib/restaurant/boo-burgers";
import { DeliDiLuca } from "@/lib/restaurant/deli-di-luca";

export const revalidate = 14400;

export default async function Home() {

    const restaurants = [
        new OliverTwist(),
        new Kvarnen(),
        new BastardBurgers(),
        new BooBurgers(),
        new DeliDiLuca()
    ];
    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

            <div>
                <h1 className="text-3xl font-bold">Restaurant Menus</h1>
                <p className="text-lg">Calculated at {new Date().toLocaleString('sv-SE', {timeZone: 'Europe/Stockholm'})} Swedish time</p>
            </div>

            <RestaurantGrid restaurants={restaurants} />

        </main>
        
    </div>
  );
}
