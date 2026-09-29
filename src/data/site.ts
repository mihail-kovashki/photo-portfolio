import { findSeries, ALL_SERIES_ID } from "./photos";

// Absolute base URL for share images, canonical links and the sitemap.
// SITE_URL overrides; on Vercel the production domain (custom domain once connected)
// is available at build time.
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://miko-photo.vercel.app");

export const SITE_NAME = "Mihail Kovashki (MiKo) · Fujifilm Photography";
export const SITE_DESCRIPTION =
  "Visual stories and personal photographic chronicles by Mihail Kovashki (MiKo) captured with the Fujifilm X-T5 & Fujinon XF optics.";

/** Page title for a collection id; the site name for everything. */
export function collectionTitle(seriesId: string): string {
  const series = findSeries(seriesId);
  return !series || series.id === ALL_SERIES_ID ? SITE_NAME : `${series.name} · Mihail Kovashki`;
}
