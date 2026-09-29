// The site's photo list: generated EXIF data (photos.json, written by
// scripts/ingest.mjs) merged with hand-written editorial choices (curation.ts).

import generated from "./photos.json";
import { photoCuration, photoOrder } from "./curation";

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
}

export interface Photo extends GeneratedPhoto {
  title?: string;
  featured: boolean;
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
    featured: photoCuration[p.id]?.featured ?? false,
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
  return photos.filter((p) => p.series === series.name);
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

export interface Trip extends SeriesItem {
  /** The collection name without its year suffix: "Prague 26" -> "Prague". */
  place: string;
  /** Earliest photo date (YYYY-MM-DD), when EXIF has one. */
  startDate?: string;
}

/** Collections as trips, oldest first. A place can appear more than once, one per trip. */
export const trips: Trip[] = seriesList
  .filter((s) => s.id !== ALL_SERIES_ID)
  .map((s) => {
    const dates = photosInSeries(s.id)
      .map((p) => p.dateTaken)
      .filter((d): d is string => Boolean(d))
      .sort();
    return { ...s, place: s.name.replace(/\s+\d{2,4}$/, ""), startDate: dates[0] };
  })
  .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
