import RestaurantGrid from "@/components/restaurant/RestaurantGrid";
import { OliverTwist } from "@/lib/restaurant/oliver-twist";
import { Kvarnen } from "@/lib/restaurant/kvarnen";
import {BastardBurgers} from "@/lib/restaurant/bastard-burgers";
import { BooBurgers } from "@/lib/restaurant/boo-burgers";
import { DeliDiLuca } from "@/lib/restaurant/deli-di-luca";
import { BiblioteketLive } from "@/lib/restaurant/biblioteket-live";
import { Bistroteket } from "@/lib/restaurant/bistroteket";
import { BlaDorren } from "@/lib/restaurant/bla-dorren";
import { Usine } from "@/lib/restaurant/usine";
import { TypographyH1, TypographyP } from "@/lib/typography/Typography";

export const dynamic = 'force-dynamic';

export default async function Home() {

    const restaurants = [
        new OliverTwist(),
        new Kvarnen(),
        new BastardBurgers(),
        new BooBurgers(),
        new DeliDiLuca(),
        new BiblioteketLive(),
        new Bistroteket(),
        new BlaDorren(),
        new Usine()
    ];
    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

            <div>
                <TypographyH1>Restaurant Menus</TypographyH1>
                <TypographyP>Calculated at {new Date().toLocaleString('sv-SE', {timeZone: 'Europe/Stockholm'})} Swedish time</TypographyP>
            </div>

            <RestaurantGrid restaurants={restaurants} />

        </main>
        
    </div>
  );
}
