import { Suspense } from "react";
import { connection } from "next/server";
import RestaurantGrid from "@/components/restaurant/RestaurantGrid";
import Masthead from "@/components/layout/Masthead";
import { restaurantNames } from "@/lib/restaurant/registry";
import { shuffle } from "@/lib/utils";

// today's date (masthead) and the shuffled column order are per request;
// the menus themselves are cached per restaurant (see menu-cache.ts)
async function Edition() {
    await connection();
    return (
        <>
            <Masthead />
            <main className="relative">
                <RestaurantGrid restaurantNames={shuffle(restaurantNames())} />
            </main>
        </>
    );
}

export default function Home() {
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

            <Suspense>
                <Edition />
            </Suspense>
        </div>
    );
}
