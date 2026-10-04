"use client"

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {Button} from "@/components/ui/button";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    // theme is unknown until hydration; render the default (dark) label on the server
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const isDark = !mounted || resolvedTheme === "dark";

    return (
        <Button variant="pill" size="sm" onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? "EVENING EDITION" : "DAY EDITION"}
        </Button>
    );
}
