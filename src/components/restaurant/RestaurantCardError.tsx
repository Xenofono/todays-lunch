"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TypographyH3, TypographyP} from "@/lib/typography/Typography";
import {Badge} from "@/components/ui/badge";
import {AlertCircle, ExternalLink} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";

type RestaurantCardErrorProps = {
    name: string,
    url: string,
    didErrorMessage: string | undefined
}

const RestaurantCardError = ({name, url, didErrorMessage}: RestaurantCardErrorProps) => {

    return (<Card className="h-full border-destructive bg-destructive/40">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TypographyH3>{name}</TypographyH3>
                <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1"/>
                    Failed
                </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4"/>
                <a
                    href={url}
                    className="hover:underline truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {url}
                </a>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4"/>
                <AlertDescription>
                    <TypographyP>{didErrorMessage}</TypographyP>
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>)
}

export default RestaurantCardError