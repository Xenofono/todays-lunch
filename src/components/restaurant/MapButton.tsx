"use client"

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
                <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    Map
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{name}</DialogTitle>
                    <DialogDescription>
                        {address && <span>{address}</span>}
                        {!address && coordinates && (
                            <span>
                                Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full h-[500px] rounded-lg overflow-hidden border">
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
                <div className="flex justify-center gap-4 flex-wrap mt-4">
                    <Button asChild>
                        <a
                            href={getWalkingDirectionsUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Walking directions
                        </a>
                    </Button>

                    <Button variant="outline" asChild>
                        <a
                            href={getDestinationUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open destination
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
