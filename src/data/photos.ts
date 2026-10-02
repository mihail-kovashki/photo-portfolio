// The site's photo list: generated EXIF data (photos.json, written by
// scripts/ingest.mjs) merged with hand-written editorial choices (curation.ts).

import generated from "./photos.json";
import { photoCuration, photoOrder } from "./curation";
import { findCollection, findPlace, type Chapter } from "./collections";
import { formatSeasonYear } from "@/lib/utils";

export interface RecipeDetails {
  filmSimulation: string;
  dynamicRange?: string;
  highlight?: number;
  shadow?: number;
  color?: number;
  noiseReduction?: number;
  sharpening?: number;
  clarity?: number;
  grainEffect?: string;
  colorChromeEffect?: string;
  colorChromeFXBlue?: string;
  whiteBalance?: string;
  wbShift?: number[];
  iso?: string;
  exposureCompensation?: string;
}

/** A photo as ingest writes it. Optional fields are absent when EXIF didn't have them. */
export interface GeneratedPhoto {
  id: string;
  series: string;
  fileNumber: string;
  displayUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  blurDataUrl: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
  profile?: string;
  recipeDetails?: RecipeDetails;
  dateTaken?: string;
  /** Editorial keywords from the file: site|place|<id> and site|tag|<id>. */
  place?: string;
  tags?: string[];
  /** Star rating from the file (1–5). */
  rating?: number;
}

export interface Photo extends GeneratedPhoto {
  title?: string;
  featured: boolean;
  /** The place's display name, without the year: "Seoul", not "Seoul 25". */
  placeName: string;
}

export interface SeriesItem {
  id: string;
  name: string;
  count: number;
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const YEAR_SUFFIX = /\s+\d{2,4}$/;

/** Display name for a series: its place's name, or the series name without the year. */
function placeNameFor(series: string): string {
  return findPlace(slugify(series))?.name ?? series.replace(YEAR_SUFFIX, "");
}

const generatedPhotos = generated as GeneratedPhoto[];

// A typo in curation.ts would otherwise fail silently
const knownIds = new Set(generatedPhotos.map((p) => p.id));
const unknownIds = [...Object.keys(photoCuration), ...photoOrder].filter((id) => !knownIds.has(id));
if (unknownIds.length > 0) {
  console.warn(`curation.ts refers to unknown photo ids: ${unknownIds.join(", ")}`);
}

const orderIndex = new Map(photoOrder.map((id, i) => [id, i]));
const unlisted = photoOrder.length;

export const photos: Photo[] = generatedPhotos
  .filter((p) => !photoCuration[p.id]?.hidden)
  .map((p) => ({
    ...p,
    title: photoCuration[p.id]?.title,
    // 5★ means portfolio hero; curation.ts can still override either way
    featured: photoCuration[p.id]?.featured ?? p.rating === 5,
    placeName: placeNameFor(p.series),
  }))
  // Stable sort: listed photos first in their listed order, the rest keep ingest order
  .sort((a, b) => (orderIndex.get(a.id) ?? unlisted) - (orderIndex.get(b.id) ?? unlisted));

// Counts reflect what is shown, so hiding a photo updates its collection
const seriesCounts = new Map<string, number>();
for (const p of photos) {
  seriesCounts.set(p.series, (seriesCounts.get(p.series) ?? 0) + 1);
}

export const ALL_SERIES_ID = "all";

export const seriesList: SeriesItem[] = [
  { id: ALL_SERIES_ID, name: "All Works", count: photos.length },
  ...[...seriesCounts].map(([name, count]) => ({ id: slugify(name), name, count })),
];

/** The collection for a URL path segment, or undefined when there is none. */
export function findSeries(seriesId: string): SeriesItem | undefined {
  return seriesList.find((s) => s.id === seriesId);
}

export function photosInSeries(seriesId: string): Photo[] {
  const series = findSeries(seriesId);
  if (!series || series.id === ALL_SERIES_ID) return photos;
  const inSeries = photos.filter((p) => p.series === series.name);
  const ordered = resolveCollection(seriesId)?.ordered;
  if (!ordered) return inSeries;
  // A place with a collection shows its own order; anything outside it follows
  return [...ordered, ...inSeries.filter((p) => !ordered.includes(p))];
}

export interface ResolvedChapter extends Omit<Chapter, "photos"> {
  photos: Photo[];
}

interface ResolvedCollection {
  ordered: Photo[];
  chapters?: ResolvedChapter[];
}

const collectionCache = new Map<string, ResolvedCollection | undefined>();

function resolveCollection(seriesId: string): ResolvedCollection | undefined {
  if (collectionCache.has(seriesId)) return collectionCache.get(seriesId);
  const collection = findCollection(seriesId);
  const series = findSeries(seriesId);
  let resolved: ResolvedCollection | undefined;
  if (collection && series) {
    const byFile = new Map(photos.filter((p) => p.series === series.name).map((p) => [p.fileNumber, p]));
    const resolve = (files: string[]) => files.map((f) => byFile.get(f)).filter((p): p is Photo => Boolean(p));
    const chapters = collection.chapters?.map((c) => ({ ...c, photos: resolve(c.photos) }));
    const files = collection.chapters?.flatMap((c) => c.photos) ?? collection.photos ?? [];
    resolved = { ordered: resolve(files), chapters };
    const missing = files.filter((f) => !byFile.has(f));
    if (missing.length > 0) {
      console.warn(`collections/${seriesId}: photos not in the library (re-ingest?): ${missing.join(", ")}`);
    }
  }
  collectionCache.set(seriesId, resolved);
  return resolved;
}

/** A place's chapters with their photos resolved, or undefined if it has none. */
export function chaptersFor(seriesId: string): ResolvedChapter[] | undefined {
  return resolveCollection(seriesId)?.chapters;
}

/** Path for a collection: "/" for everything, "/prague-26" for one collection. */
export function seriesPath(seriesId: string): string {
  return seriesId === ALL_SERIES_ID ? "/" : `/${seriesId}`;
}

/**
 * The frame that represents a collection in link previews. Share cards are wide, so
 * prefer landscape: a featured one first, then the first in display order.
 */
export function coverPhoto(list: Photo[]): Photo | undefined {
  const landscape = list.filter((p) => p.aspectRatio > 1);
  return landscape.find((p) => p.featured) ?? landscape[0] ?? list[0];
}

export interface Place extends SeriesItem {
  /** Display name, without the year: "Funchal". */
  place: string;
  /** The trip it belongs to, as written in its collection: "Madeira · Spring 2025". */
  trip: string;
  /** Earliest photo date (YYYY-MM-DD), when EXIF has one. */
  startDate?: string;
}

/** Every place, oldest first. A place name can appear more than once, one per trip. */
export const places: Place[] = seriesList
  .filter((s) => s.id !== ALL_SERIES_ID)
  .map((s) => {
    const dates = photosInSeries(s.id)
      .map((p) => p.dateTaken)
      .filter((d): d is string => Boolean(d))
      .sort();
    const place = placeNameFor(s.name);
    const trip = findPlace(s.id)?.trip ?? `${place} · ${formatSeasonYear(dates[0])}`;
    return { ...s, place, trip, startDate: dates[0] };
  })
  .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));

