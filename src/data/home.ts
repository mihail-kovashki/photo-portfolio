// The home page: the latest trip as its cover, then every trip with its places and
// chapters. Hand-written choices (the frames it leads with, the cover's words) sit at
// the top; everything else is derived from the collections.

import { photos, trips, chaptersFor, type Photo, type Trip } from "./photos";

/**
 * Frames the home page leads with, by photo id: each trip's cover comes from here
 * (a landscape one when there is one), and they come first when a trip's frames open
 * in the lightbox. The 5★ frames plus 4★ ones so every trip has some.
 */
const HOME_FRAME_IDS = [
  "pico-ruivo-25-dscf0049",
  "seoul-25-dscf2212",
  "prague-26-dscf7253",
  "kutna-hora-26-dscf7124",
  "tam-coc-24-dscf8441",
  "biei-and-furano-25-dscf2859",
  "seoul-25-dscf2589",
  "larano-25-dscf9817",
  "copenhagen-24-dscf6779",
  "hanoi-24-dscf7603",
  "seoraksan-25-dscf3468",
  "cesky-krumlov-26-dscf7498",
  "seoul-25-dscf2347",
  "ha-long-bay-24-dscf8171",
  "prague-26-dscf7669",
  "cape-kamui-25-dscf2674",
  "seoul-24-dscf6390",
  "tam-coc-24-dscf8549",
  "sapporo-25-dscf3165",
  "malmo-24-dscf7058",
  "seoul-25-dscf2369",
  "biei-and-furano-25-dscf3000",
  "prague-26-dscf6962",
  "yeosu-24-dscf4953",
  "pico-ruivo-25-dscf0033",
];

/** A line under the cover's trip name, by trip id. Without one, the cover lists the places. */
export const COVER_STATEMENTS: Record<string, string> = {
  "czechia-summer-2026":
    "Prague from the castle down to the river, then out to Kutná Hora and to Český Krumlov, where the Vltava bends around the old town.",
};

const byId = new Map(photos.map((p) => [p.id, p]));

const unknown = HOME_FRAME_IDS.filter((id) => !byId.has(id));
if (unknown.length > 0) console.warn(`home.ts refers to unknown photo ids: ${unknown.join(", ")}`);

const homeFrames = new Set(HOME_FRAME_IDS.map((id) => byId.get(id)).filter((p): p is Photo => Boolean(p)));

export interface ChapterSummary {
  id: string;
  name: string;
  href: string;
  count: number;
  cover: Photo;
}

export interface PlaceSummary {
  id: string;
  name: string;
  href: string;
  count: number;
  cover: Photo;
  chapters: ChapterSummary[];
}

export interface TripSummary {
  id: string;
  name: string;
  season: string;
  year: string;
  count: number;
  places: PlaceSummary[];
  /** The trip's cover: one of the home frames, landscape when there is one. */
  cover: Photo;
  /** Up to 8 strong frames: home frames first, then 4★+ in display order. */
  frames: Photo[];
}

const placeSeries = new Map<string, string>();
for (const trip of trips) for (const p of trip.places) placeSeries.set(p.id, p.name);

function placeSummary(place: Trip["places"][number]): PlaceSummary {
  const list = photos.filter((p) => p.series === place.name);
  const chapters = chaptersFor(place.id) ?? [];
  const cover = list.find((p) => homeFrames.has(p)) ?? list.find((p) => p.featured) ?? chapters[0]?.photos[0] ?? list[0];
  return {
    id: place.id,
    name: place.place,
    href: `/${place.id}`,
    count: place.count,
    cover,
    chapters: chapters
      .filter((c) => c.photos.length > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        href: `/${place.id}#chapter-${c.id}`,
        count: c.photos.length,
        cover: c.photos[0],
      })),
  };
}

/** Every trip, newest first. */
export const tripSummaries: TripSummary[] = trips.map((trip) => {
  const inTrip = photos.filter((p) => trip.places.some((pl) => pl.name === p.series));
  const picked = inTrip.filter((p) => homeFrames.has(p));
  const frames = [...picked, ...inTrip.filter((p) => !homeFrames.has(p) && (p.rating ?? 0) >= 4)].slice(0, 8);
  return {
    id: trip.id,
    name: trip.name,
    season: trip.season,
    year: trip.year,
    count: trip.count,
    places: trip.places.map(placeSummary),
    cover: picked.find((p) => p.aspectRatio > 1) ?? picked[0] ?? frames[0],
    frames,
  };
});

/** The latest trip, and its cover: the first full screen of the home page. */
export const latestTrip = tripSummaries[0];
export const homeCover = latestTrip.cover;

/** The place a photo belongs to. */
export function placeForPhoto(photo: Photo): PlaceSummary | undefined {
  for (const t of tripSummaries) for (const p of t.places) if (placeSeries.get(p.id) === photo.series) return p;
  return undefined;
}

export const siteStats = {
  photos: photos.length,
  places: tripSummaries.reduce((n, t) => n + t.places.length, 0),
  trips: tripSummaries.length,
  chapters: tripSummaries.reduce((n, t) => n + t.places.reduce((m, p) => m + p.chapters.length, 0), 0),
  firstYear: tripSummaries[tripSummaries.length - 1]?.year,
  lastYear: tripSummaries[0]?.year,
};
