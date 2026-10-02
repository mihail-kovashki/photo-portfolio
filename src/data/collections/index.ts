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
};

export function findCollection(seriesId: string): PlaceCollection | undefined {
  return collections[seriesId];
}
