"use client"

import {
    Dialog,
    DialogContent,
    DialogHeaderRow,
    DialogTrigger,
} from "@/components/ui/dialog";
import {TypographyEditorial, TypographyKicker} from "@/lib/typography/Typography";

interface MapButtonProps {
    name: string;
    address?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}


const ORIGIN = "Östgötagatan 12, Stockholm";


export default function MapButton({ name, address, coordinates }: MapButtonProps) {
    if (!address && !coordinates) {
        return null;
    }

    const getDestinationString = () => {
        return coordinates
            ? `${coordinates.lat},${coordinates.lng}`
            : address ?? "";
    };

    const getMapEmbedUrl = () => {
        const destination = getDestinationString();
        if (!destination) return "";
        return `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`;
    };

    const getWalkingDirectionsUrl = () => {
        const destination = getDestinationString();
        if (!destination) return "";
        return (
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${encodeURIComponent(ORIGIN)}` +
            `&destination=${encodeURIComponent(destination)}` +
            `&travelmode=walking` +
            `&dir_action=navigate`
        );
    };

    const getDestinationUrl = () => {
        const destination = getDestinationString();
        if (!destination) return "";
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="ml-auto cursor-pointer bg-transparent py-0.5 whitespace-nowrap text-muted-foreground transition-colors hover:text-primary hover:underline">
                    <TypographyKicker className="tracking-[.16em]">⌖ MAP</TypographyKicker>
                </button>
            </DialogTrigger>
            <DialogContent
                className="w-[640px] max-w-[92vw] gap-0"
                showCloseButton={false}
                aria-describedby={undefined}
            >
                <DialogHeaderRow title={`${name} — getting there`} className="mb-1"/>
                <TypographyEditorial className="mb-3.5 text-[14px] leading-normal">
                    {address ?? (coordinates && `Location: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`)}
                </TypographyEditorial>
                <div className="mb-4 h-[340px] w-full border border-dashed border-hairline">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getMapEmbedUrl()}
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <a
                        href={getWalkingDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[2px] bg-foreground px-[18px] py-3 text-background transition-colors hover:bg-primary"
                    >
                        <TypographyKicker className="text-[11px] tracking-[.16em]">WALKING DIRECTIONS</TypographyKicker>
                    </a>
                    <a
                        href={getDestinationUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[2px] border border-foreground px-[18px] py-3 text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                        <TypographyKicker className="text-[11px] tracking-[.16em]">OPEN DESTINATION</TypographyKicker>
                    </a>
                </div>
                <TypographyEditorial className="mt-2.5 text-center text-[12px]">
                    a walk from Östgötagatan 12
                </TypographyEditorial>
            </DialogContent>
        </Dialog>
    );
}
