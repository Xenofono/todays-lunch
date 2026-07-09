'use client';

import { useSetAtom } from 'jotai';
import {searchAtom} from "@/store/search";
import { useDebounce } from "@uidotdev/usehooks";
import {useEffect, useState} from "react";
import {TypographyKicker} from "@/lib/typography/Typography";

export default function RestaurantSearchBar() {
    const [input, setInput] = useState('');
    const setSearchTerm = useSetAtom(searchAtom);
    const debounced = useDebounce(input, 300);

    useEffect(() => {
        setSearchTerm(debounced);
    }, [debounced, setSearchTerm]);

    return (
        <div className="w-full flex-1 lg:max-w-[420px]">
            <label htmlFor="lunch-search" className="mb-2 block">
                <TypographyKicker className="text-[10.5px] tracking-[.24em] text-muted-foreground">
                    WANTED
                </TypographyKicker>
            </label>
            <input
                id="lunch-search"
                type="search"
                placeholder="Search all of this week's columns…"
                onChange={(e) => setInput(e.target.value)}
                inputMode="search"
                aria-label="Search"
                className="w-full border-b-2 border-foreground bg-transparent px-0.5 pt-1 pb-2 font-serif text-[19px] italic leading-[1.3] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
        </div>
    );
}
