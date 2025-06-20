"use client"

import {Alert, AlertDescription} from "../ui/alert";
import Image from 'next/image'
import {AlertCircle} from 'lucide-react';
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import { Button } from "../ui/button";


export function RestaurantMenuFallback(props: { totalDays: number, menus: string[], imgUrl: string | undefined }) {

    if (props.imgUrl) {
        
        return <Dialog>
            <div className="w-full h-full flex justify-center mb-4">
                <DialogTrigger>
                    <Button className="cursor-pointer">View menu img</Button>
                </DialogTrigger>
            </div>

            <DialogContent
                className="p-0 flex flex-col items-center justify-center"
            >
                <DialogHeader className="w-full px-8 pt-8">
                    <DialogTitle>Menu</DialogTitle>
                </DialogHeader>
                <div className="flex-1 flex justify-center items-center w-full h-full">
                    <Image
                        src={props.imgUrl}
                        alt="restaurant menu image"
                        width={1240}
                        height={1754}
                        className="max-h-[88vh] max-w-[90vw]"
                        priority
                    />
                </div>
                <DialogFooter className="w-full p-8">
                    
                </DialogFooter>
            </DialogContent>




        </Dialog>;
    } else {
        return <>
            {props.totalDays === 0 && props.menus.length === 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4"/>
                    <AlertDescription>
                        No menu data found for this restaurant.
                    </AlertDescription>
                </Alert>
            )}
        </>;
    }
}