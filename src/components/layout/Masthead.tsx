import ThemeToggle from "@/components/layout/ThemeToggle";
import {TypographyEditorial, TypographyKicker, TypographyMasthead} from "@/lib/typography/Typography";

const STOCKHOLM = "Europe/Stockholm";

// the server may run in UTC; the paper is dated for Stockholm's "today"
function stockholmDayOfYear(date: Date): number {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-GB", { timeZone: STOCKHOLM, year: "numeric", month: "numeric", day: "numeric" })
            .formatToParts(date)
            .map(p => [p.type, p.value])
    );
    return Math.floor((Date.UTC(+parts.year, +parts.month - 1, +parts.day) - Date.UTC(+parts.year, 0, 0)) / 86400000);
}

export default function Masthead() {
    const now = new Date();
    const dateLine = `SÖDERMALM · ${now.toLocaleDateString("en-GB", {
        timeZone: STOCKHOLM,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).replace(/,/g, "")}`.toUpperCase();

    return (
        <header className="relative px-6 pt-9 sm:px-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b-[3px] border-double border-border pb-1.5">
                <TypographyKicker className="text-[11.5px] font-semibold tracking-[.22em] text-muted-foreground">
                    VOL. 1 — NO. {stockholmDayOfYear(now)}
                </TypographyKicker>
                <TypographyKicker className="text-[11.5px] font-semibold tracking-[.22em] text-muted-foreground">
                    {dateLine}
                </TypographyKicker>
                <ThemeToggle />
            </div>

            <TypographyMasthead className="mx-auto mt-3.5 mb-1">
                Lunchbladet<span className="text-primary">.</span>
            </TypographyMasthead>

            <TypographyEditorial className="border-b border-hairline pb-3.5 text-center text-[15px] leading-normal">
                Many kitchens, one paper, zero decision anxiety — the menus are pulled straight from the source.
            </TypographyEditorial>

            <TypographyEditorial className="pt-2.5 text-center text-[13px] text-primary">
                N.B. — On weekends &amp; public holidays the menus may be unreliable; we print what the restaurants themselves publish.
            </TypographyEditorial>
        </header>
    );
}
