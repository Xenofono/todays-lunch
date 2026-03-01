import RestaurantGrid from "@/components/restaurant/RestaurantGrid";
import { OliverTwist } from "@/lib/restaurant/oliver-twist";
import { Kvarnen } from "@/lib/restaurant/kvarnen";
import {BastardBurgers} from "@/lib/restaurant/bastard-burgers";
import { DeliDiLuca } from "@/lib/restaurant/deli-di-luca";
import { BiblioteketLive } from "@/lib/restaurant/biblioteket-live";
import { Bistroteket } from "@/lib/restaurant/bistroteket";
import { BlaDorren } from "@/lib/restaurant/bla-dorren";
import { Usine } from "@/lib/restaurant/usine";
import { Florentine } from "@/lib/restaurant/florentine";
import { Invece } from "@/lib/restaurant/invece";
import {TypographyH1, TypographyLarge, TypographyP} from "@/lib/typography/Typography";
import { shuffle } from "@/lib/utils";
import {Info} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function Home() {

    const restaurants = shuffle([
        new OliverTwist(),
        new Kvarnen(),
        new BastardBurgers(),
        new DeliDiLuca(),
        new BiblioteketLive(),
        new Bistroteket(),
        new BlaDorren(),
        new Usine(),
        new Florentine(),
        new Invece()
    ]);
    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

            <div>
                <TypographyH1>Restaurant Menus</TypographyH1>
            </div>

            <Alert>
                <Info className="h-6 w-6" />
                <AlertTitle>
                    <TypographyLarge>News 2026-03-01</TypographyLarge></AlertTitle>
                <AlertDescription>
                    <TypographyP>Removed Boo (RIP) and added Florentine and Invece</TypographyP>
                </AlertDescription>
            </Alert>

            <RestaurantGrid restaurants={restaurants} />

        </main>
       
    </div>
  );
}
