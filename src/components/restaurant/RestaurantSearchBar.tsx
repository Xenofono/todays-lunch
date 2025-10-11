'use client';

import { Input } from '@/components/ui/input';
import { useSetAtom } from 'jotai';
import {searchAtom} from "@/store/search";
import { useDebounce } from "@uidotdev/usehooks";
import {useEffect, useState} from "react";

export default function RestaurantSearchBar() {
    const [input, setInput] = useState('');
    const setSearchTerm = useSetAtom(searchAtom);
    const debounced = useDebounce(input, 300);

    useEffect(() => {
        setSearchTerm(debounced);
    }, [debounced, setSearchTerm]);

    return (
        <Input
            type="search"
            placeholder="Search for keywords"
            onChange={(e) => setInput(e.target.value)}
            className="h-12 text-base border-primary"
            inputMode="search"
            aria-label="Search"
        />
    );
}