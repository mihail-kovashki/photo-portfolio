import { findPlaceItem, placeContext } from "./photos";

// Absolute base URL for share images, canonical links and the sitemap.
// SITE_URL overrides; on Vercel the production domain (custom domain once connected)
// is available at build time.
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://miko-photo.vercel.app");

export const SITE_NAME = "Mihail Kovashki (MiKo) · Photography";
export const SITE_DESCRIPTION =
  "The photo journal of Mihail Kovashki (MiKo): street scenes, landscapes and quiet moments from travels, with the Fujifilm film recipes behind the shots.";

/** Page title for a place id ("Funchal · Madeira · Spring 2025 · Mihail Kovashki"); the site name for everything. */
export function collectionTitle(seriesId: string): string {
  const place = findPlaceItem(seriesId);
  if (!place) return SITE_NAME;
  return [place.place, placeContext(seriesId), "Mihail Kovashki"].filter(Boolean).join(" · ");
}
