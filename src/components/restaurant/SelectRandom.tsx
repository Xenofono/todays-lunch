"use client"

import {useResetAtom} from "jotai/utils";
import {randomizedRestaurantAtom} from "@/store/randomizer";
import {useAtom} from "jotai";
import {useEffect, useRef, useState} from "react";
import {TypographyEditorial, TypographyHeadline, TypographyKicker} from "@/lib/typography/Typography";
import {cn} from "@/lib/utils";

const POOH_GIF = "https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUya2dxb2p1eTF0em1zbDBwa21zbXBrNGZxbWhwOHhxaWUwMWU2eGVydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DAUiUaCVfBTFe/200w.gif";

const SPIN_STEPS = 30;

type Props = {
    restaurantNames: string[]
}

const SelectRandom = ({restaurantNames}: Props) => {
    const [randomizedRestaurant, setRandomizedRestaurant] = useAtom(randomizedRestaurantAtom)
    const resetRandomizedRestaurant = useResetAtom(randomizedRestaurantAtom)
    const [spinning, setSpinning] = useState(false);
    const [slotText, setSlotText] = useState<string | undefined>(undefined);
    const [showOverlay, setShowOverlay] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const pending = timers;
        return () => pending.current.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (!showOverlay) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowOverlay(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showOverlay]);

    const spin = () => {
        if (spinning || restaurantNames.length === 0) return;
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setSpinning(true);
        resetRandomizedRestaurant();
        setShowOverlay(false);

        const winner = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
        const offset = Math.floor(Math.random() * restaurantNames.length);

        const step = (n: number) => {
            if (n >= SPIN_STEPS) {
                setSpinning(false);
                setSlotText(undefined);
                setRandomizedRestaurant(winner);
                setShowOverlay(true);
                timers.current.push(setTimeout(() => setShowOverlay(false), 4500));
                return;
            }
            setSlotText(restaurantNames[(offset + n) % restaurantNames.length]);
            const delay = 45 + Math.pow(n / SPIN_STEPS, 2.2) * 240;
            timers.current.push(setTimeout(() => step(n + 1), delay));
        };
        step(0);
    };

    const display = spinning ? slotText : randomizedRestaurant ?? "— unsigned —";

    return (
        <>
            <div className="flex flex-wrap items-center gap-3.5">
                <TypographyEditorial className="text-[15px] leading-[1.3]">The editors pick:</TypographyEditorial>
                <span
                    className={cn(
                        "min-w-[180px] border-b border-hairline px-2 pt-0.5 pb-1.5 text-center font-serif text-[19px] whitespace-nowrap text-primary",
                        spinning && "motion-safe:animate-shake"
                    )}
                >
                    {display}
                </span>
                <button
                    onClick={spin}
                    disabled={spinning}
                    className="cursor-pointer rounded-[2px] bg-foreground px-5 py-[13px] text-background transition-colors hover:bg-primary active:scale-[.96] disabled:cursor-default disabled:opacity-70"
                >
                    <TypographyKicker className="text-[12px] tracking-[.16em]">RANDOMIZE</TypographyKicker>
                </button>
                {randomizedRestaurant && !spinning && (
                    <button
                        onClick={resetRandomizedRestaurant}
                        className="cursor-pointer font-serif text-[14px] italic leading-none text-muted-foreground underline transition-colors hover:text-foreground"
                    >
                        undo
                    </button>
                )}
            </div>

            {showOverlay && randomizedRestaurant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-[3px]"
                    onClick={() => setShowOverlay(false)}
                >
                    <div
                        role="status"
                        aria-live="polite"
                        className="animate-popin-lg max-w-[420px] -rotate-[1.5deg] border-[3px] border-double border-foreground bg-background px-11 py-9 text-center"
                    >
                        <TypographyKicker className="mb-2.5 block text-[11px] tracking-[.3em] text-muted-foreground">EXTRA! EXTRA!</TypographyKicker>
                        <TypographyHeadline className="mb-2 text-[40px] leading-none text-primary">{randomizedRestaurant}</TypographyHeadline>
                        <TypographyEditorial className="mb-4 text-[15px] leading-snug text-foreground">The editors&apos; verdict — no take backsies!</TypographyEditorial>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={POOH_GIF} alt="Winnie the Pooh eating" className="mx-auto block max-w-[200px] sepia-[.3]" />
                    </div>
                </div>
            )}
        </>
    )
}

export default SelectRandom
