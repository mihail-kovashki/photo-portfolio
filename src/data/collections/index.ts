import type { PlaceCollection } from "./types";
import { seoul25 } from "./seoul-25";
import { seoraksan25 } from "./seoraksan-25";

export type { Chapter, PlaceCollection } from "./types";

/** Places that have been through the editorial pass, by place id (= series id). */
export const collections: Record<string, PlaceCollection> = {
  [seoul25.id]: seoul25,
  [seoraksan25.id]: seoraksan25,
};

export function findCollection(seriesId: string): PlaceCollection | undefined {
  return collections[seriesId];
}
