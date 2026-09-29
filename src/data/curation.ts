// Editorial choices, written by hand. scripts/ingest.mjs only writes photos.json,
// so nothing here is lost when photos are re-ingested or refreshed.
//
// Photo ids are "<series-slug>-<file number>", e.g. "prague-26-dscf7159". Open a photo
// on the site and the id is in the URL (?photo=...).

export interface PhotoCuration {
  /** Shown instead of the series name in captions and the lightbox. */
  title?: string;
  /** Marks a portfolio hero frame (5★). */
  featured?: boolean;
  /** Kept in the library but not shown anywhere on the site. */
  hidden?: boolean;
}

/** Per-photo titles, featured and hidden flags. */
export const photoCuration: Record<string, PhotoCuration> = {
  // "prague-26-dscf7159": { title: "A short caption", featured: true },
  // "cesky-krumlov-26-dscf7469": { hidden: true },
};

/**
 * Display order. Listed photos come first, in this order; everything else follows in
 * ingest order. Collections appear in the order their first photo does, so putting a
 * Prague frame first also puts Prague first in the collection list.
 */
export const photoOrder: string[] = [
  // "prague-26-dscf6688",
];
