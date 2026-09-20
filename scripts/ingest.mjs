import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import exifr from 'exifr';

const HOKKAIDO_DIR = '/Users/mihail/Desktop/Untitled Export/Hokkaido 2025';
const KOREA_DIR = '/Users/mihail/Desktop/Untitled Export/Korea 2025';

const PUBLIC_PHOTOS_DIR = path.resolve('public/photos');
const DISPLAY_DIR = path.join(PUBLIC_PHOTOS_DIR, 'display');
const THUMB_DIR = path.join(PUBLIC_PHOTOS_DIR, 'thumb');

fs.mkdirSync(DISPLAY_DIR, { recursive: true });
fs.mkdirSync(THUMB_DIR, { recursive: true });

const selectedFiles = [
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2592.jpg', title: 'Winter Serenity', filmRecipe: 'Classic Chrome', featured: true },
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2621.jpg', title: 'Frost & Timber', filmRecipe: 'Acros + R', featured: false },
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2732.jpg', title: 'Northern Horizon', filmRecipe: 'Nostalgic Neg', featured: true },
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2792.jpg', title: 'Snowdrift Shadows', filmRecipe: 'Classic Chrome', featured: false },
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2836.jpg', title: 'Mountain Silence', filmRecipe: 'Velvia', featured: true },
  { series: 'Hokkaido 2025', dir: HOKKAIDO_DIR, file: 'DSCF2972.jpg', title: 'Alpine Dusk', filmRecipe: 'Astia / Soft', featured: false },
  
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2059.JPG', title: 'Seoul Awakening', filmRecipe: 'Classic Neg', featured: true },
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2110.jpg', title: 'Alleyway Geometry', filmRecipe: 'Classic Chrome', featured: false },
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2175.jpg', title: 'Neon Reflections', filmRecipe: 'Nostalgic Neg', featured: true },
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2220.jpg', title: 'Subway Monolith', filmRecipe: 'Acros', featured: false },
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2267.jpg', title: 'Dusk over Han River', filmRecipe: 'Pro Neg Hi', featured: true },
  { series: 'Korea 2025', dir: KOREA_DIR, file: 'DSCF2316.jpg', title: 'Night Market Glow', filmRecipe: 'Classic Chrome', featured: false },
];

function formatExposureTime(sec) {
  if (!sec) return '1/250s';
  if (sec >= 1) return `${Math.round(sec * 10) / 10}s`;
  const denom = Math.round(1 / sec);
  return `1/${denom}s`;
}

function formatFNumber(f) {
  if (!f) return 'ƒ/1.4';
  const rounded = Math.round(f * 10) / 10;
  return Number.isInteger(rounded) ? `ƒ/${rounded}.0` : `ƒ/${rounded}`;
}

async function processPhoto(item, index) {
  const inputPath = path.join(item.dir, item.file);
  const ext = path.extname(item.file).toLowerCase();
  const baseName = path.basename(item.file, ext).toLowerCase();
  const id = `${item.series.toLowerCase().replace(/\s+/g, '-')}-${baseName}`;
  const displayFileName = `${id}.jpg`;
  const thumbFileName = `${id}.jpg`;

  const displayPath = path.join(DISPLAY_DIR, displayFileName);
  const thumbPath = path.join(THUMB_DIR, thumbFileName);
  const tinyPath = `/tmp/tiny-${id}.jpg`;

  console.log(`Processing [${index + 1}/${selectedFiles.length}]: ${item.file} -> ${id}`);

  // Sips resizing
  execSync(`sips -Z 2048 "${inputPath}" --out "${displayPath}" > /dev/null 2>&1`);
  execSync(`sips -Z 800 "${inputPath}" --out "${thumbPath}" > /dev/null 2>&1`);
  execSync(`sips -Z 20 "${inputPath}" --out "${tinyPath}" > /dev/null 2>&1`);

  const blurDataUrl = 'data:image/jpeg;base64,' + fs.readFileSync(tinyPath).toString('base64');
  try { fs.unlinkSync(tinyPath); } catch {}

  // Parse dimensions with sips
  const dimOutput = execSync(`sips -g pixelWidth -g pixelHeight "${displayPath}"`).toString();
  const widthMatch = dimOutput.match(/pixelWidth:\s*(\d+)/);
  const heightMatch = dimOutput.match(/pixelHeight:\s*(\d+)/);
  const width = widthMatch ? parseInt(widthMatch[1], 10) : 2048;
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 1365;
  const aspectRatio = Math.round((width / height) * 1000) / 1000;

  // Parse EXIF with exifr
  let exif = {};
  try {
    exif = (await exifr.parse(inputPath, true)) || {};
  } catch (err) {
    console.warn(`Could not read EXIF for ${item.file}:`, err.message);
  }

  const camera = exif.Model ? `FUJIFILM ${exif.Model.replace(/^FUJIFILM\s*/i, '')}` : 'FUJIFILM X-T5';
  let lens = exif.LensModel || 'XF23mmF1.4 R LM WR';
  if (lens.includes('23.0 mm f/1.4')) {
    lens = 'XF23mmF1.4 R LM WR';
  }
  const aperture = formatFNumber(exif.FNumber || 1.4);
  const shutterSpeed = formatExposureTime(exif.ExposureTime || 0.004);
  const iso = exif.ISO ? `ISO ${exif.ISO}` : 'ISO 125';
  const focalLength = exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : '23mm';

  let dateTaken = '2025';
  if (exif.CreateDate instanceof Date && !isNaN(exif.CreateDate.getTime())) {
    dateTaken = exif.CreateDate.toISOString().split('T')[0];
  }

  return {
    id,
    title: item.title,
    series: item.series,
    displayUrl: `/photos/display/${displayFileName}`,
    thumbUrl: `/photos/thumb/${thumbFileName}`,
    width,
    height,
    aspectRatio,
    blurDataUrl,
    camera,
    lens,
    aperture,
    shutterSpeed,
    iso,
    focalLength,
    filmRecipe: item.filmRecipe,
    dateTaken,
    featured: item.featured,
  };
}

async function run() {
  const results = [];
  for (let i = 0; i < selectedFiles.length; i++) {
    const photo = await processPhoto(selectedFiles[i], i);
    results.push(photo);
  }

  const fileContent = `// Auto-generated by scripts/ingest.mjs
// Feel free to edit titles, film recipes, and featured flags directly!

export interface Photo {
  id: string;
  title: string;
  series: 'Hokkaido 2025' | 'Korea 2025' | string;
  displayUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  blurDataUrl: string;
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  focalLength: string;
  filmRecipe: string;
  dateTaken: string;
  featured: boolean;
}

export const photos: Photo[] = ${JSON.stringify(results, null, 2)};

export const seriesList = [
  { id: 'all', name: 'All Stories', count: photos.length },
  { id: 'hokkaido', name: 'Hokkaido 2025', count: photos.filter(p => p.series === 'Hokkaido 2025').length },
  { id: 'korea', name: 'Korea 2025', count: photos.filter(p => p.series === 'Korea 2025').length },
];

export const filmRecipes = Array.from(new Set(photos.map(p => p.filmRecipe)));
`;

  fs.mkdirSync(path.resolve('src/data'), { recursive: true });
  fs.writeFileSync(path.resolve('src/data/photos.ts'), fileContent);
  console.log(`\nSuccessfully processed ${results.length} photos and generated src/data/photos.ts!`);
}

run().catch(console.error);
