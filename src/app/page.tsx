import RestaurantGrid from "@/components/restaurant/RestaurantGrid";
import Masthead from "@/components/layout/Masthead";
import { OliverTwist } from "@/lib/restaurant/oliver-twist";
import { Kvarnen } from "@/lib/restaurant/kvarnen";
import { BastardBurgers } from "@/lib/restaurant/bastard-burgers";
import { DeliDiLuca } from "@/lib/restaurant/deli-di-luca";
import { BiblioteketLive } from "@/lib/restaurant/biblioteket-live";
import { Bistroteket } from "@/lib/restaurant/bistroteket";
import { BlaDorren } from "@/lib/restaurant/bla-dorren";
import { Usine } from "@/lib/restaurant/usine";
import { Florentine } from "@/lib/restaurant/florentine";
import { Invece } from "@/lib/restaurant/invece";
import { shuffle } from "@/lib/utils";

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
        <div className="relative min-h-screen overflow-hidden">
            {/* ambient blob */}
            <div
                aria-hidden
                className="animate-drift pointer-events-none absolute -top-[120px] -right-[100px] h-[420px] w-[420px] rounded-full"
                style={{ background: "radial-gradient(circle, var(--blob), transparent 65%)" }}
            />
            {/* rotating asterisk */}
            <div
                aria-hidden
                className="animate-slowspin pointer-events-none absolute bottom-10 -left-[60px] font-serif text-[340px] leading-none text-hairline select-none"
            >
                *
            </div>

            <Masthead />

            <main className="relative">
                <RestaurantGrid restaurants={restaurants} />
            </main>
        </div>
    );
}
