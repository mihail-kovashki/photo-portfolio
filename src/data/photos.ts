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

export const seriesList: SeriesItem[] = [
  { id: "all", name: "All Works", count: photos.length },
  ...[...seriesCounts].map(([name, count]) => ({ id: slugify(name), name, count })),
];
