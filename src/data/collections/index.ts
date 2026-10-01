import type { PlaceCollection } from "./types";
import { seoul25 } from "./seoul-25";
import { seoraksan25 } from "./seoraksan-25";
import { seoul24 } from "./seoul-24";
import { yeosu24 } from "./yeosu-24";

export type { Chapter, PlaceCollection } from "./types";

/** Places that have been through the editorial pass, by place id (= series id). */
export const collections: Record<string, PlaceCollection> = {
  [seoul25.id]: seoul25,
  [seoraksan25.id]: seoraksan25,
  [seoul24.id]: seoul24,
  [yeosu24.id]: yeosu24,
};

export function findCollection(seriesId: string): PlaceCollection | undefined {
  return collections[seriesId];
}
