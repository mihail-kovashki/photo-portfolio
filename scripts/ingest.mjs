import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import exifr from "exifr";

const PUBLIC_PHOTOS_DIR = path.resolve("public/photos");
const DISPLAY_DIR = path.join(PUBLIC_PHOTOS_DIR, "display");
const THUMB_DIR = path.join(PUBLIC_PHOTOS_DIR, "thumb");
const RECIPES_FILE = path.resolve("src/data/recipes.json");

fs.mkdirSync(DISPLAY_DIR, { recursive: true });
fs.mkdirSync(THUMB_DIR, { recursive: true });

function formatExposureTime(sec) {
  if (!sec) return "1/250s";
  if (sec >= 1) return `${Math.round(sec * 10) / 10}s`;
  const denom = Math.round(1 / sec);
  return `1/${denom}s`;
}

function formatFNumber(f) {
  if (!f) return "ƒ/--";
  const rounded = Math.round(f * 10) / 10;
  return Number.isInteger(rounded) ? `ƒ/${rounded}.0` : `ƒ/${rounded}`;
}

function formatLensModel(lensModel, focalLength) {
  if (!lensModel) {
    return focalLength ? `Fujinon Lens (${Math.round(focalLength)}mm)` : "Fujinon Lens";
  }
  let cleaned = lensModel.trim();
  if (/^23\.0\s*mm\s*f\/1\.4/i.test(cleaned)) {
    return "XF23mmF1.4 R LM WR";
  }
  if (/^70-300mm/i.test(cleaned)) {
    return "XF70-300mmF4-5.6 R LM OIS WR";
  }
  cleaned = cleaned.replace(/^(FUJIFILM|FUJINON)(\s+LENS)?\s+/i, "");
  return cleaned;
}

function resolveUserPath(inputPath) {
  if (inputPath.startsWith("~")) {
    return path.join(os.homedir(), inputPath.slice(1));
  }
  return path.resolve(inputPath);
}

function loadExistingPhotos() {
  const filePath = path.resolve("src/data/photos.ts");
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/export const photos: Photo\[\] = (\[[\s\S]*?\]);/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      console.warn("Failed to parse existing photos from photos.ts:", err.message);
    }
  }
  return [];
}

function getRecipeForFujiMetadata({ baseFilmSim, wbShift }) {
  let recipes = [];
  try {
    if (fs.existsSync(RECIPES_FILE)) {
      recipes = JSON.parse(fs.readFileSync(RECIPES_FILE, "utf8"));
    }
  } catch (e) {
    recipes = [];
  }

  // Look for exact match in recipes lookup table
  let match = recipes.find(r =>
    r.baseFilmSim &&
    r.baseFilmSim.toLowerCase() === baseFilmSim.toLowerCase() &&
    Array.isArray(r.wbShift) &&
    r.wbShift[0] === wbShift[0] &&
    r.wbShift[1] === wbShift[1]
  );

  if (match) {
    if (match.name.startsWith("TODO:")) {
      return { profile: `${baseFilmSim} · Custom Recipe`, recipe: match };
    }
    return { profile: `${match.name} · SOOC`, recipe: match };
  }

  // If no WB shift was applied, it is pure SOOC film simulation
  if (wbShift[0] === 0 && wbShift[1] === 0) {
    return { profile: `${baseFilmSim} · SOOC`, recipe: null };
  }

  // Uncataloged custom recipe -> Record into recipes.json so user can name it
  const rSign = wbShift[0] >= 0 ? `+${wbShift[0]}` : `${wbShift[0]}`;
  const bSign = wbShift[1] >= 0 ? `+${wbShift[1]}` : `${wbShift[1]}`;
  const newId = `custom-${baseFilmSim.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-r${wbShift[0]}-b${wbShift[1]}`;

  const newEntry = {
    id: newId,
    name: `TODO: Name this recipe (${baseFilmSim} R:${rSign} B:${bSign})`,
    baseFilmSim,
    wbShift,
    userCustom: true,
    firstSeen: new Date().toISOString().split("T")[0]
  };

  recipes.push(newEntry);
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2), "utf8");
  console.log(`✨ [Recipe Table] Recorded uncataloged recipe fingerprint: ${baseFilmSim} (WB R:${rSign}, B:${bSign}) to src/data/recipes.json`);

  return { profile: `${baseFilmSim} · Custom Recipe`, recipe: newEntry };
}

