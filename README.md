# Mihail Kovashki (MiKo) · Photography

A photo journal of my travels: street scenes, landscapes and quiet moments, mostly shot on a Fujifilm X-T5. Some photos are RAW edits in Lightroom, others come straight out of camera with a Fujifilm film simulation recipe, and the site shows the recipe behind those.

Live at [miko-photo.vercel.app](https://miko-photo.vercel.app) · Instagram [@mi_ko.jpg](https://instagram.com/mi_ko.jpg)

I built it myself as a hobby project rather than using a template or a site builder.

## What's in it

- Collections by trip, each with its own page (`/prague-26`) and link preview
- A grid view and a single-column story view
- A lightbox with swipe, pinch/scroll zoom, keyboard navigation and shareable links (`?photo=<id>`)
- Camera settings for every photo and, for straight-out-of-camera shots, the full recipe: film simulation, dynamic range, tone, colour, grain, colour chrome and white balance shift

## How it's built

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 and Framer Motion
- Every page is pre-rendered at build time and served as static files from Vercel; there's no server or database
- Photos are processed offline by an ingest script, not by an image service at request time

### Photo data

| File | Written by | Holds |
| --- | --- | --- |
| `src/data/photos.json` | the ingest script | EXIF, recipe and image data. Don't edit by hand |
| `src/data/curation.ts` | me | titles, featured and hidden photos, display order |
| `src/data/recipes.json` | both | known recipes; ingest adds a `TODO` entry when it sees an unfamiliar one |
| `src/data/photos.ts` | — | merges the above into the photo list and collections |

Keeping curation separate means re-ingesting a folder never wipes editorial choices. An unknown photo id in `curation.ts` produces a warning at build time, and a photo's id is in the URL when it's open on the site.

## Running it

Requires Node.js 20.9 or later.

```bash
git clone https://github.com/mihail-kovashki/photo-portfolio.git
cd photo-portfolio
npm install
npm run dev
```

`npm run build` followed by `npm run start` serves the production build locally.

## Adding photos

```bash
# Add or update every JPEG in a folder as a collection (defaults to the folder name)
npm run ingest -- "/path/to/export" "Prague 26"

# Override the lens or profile if EXIF lacks them
npm run ingest -- "/path/to/export" "Seoul 25" --lens="XF23mmF1.4 R LM WR"

# Re-render and re-read photos already on the site, matched by file number (DSCF1234).
# Ids and collections stay the same; files not already on the site are skipped.
npm run ingest -- --refresh "/path/to/Prague export" "/path/to/Kutna Hora export"
```

For each photo the script (`scripts/ingest.mjs`, image work in `scripts/lib/images.mjs`):

- reads EXIF and Fujifilm MakerNotes with ExifTool; values EXIF doesn't have are left out rather than guessed
- renders a 2048px display image, an 800px thumbnail and a ~300-byte blur placeholder with sharp (mozjpeg, quality 80)
- applies the EXIF rotation to the pixels, then strips all metadata except artist and copyright, so no GPS or camera serial numbers are published
- puts a content hash in each filename, because `/photos/*` is cached for a year and an edited photo needs a new URL

Always ingest from the camera JPEG or the Lightroom export, not from files already in `public/photos`, so photos aren't compressed twice.

## Photographs

All photographs are © Mihail Kovashki, all rights reserved. Please don't reuse them without asking.
