import fs from "fs";
import path from "path";
import os from "os";
import { exiftool } from "exiftool-vendored";
import { renderPhotoImages, removePhotoImages } from "./lib/images.mjs";

const RECIPES_FILE = path.resolve("src/data/recipes.json");
// Generated data only. Titles, featured, hidden and order live in src/data/curation.ts,
// which this script never touches, so re-ingesting can't wipe them.
const PHOTOS_FILE = path.resolve("src/data/photos.json");

const USAGE = `Usage:
  npm run ingest -- <folder> ["Series Name"] [--lens="..."] [--profile="..."]
      Add or update every JPEG in <folder> as the given series (default: folder name).

  npm run ingest -- <folder> ["Series Name"] --keyworded
      Editorial mode: ingest only the photos carrying a site|place keyword, and make them
      the series' complete set, removing any earlier photos of that series. The place
      keyword must match the series id (e.g. site|place|seoul-25 for "Seoul 25").

  npm run ingest -- --refresh <folder> [<folder>...]
      Re-render images and re-read EXIF for photos already in the library, matched by
      file number (DSCF1234). Keeps each photo's id and series; other files are skipped.
      Use the camera JPEG or Lightroom export as the source, never public/photos.`;

// Formatters return undefined when EXIF lacks the value: the site shows only what is known.

function formatExposureTime(val) {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "string") {
    const s = val.trim();
    if (s.includes("/")) {
      return s.endsWith("s") ? s : `${s}s`;
    }
    const num = parseFloat(s);
    if (isNaN(num)) return undefined;
    val = num;
  }
  if (typeof val !== "number" || val <= 0) return undefined;
  if (val >= 1) return `${Math.round(val * 10) / 10}s`;
  return `1/${Math.round(1 / val)}s`;
}

function formatFocalLength(fl, fl35) {
  const target = fl || fl35;
  if (!target) return undefined;
  if (typeof target === "number") return `${Math.round(target)}mm`;
  const m = String(target).match(/(\d+(\.\d+)?)/);
  return m ? `${Math.round(parseFloat(m[1]))}mm` : undefined;
}

function formatFNumber(f) {
  if (!f) return undefined;
  const num = typeof f === "number" ? f : parseFloat(String(f).replace(/^[fƒ\/]\s*/i, ""));
  if (isNaN(num)) return undefined;
  const rounded = Math.round(num * 10) / 10;
  return Number.isInteger(rounded) ? `ƒ/${rounded}.0` : `ƒ/${rounded}`;
}

function formatLensModel(lensModel) {
  if (!lensModel) return undefined;
  let cleaned = String(lensModel).trim();
  if (/^23\.0\s*mm\s*f\/1\.4/i.test(cleaned)) {
    return "XF23mmF1.4 R LM WR";
  }
  if (/^35\.0\s*mm\s*f\/2\.0/i.test(cleaned)) {
    return "XF35mmF2 R WR";
  }
  if (/^70-300mm/i.test(cleaned)) {
    return "XF70-300mmF4-5.6 R LM OIS WR";
  }
  cleaned = cleaned.replace(/^(FUJIFILM|FUJINON)(\s+LENS)?\s+/i, "");
  return cleaned;
}

function formatExposureCompensation(ec) {
  if (ec === undefined || ec === null || ec === "") return undefined;
  const num = typeof ec === "number" ? ec : parseFloat(String(ec));
  if (isNaN(num)) return undefined;
  if (num === 0) return "0 EV";
  return `${num > 0 ? "+" : ""}${Math.round(num * 100) / 100} EV`;
}