function extractProfile(inputPath, profileOverride = null) {
  if (profileOverride) return profileOverride;

  try {
    const fd = fs.openSync(inputPath, "r");
    const buffer = Buffer.alloc(131072);
    const bytesRead = fs.readSync(fd, buffer, 0, 131072, 0);
    fs.closeSync(fd);

    // 1. Check for Lightroom XMP CameraProfile
    const text = buffer.toString("latin1", 0, bytesRead);
    const xmpMatch = text.match(/crs:CameraProfile="([^"]+)"/i);
    if (xmpMatch) {
      const rawProfile = xmpMatch[1];
      let cleaned = rawProfile
        .replace(/^Camera\s+/i, "")
        .replace(/\s+v\d+$/i, "")
        .replace(/\/Standard/i, "")
        .trim();

      const nameMap = {
        "reala ace": "Reala Ace",
        "classic chrome": "Classic Chrome",
        "classic neg.": "Classic Neg",
        "classic neg": "Classic Neg",
        "nostalgic neg": "Nostalgic Neg",
        "provia": "Provia",
        "velvia": "Velvia",
        "astia": "Astia",
        "eterna": "Eterna",
        "acros": "Acros",
        "pro neg. hi": "PRO Neg. Hi",
        "pro neg. std": "PRO Neg. Std",
        "adobe standard": "RAW Edit",
        "adobe color": "RAW Edit",
        "embedded": "RAW Edit"
      };

      const normalized = nameMap[cleaned.toLowerCase()] || (cleaned ? `${cleaned} · RAW Edit` : "RAW Edit");
      if (normalized.endsWith("RAW Edit")) return normalized;
      return `${normalized} · RAW Edit`;
    }

    // 2. Check for SOOC Fujifilm MakerNote
    const mnMarker = Buffer.from("FUJIFILM\x0c\x00\x00\x00");
    const idx = buffer.indexOf(mnMarker);
    if (idx !== -1) {
      const ifdOffset = idx + 12;
      const numEntries = buffer.readUInt16LE(ifdOffset);
      let pos = ifdOffset + 2;

      const tags = {};
      for (let i = 0; i < numEntries && pos + 12 <= bytesRead; i++) {
        const tag = buffer.readUInt16LE(pos);
        const ftype = buffer.readUInt16LE(pos + 2);
        const count = buffer.readUInt32LE(pos + 4);
        const valOrOffset = buffer.readUInt32LE(pos + 8);
        tags[tag] = { ftype, count, valOrOffset };
        pos += 12;
      }

      const filmModes = {
        0x000: "Provia",
        0x100: "Astia",
        0x200: "Velvia",
        0x300: "PRO Neg. Hi",
        0x400: "PRO Neg. Std",
        0x500: "Classic Chrome",
        0x600: "Eterna",
        0x700: "Classic Neg",
        0x800: "Eterna Bleach Bypass",
        0x900: "Nostalgic Neg",
        0xa00: "Reala Ace",
        0x511: "Acros",
        0x512: "Acros + Ye",
        0x513: "Acros + R",
        0x514: "Acros + G",
        0x501: "Monochrome",
      };

      const filmCode = tags[0x1401] ? tags[0x1401].valOrOffset : null;
      const baseFilmSim = (filmCode !== null && filmModes[filmCode]) ? filmModes[filmCode] : "Fujifilm Simulation";

      // WB Fine Tune: Tag 0x100a
      let wbShift = [0, 0];
      if (tags[0x100a]) {
        const offset = idx + tags[0x100a].valOrOffset;
        if (offset + 8 <= bytesRead) {
          const r = buffer.readInt32LE(offset);
          const b = buffer.readInt32LE(offset + 4);
          wbShift = [Math.round(r / 20) || r, Math.round(b / 20) || b];
        }
      }

      const { profile } = getRecipeForFujiMetadata({ baseFilmSim, wbShift });
      return profile;
    }
  } catch (err) {
    console.warn("Could not extract color profile for", path.basename(inputPath), err.message);
  }

  return "Reala Ace · RAW Edit";
}

async function processSinglePhoto({ inputPath, seriesName, profileOverride = null, lensOverride = null }) {
  const file = path.basename(inputPath);
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext).toLowerCase();
  const id = `${seriesName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${baseName}`;
  const displayFileName = `${id}.jpg`;
  const thumbFileName = `${id}.jpg`;

  const displayPath = path.join(DISPLAY_DIR, displayFileName);
  const thumbPath = path.join(THUMB_DIR, thumbFileName);
  const tinyPath = `/tmp/tiny-${id}.jpg`;

  console.log(`Processing: ${file} -> ${id}`);

  // Sips resizing (only if not already generated to save time)
  if (!fs.existsSync(displayPath)) {
    execSync(`sips -Z 2048 "${inputPath}" --out "${displayPath}" > /dev/null 2>&1`);
  }
  if (!fs.existsSync(thumbPath)) {
    execSync(`sips -Z 800 "${inputPath}" --out "${thumbPath}" > /dev/null 2>&1`);
  }
  execSync(`sips -Z 20 "${inputPath}" --out "${tinyPath}" > /dev/null 2>&1`);

  const blurDataUrl = "data:image/jpeg;base64," + fs.readFileSync(tinyPath).toString("base64");
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
    console.warn(`Could not read EXIF for ${file}:`, err.message);
  }

  const camera = exif.Model ? `FUJIFILM ${exif.Model.replace(/^FUJIFILM\s*/i, "")}` : "FUJIFILM X-T5";
  const lens = lensOverride || formatLensModel(exif.LensModel, exif.FocalLength);
  const aperture = formatFNumber(exif.FNumber);
  const shutterSpeed = formatExposureTime(exif.ExposureTime);
  const iso = exif.ISO ? `ISO ${exif.ISO}` : "ISO 125";
  const focalLength = exif.FocalLength
    ? `${Math.round(exif.FocalLength)}mm`
    : (exif.FocalLengthIn35mmFormat ? `${Math.round(exif.FocalLengthIn35mmFormat)}mm` : "23mm");

  const profile = extractProfile(inputPath, profileOverride);

  let dateTaken = "2025";
  if (exif.CreateDate instanceof Date && !isNaN(exif.CreateDate.getTime())) {
    dateTaken = exif.CreateDate.toISOString().split("T")[0];
  }

  return {
    id,
    series: seriesName,
    fileNumber: path.basename(file, path.extname(file)),
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
    profile,
    dateTaken,
    featured: false,
  };
}

