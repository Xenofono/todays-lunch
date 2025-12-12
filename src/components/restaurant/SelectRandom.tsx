"use client"

import {Button} from "@/components/ui/button";
import {useResetAtom} from "jotai/utils";
import {randomizedRestaurantAtom} from "@/store/randomizer";
import {useSetAtom} from "jotai";
import { toast } from "sonner"
import {TypographyLarge} from "@/lib/typography/Typography";

type Props = {
    restaurantNames: string[]
}

const SelectRandom = ({restaurantNames}: Props) => {
    const setRandomizedRestaurant = useSetAtom(randomizedRestaurantAtom)
    const resetRandomizedRestaurant = useResetAtom(randomizedRestaurantAtom)

    return (<div className="flex gap-4">
        <Button onClick={() => {
            const randomItem = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
            toast(<div>
                <TypographyLarge>Nice! You are eating at <span className="font-bold underline">{randomItem}</span>, no take backsies!</TypographyLarge>
                <img src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUya2dxb2p1eTF0em1zbDBwa21zbXBrNGZxbWhwOHhxaWUwMWU2eGVydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DAUiUaCVfBTFe/200w.gif" alt="nalle puh" />
            </div>)
            setRandomizedRestaurant(randomItem)
        }}>Select random</Button>
        <Button onClick={resetRandomizedRestaurant}>Reset</Button>
    </div>)
}

export default SelectRandom