function parseTone(val) {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return val;
  const m = String(val).match(/([+-]?\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
}

function parseColor(val) {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return val;
  const m = String(val).match(/([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function parseSharpness(val) {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return val;
  const s = String(val).toLowerCase();
  if (s.includes("softest")) return -4;
  if (s.includes("very soft")) return -3;
  if (s.includes("medium soft")) return -1;
  if (s.includes("soft")) return -2;
  if (s.includes("hardest")) return 4;
  if (s.includes("very hard")) return 3;
  if (s.includes("medium hard")) return 1;
  if (s.includes("hard")) return 2;
  if (s.includes("normal")) return 0;
  const m = s.match(/([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function formatDynamicRange(tags) {
  if (tags.DevelopmentDynamicRange) return `DR${tags.DevelopmentDynamicRange}`;
  // DR Auto: the camera records the value it picked, e.g. AutoDynamicRange "200%"
  if (String(tags.DynamicRangeSetting ?? "").toLowerCase() === "auto") {
    const picked = String(tags.AutoDynamicRange ?? "").match(/\d+/)?.[0];
    return picked ? `Auto (DR${picked})` : "Auto";
  }
  if (typeof tags.DynamicRange === "number") return `DR${tags.DynamicRange}`;
  const s = String(tags.DynamicRange ?? "");
  if (s.includes("400")) return "DR400";
  if (s.includes("200")) return "DR200";
  if (s.includes("100")) return "DR100";
  return undefined;
}

function formatDateTaken(dt) {
  if (!dt) return undefined;
  try {
    if (dt.year && dt.month && dt.day) {
      return `${dt.year}-${String(dt.month).padStart(2, "0")}-${String(dt.day).padStart(2, "0")}`;
    }
    // EXIF writes "YYYY:MM:DD HH:MM:SS", which new Date() can't parse
    const match = String(dt.rawValue || dt).match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  } catch {}
  return undefined;
}

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveUserPath(inputPath) {
  if (inputPath.startsWith("~")) {
    return path.join(os.homedir(), inputPath.slice(1));
  }
  return path.resolve(inputPath);
}

// The camera number (DSCF1234), plus a copy suffix for a second edit of a frame:
// Lightroom's DSCF1234-2, or Google Photos' DSCF1234(1), which becomes DSCF1234-1 so it
// stays URL-safe (Lightroom's copies start at -2, so the two can't collide). Google Photos
// downloads can also carry a date prefix (20240521-DSCF4871.JPG), which isn't part of the
// number. Names without a camera number are used whole.
function fileNumberOf(fileName) {
  const base = path.basename(fileName, path.extname(fileName)).toUpperCase();
  const m = base.match(/(DSCF\d+)(?:-(\d+)|\((\d+)\))?/);
  if (!m) return base;
  const copy = m[2] ?? m[3];
  return copy ? `${m[1]}-${copy}` : m[1];
}

function listImages(dir) {
  return fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f));
}

function loadPhotos() {
  if (!fs.existsSync(PHOTOS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf8"));
}

function savePhotos(photos) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2) + "\n");
  const series = new Set(photos.map((p) => p.series));
  console.log(`\nWrote src/data/photos.json: ${photos.length} photos across ${series.size} series.`);
}

function matchOrRecordRecipe(recipeDetails) {
  let recipes = [];
  try {
    if (fs.existsSync(RECIPES_FILE)) {
      recipes = JSON.parse(fs.readFileSync(RECIPES_FILE, "utf8"));
    }
  } catch {
    recipes = [];
  }

  const { filmSimulation } = recipeDetails;
  const wbShift = recipeDetails.wbShift ?? [0, 0];

  // 1. Look for matching recipe in table: an exact WB shift wins, otherwise the
  //    closest one within ±1 (two recipes on one simulation can sit 1 step apart)
  const match = recipes
    .filter(r => {
      if (!r.filmSimulation && !r.baseFilmSim) return false;
      const sim = (r.filmSimulation || r.baseFilmSim).toLowerCase();
      return sim === filmSimulation.toLowerCase();
    })
    .map(r => {
      const rShift = Array.isArray(r.wbShift) ? r.wbShift : [0, 0];
      return { r, dist: Math.max(Math.abs(rShift[0] - wbShift[0]), Math.abs(rShift[1] - wbShift[1])) };
    })
    .filter(c => c.dist <= 1)
    .sort((a, b) => a.dist - b.dist)[0]?.r;

  if (match) {
    if (match.name.startsWith("TODO:")) {
      return { profile: `${filmSimulation} · Custom Recipe`, recipe: match };
    }
    return { profile: `${match.name} · SOOC`, recipe: match };
  }

  // 2. Uncataloged custom recipe -> Record complete spec into recipes.json
  const rSign = wbShift[0] >= 0 ? `+${wbShift[0]}` : `${wbShift[0]}`;
  const bSign = wbShift[1] >= 0 ? `+${wbShift[1]}` : `${wbShift[1]}`;
  const newId = `custom-${slugify(filmSimulation)}-r${wbShift[0]}-b${wbShift[1]}`;

  const newEntry = {
    id: newId,
    name: `TODO: Name this recipe (${filmSimulation} R:${rSign} B:${bSign})`,
    ...recipeDetails,
    userCustom: true,
    firstSeen: new Date().toISOString().split("T")[0]
  };

  recipes.push(newEntry);
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2), "utf8");
  console.log(`✨ [Recipe Table] Recorded uncataloged recipe: ${filmSimulation} (WB R:${rSign}, B:${bSign}) to src/data/recipes.json`);

  return { profile: `${filmSimulation} · Custom Recipe`, recipe: newEntry };
}

const CAMERA_PROFILE_NAMES = {
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

// Lightroom edit (XMP CameraProfile), SOOC JPEG (Fujifilm MakerNotes), or unknown
function readProfile(tags) {
  if (tags.CameraProfile) {
    const rawProfile = String(tags.CameraProfile)
      .replace(/^Camera\s+/i, "")
      .replace(/\s+v\d+$/i, "")
      .replace(/\/Standard/i, "")
      .trim();
    const normalized = CAMERA_PROFILE_NAMES[rawProfile.toLowerCase()] || (rawProfile ? `${rawProfile} · RAW Edit` : "RAW Edit");
    return { profile: normalized.endsWith("RAW Edit") ? normalized : `${normalized} · RAW Edit` };
  }

  if (!tags.FilmMode) return {};

  const filmSim = String(tags.FilmMode).trim();

  // White balance & shifts
  let wb = tags.WhiteBalance ? String(tags.WhiteBalance) : undefined;
  if (tags.ColorTemperature) wb = `${tags.ColorTemperature}K`;
  let wbShift;
  let wbShiftStr = "";
  const m = String(tags.WhiteBalanceFineTune ?? "").match(/Red\s+([+-]?\d+),\s*Blue\s+([+-]?\d+)/i);
  if (m) {
    const r = Math.round(parseInt(m[1], 10) / 20);
    const b = Math.round(parseInt(m[2], 10) / 20);
    wbShift = [r, b];
    wbShiftStr = ` (R:${r >= 0 ? "+" + r : r}, B:${b >= 0 ? "+" + b : b})`;
  }

  const grainRoughness = tags.GrainEffectRoughness ? String(tags.GrainEffectRoughness) : undefined;
  const recipeDetails = {
    filmSimulation: filmSim,
    dynamicRange: formatDynamicRange(tags),
    highlight: parseTone(tags.HighlightTone),
    shadow: parseTone(tags.ShadowTone),
    color: parseColor(tags.Saturation),
    noiseReduction: parseColor(tags.NoiseReduction),
    sharpening: parseSharpness(tags.Sharpness),
    clarity: typeof tags.Clarity === "number" ? tags.Clarity : undefined,
    grainEffect: grainRoughness && grainRoughness !== "Off"
      ? [grainRoughness, tags.GrainEffectSize].filter(Boolean).join(", ")
      : grainRoughness,
    colorChromeEffect: tags.ColorChromeEffect,
    colorChromeFXBlue: tags.ColorChromeFXBlue,
    whiteBalance: wb ? `${wb}${wbShiftStr}` : undefined,
    wbShift,
    iso: tags.ISO ? `ISO ${tags.ISO}` : undefined,
    exposureCompensation: formatExposureCompensation(tags.ExposureCompensation),
  };

  return { profile: matchOrRecordRecipe(recipeDetails).profile, recipeDetails };
}

// Tag ids from the vocabulary, so a keyword typo is reported instead of becoming a tag
const KNOWN_TAG_IDS = new Set(
  [...fs.readFileSync(path.resolve("src/data/tags.ts"), "utf8").matchAll(/id: "([a-z-]+)"/g)].map((m) => m[1])
);

// Editorial keywords: site|place|<id> and site|tag|<id> (Lightroom's hierarchical keywords)
function readSiteKeywords(tags, file) {
  const raw = tags.HierarchicalSubject ?? [];
  const keywords = (Array.isArray(raw) ? raw : [raw]).map(String);
  const place = keywords.find((k) => k.startsWith("site|place|"))?.split("|")[2];
  const siteTags = keywords.filter((k) => k.startsWith("site|tag|")).map((k) => k.split("|")[2]);
  for (const t of siteTags) {
    if (!KNOWN_TAG_IDS.has(t)) console.warn(`⚠️  ${file}: unknown tag "${t}" (not in src/data/tags.ts)`);
  }
  return { place, tags: siteTags.length > 0 ? siteTags : undefined };
}

async function processSinglePhoto({ inputPath, id, seriesName, profileOverride = null, lensOverride = null }) {
  console.log(`Processing: ${path.basename(inputPath)} -> ${id}`);

  const images = await renderPhotoImages(inputPath, id);
  const tags = await exiftool.read(inputPath);
  const { profile, recipeDetails } = profileOverride ? { profile: profileOverride } : readProfile(tags);
  const { place, tags: siteTags } = readSiteKeywords(tags, path.basename(inputPath));
  const rating = typeof tags.Rating === "number" && tags.Rating > 0 ? tags.Rating : undefined;

  return {
    id,
    series: seriesName,
    fileNumber: fileNumberOf(inputPath),
    ...images,
    camera: tags.Model ? `FUJIFILM ${String(tags.Model).replace(/^FUJIFILM\s*/i, "")}` : undefined,
    lens: lensOverride || formatLensModel(tags.LensModel),
    aperture: formatFNumber(tags.FNumber),
    shutterSpeed: formatExposureTime(tags.ExposureTime),
    iso: tags.ISO ? `ISO ${tags.ISO}` : undefined,
    focalLength: formatFocalLength(tags.FocalLength, tags.FocalLengthIn35mmFormat),
    profile,
    recipeDetails,
    dateTaken: formatDateTaken(tags.DateTimeOriginal),
    place,
    tags: siteTags,
    rating,
  };
}

async function ingestFolder(targetDir, seriesName, overrides, keyworded) {
  let files = listImages(targetDir);
  const seriesId = slugify(seriesName);

  if (keyworded) {
    // Only photos the editorial pass selected: those carrying a site|place keyword
    const selected = [];
    for (const file of files) {
      const { place } = readSiteKeywords(await exiftool.read(path.join(targetDir, file)), file);
      if (!place) continue;
      if (place !== seriesId) {
        console.warn(`⚠️  ${file}: place keyword "${place}" doesn't match series "${seriesId}"; skipped`);
        continue;
      }
      selected.push(file);
    }
    console.log(`Keyworded: ${selected.length} of ${files.length} photos carry site|place|${seriesId}`);
    files = selected;
  }

  if (files.length === 0) {
    console.log(`No images to ingest from ${targetDir}`);
    return;
  }

  console.log(`\n--- Ingesting ${files.length} photos from ${targetDir} as "${seriesName}" ---`);
  let photos = loadPhotos();

  if (keyworded) {
    // The keyworded files are the series' complete set: drop anything else in it
    const keep = new Set(files.map((f) => `${seriesId}-${fileNumberOf(f).toLowerCase()}`));
    const leaving = photos.filter((p) => slugify(p.series) === seriesId && !keep.has(p.id));
    for (const p of leaving) {
      removePhotoImages(p.id);
      console.log(`Removed: ${p.id}`);
    }
    photos = photos.filter((p) => !leaving.includes(p));
  }

  const byId = new Map(photos.map((p) => [p.id, p]));

  for (const file of files) {
    const id = `${slugify(seriesName)}-${fileNumberOf(file).toLowerCase()}`;
    const photo = await processSinglePhoto({ inputPath: path.join(targetDir, file), id, seriesName, ...overrides });
    if (byId.has(id)) {
      photos[photos.indexOf(byId.get(id))] = photo;
    } else {
      photos.push(photo);
    }
    byId.set(id, photo);
  }

  savePhotos(photos);
}

async function refreshFromFolders(dirs) {
  const photos = loadPhotos();
  const sources = new Map();
  for (const dir of dirs) {
    for (const file of listImages(dir)) {
      const fileNumber = fileNumberOf(file);
      sources.set(fileNumber, [...(sources.get(fileNumber) ?? []), path.join(dir, file)]);
    }
  }

  const missing = [];
  const ambiguous = [];
  for (const [i, existing] of photos.entries()) {
    const candidates = sources.get(existing.fileNumber) ?? [];
    if (candidates.length === 0) {
      missing.push(existing.id);
      continue;
    }
    // The camera counter wraps at 9999, so one file number can exist in two folders
    if (candidates.length > 1) {
      ambiguous.push(`${existing.id}: ${candidates.join(", ")}`);
      continue;
    }
    photos[i] = await processSinglePhoto({ inputPath: candidates[0], id: existing.id, seriesName: existing.series });
  }

  savePhotos(photos);
  if (missing.length > 0) {
    console.log(`No source found for ${missing.length} photo(s), left unchanged:\n  ${missing.join("\n  ")}`);
  }
  if (ambiguous.length > 0) {
    console.log(`Several sources for ${ambiguous.length} photo(s), left unchanged:\n  ${ambiguous.join("\n  ")}`);
  }
}

async function run() {
  const overrides = {};
  const positional = [];
  let refresh = false;
  let keyworded = false;

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--lens=")) overrides.lensOverride = arg.slice(7).replace(/^['"]|['"]$/g, "");
    else if (arg.startsWith("--profile=")) overrides.profileOverride = arg.slice(10).replace(/^['"]|['"]$/g, "");
    else if (arg === "--refresh") refresh = true;
    else if (arg === "--keyworded") keyworded = true;
    else positional.push(arg);
  }

  if (positional.length === 0) {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }

  const dirs = (refresh ? positional : positional.slice(0, 1)).map(resolveUserPath);
  const notFound = dirs.filter((d) => !fs.existsSync(d));
  if (notFound.length > 0) {
    console.error(`Directory not found: ${notFound.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  try {
    if (refresh) {
      await refreshFromFolders(dirs);
    } else {
      await ingestFolder(dirs[0], positional[1] || path.basename(dirs[0]), overrides, keyworded);
    }
  } finally {
    await exiftool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