function writePhotosFile(allPhotos) {
  // Deduplicate by ID
  const uniqueMap = new Map();
  for (const p of allPhotos) {
    uniqueMap.set(p.id, p);
  }
  const photosArray = Array.from(uniqueMap.values());

  const seriesCounts = {};
  for (const p of photosArray) {
    seriesCounts[p.series] = (seriesCounts[p.series] || 0) + 1;
  }

  const seriesList = [
    { id: "all", name: "All Works", count: photosArray.length },
    ...Object.entries(seriesCounts).map(([name, count]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      count
    }))
  ];

  const fileContent = `// Auto-generated by scripts/ingest.mjs
// Titles are optional: if omitted, the UI displays clean series & camera details.
// Profile defaults to true base simulation / recipe extracted from EXIF.

export interface Photo {
  id: string;
  title?: string;
  series: string;
  fileNumber: string;
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
  profile?: string;
  dateTaken: string;
  featured: boolean;
}

export const photos: Photo[] = ${JSON.stringify(photosArray, null, 2)};

export const seriesList = ${JSON.stringify(seriesList, null, 2)};
`;

  fs.mkdirSync(path.resolve("src/data"), { recursive: true });
  fs.writeFileSync(path.resolve("src/data/photos.ts"), fileContent);
  console.log(`\nSuccessfully updated src/data/photos.ts with ${photosArray.length} photos across ${Object.keys(seriesCounts).length} series!`);
}

async function run() {
  const rawArgs = process.argv.slice(2);
  let lensOverride = null;
  let profileOverride = null;
  const positionalArgs = [];

  for (const arg of rawArgs) {
    if (arg.startsWith("--lens=")) {
      lensOverride = arg.slice(7).replace(/^['"]|['"]$/g, "");
    } else if (arg.startsWith("--profile=")) {
      profileOverride = arg.slice(10).replace(/^['"]|['"]$/g, "");
    } else {
      positionalArgs.push(arg);
    }
  }

  // If a directory is passed: node scripts/ingest.mjs <dir> [series-name] [--lens="..."] [--profile="..."]
  if (positionalArgs.length > 0) {
    const rawPath = positionalArgs[0];
    const targetDir = resolveUserPath(rawPath);

    if (!fs.existsSync(targetDir)) {
      console.error(`Directory not found: ${targetDir}`);
      process.exit(1);
    }

    const seriesName = positionalArgs[1] || path.basename(targetDir);
    console.log(`\n--- Ingesting photos from: ${targetDir} as Series: "${seriesName}" ---`);
    if (lensOverride) console.log(`Lens Override: ${lensOverride}`);
    if (profileOverride) console.log(`Profile Override: ${profileOverride}`);

    // Load existing photos reliably by parsing photos.ts
    const existingPhotos = loadExistingPhotos();
    console.log(`Found ${existingPhotos.length} existing photos in library.`);

    const files = fs.readdirSync(targetDir).filter(f => /\.(jpe?g|png)$/i.test(f));
    if (files.length === 0) {
      console.log(`No images found in ${targetDir}`);
      return;
    }

    const newPhotos = [];
    for (const file of files) {
      const p = await processSinglePhoto({
        inputPath: path.join(targetDir, file),
        seriesName,
        profileOverride,
        lensOverride,
      });
      newPhotos.push(p);
    }

    writePhotosFile([...existingPhotos, ...newPhotos]);
    return;
  }

  // Default: Process baseline Hokkaido & Korea selection
  const HOKKAIDO_DIR = resolveUserPath("~/Desktop/Untitled Export/Hokkaido 2025");
  const KOREA_DIR = resolveUserPath("~/Desktop/Untitled Export/Korea 2025");

  const defaultList = [
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2592.jpg" },
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2621.jpg" },
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2732.jpg" },
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2792.jpg" },
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2836.jpg" },
    { series: "Hokkaido 25", dir: HOKKAIDO_DIR, file: "DSCF2972.jpg" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2059.JPG" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2110.jpg" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2175.jpg" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2220.jpg" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2267.jpg" },
    { series: "Seoul 25", dir: KOREA_DIR, file: "DSCF2316.jpg" },
  ];

  const existingPhotos = loadExistingPhotos();
  const results = [];
  for (const item of defaultList) {
    const p = await processSinglePhoto({
      inputPath: path.join(item.dir, item.file),
      seriesName: item.series,
    });
    results.push(p);
  }

  writePhotosFile([...existingPhotos, ...results]);
}

run().catch(console.error);
