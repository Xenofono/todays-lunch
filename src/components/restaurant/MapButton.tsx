"use client"

import {
    Dialog,
    DialogContent,
    DialogHeaderRow,
    DialogTrigger,
} from "@/components/ui/dialog";
import {TypographyEditorial} from "@/lib/typography/Typography";
import {Button} from "@/components/ui/button";

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
                <Button variant="kicker" size="inline" className="ml-auto">⌖ MAP</Button>
            </DialogTrigger>
            <DialogContent
                className="w-[640px] max-w-[92vw] gap-0"
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
                    <Button asChild variant="ink">
                        <a href={getWalkingDirectionsUrl()} target="_blank" rel="noopener noreferrer">WALKING DIRECTIONS</a>
                    </Button>
                    <Button asChild variant="outline">
                        <a href={getDestinationUrl()} target="_blank" rel="noopener noreferrer">OPEN DESTINATION</a>
                    </Button>
                </div>
                <TypographyEditorial className="mt-2.5 text-center text-[12px]">
                    a walk from Östgötagatan 12
                </TypographyEditorial>
            </DialogContent>
        </Dialog>
    );
}
