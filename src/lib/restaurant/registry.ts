import { Restaurant } from "./restaurant";
import { OliverTwist } from "./oliver-twist";
import { Kvarnen } from "./kvarnen";
import { BastardBurgers } from "./bastard-burgers";
import { DeliDiLuca } from "./deli-di-luca";
import { BiblioteketLive } from "./biblioteket-live";
import { Bistroteket } from "./bistroteket";
import { BlaDorren } from "./bla-dorren";
import { Usine } from "./usine";
import { Florentine } from "./florentine";
import { Invece } from "./invece";
import { VillaValentina } from "./villa-valentina";
import { UrbanDeli } from "./urban-deli";
import { BigBen } from "./big-ben";

/** Every restaurant in the paper. Add new scrapers here. */
const RESTAURANTS = [
    OliverTwist,
    Kvarnen,
    BastardBurgers,
    DeliDiLuca,
    BiblioteketLive,
    Bistroteket,
    BlaDorren,
    Usine,
    Florentine,
    Invece,
    VillaValentina,
    UrbanDeli,
    BigBen,
];

// constructing a restaurant is cheap: it only stores name/url/address; nothing is fetched until update()
export function restaurantNames(): string[] {
    return RESTAURANTS.map(R => new R().name);
}

export function createRestaurant(name: string): Restaurant {
    const restaurant = RESTAURANTS.map(R => new R()).find(r => r.name === name);
    if (!restaurant) throw new Error(`Unknown restaurant: ${name}`);
    return restaurant;
}
