"use client"

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { TypographyKicker } from "@/lib/typography/Typography";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    // theme is unknown until hydration; render the default (dark) label on the server
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const isDark = !mounted || resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="cursor-pointer rounded-full border border-border bg-transparent px-3.5 py-[7px] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
            <TypographyKicker className="text-[11px] font-semibold tracking-[.1em]">
                {isDark ? "EVENING EDITION" : "DAY EDITION"}
            </TypographyKicker>
        </button>
    );
}
