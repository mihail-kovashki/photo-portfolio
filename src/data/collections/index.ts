import type { PlaceCollection } from "./types";
import { seoul25 } from "./seoul-25";
import { seoraksan25 } from "./seoraksan-25";
import { seoul24 } from "./seoul-24";
import { yeosu24 } from "./yeosu-24";
import { bieiAndFurano25 } from "./biei-and-furano-25";
import { capeKamui25 } from "./cape-kamui-25";
import { otaru25 } from "./otaru-25";
import { sapporo25 } from "./sapporo-25";
import { hanoi24 } from "./hanoi-24";
import { haLongBay24 } from "./ha-long-bay-24";
import { tamCoc24 } from "./tam-coc-24";
import { funchal25 } from "./funchal-25";
import { saoVicente25 } from "./sao-vicente-25";
import { larano25 } from "./larano-25";
import { picoRuivo25 } from "./pico-ruivo-25";
import { fanal25 } from "./fanal-25";

export type { Chapter, PlaceCollection } from "./types";

/** Places that have been through the editorial pass, by place id (= series id). */
export const collections: Record<string, PlaceCollection> = {
  [seoul25.id]: seoul25,
  [seoraksan25.id]: seoraksan25,
  [seoul24.id]: seoul24,
  [yeosu24.id]: yeosu24,
  [bieiAndFurano25.id]: bieiAndFurano25,
  [capeKamui25.id]: capeKamui25,
  [otaru25.id]: otaru25,
  [sapporo25.id]: sapporo25,
  [hanoi24.id]: hanoi24,
  [haLongBay24.id]: haLongBay24,
  [tamCoc24.id]: tamCoc24,
  [funchal25.id]: funchal25,
  [saoVicente25.id]: saoVicente25,
  [larano25.id]: larano25,
  [picoRuivo25.id]: picoRuivo25,
  [fanal25.id]: fanal25,
};

export function findCollection(seriesId: string): PlaceCollection | undefined {
  return collections[seriesId];
}