export interface Trip {
  id: string;
  /** "Madeira" in "Madeira · Spring 2025". */
  name: string;
  /** "Spring" in "Madeira · Spring 2025". */
  season: string;
  year: string;
  /** Its places in the order they were shot. */
  places: Place[];
  count: number;
}

/** Trips, newest first, each with its places. Places with the same trip label form one trip. */
const placesByTrip = new Map<string, Place[]>();
for (const p of places) placesByTrip.set(p.trip, [...(placesByTrip.get(p.trip) ?? []), p]);

export const trips: Trip[] = [...placesByTrip]
  .map(([label, tripPlaces]) => {
    const [name, when = ""] = label.split(" · ");
    const [, season = when, year = tripPlaces[0].startDate?.slice(0, 4) ?? ""] =
      when.match(/^(.*?)\s*(\d{4})$/) ?? [];
    return {
      id: slugify(label),
      name,
      season,
      year,
      places: tripPlaces,
      count: tripPlaces.reduce((sum, p) => sum + p.count, 0),
    };
  })
  .reverse();

export function findPlaceItem(seriesId: string): Place | undefined {
  return places.find((p) => p.id === seriesId);
}

export function tripOf(seriesId: string): Trip | undefined {
  return trips.find((t) => t.places.some((p) => p.id === seriesId));
}

/**
 * Where a place sits, for titles and descriptions: "Madeira · Spring 2025", or just
 * "Autumn 2025" when the trip is named after the place (Seoul in Seoul).
 */
export function placeContext(seriesId: string): string {
  const place = findPlaceItem(seriesId);
  const trip = tripOf(seriesId);
  if (!place || !trip) return "";
  const when = [trip.season, trip.year].filter(Boolean).join(" ");
  return trip.name === place.place ? when : `${trip.name} · ${when}`;
}
