import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import { exiftool } from "exiftool-vendored";

const PUBLIC_PHOTOS_DIR = path.resolve("public/photos");
const DISPLAY_DIR = path.join(PUBLIC_PHOTOS_DIR, "display");
const THUMB_DIR = path.join(PUBLIC_PHOTOS_DIR, "thumb");
const RECIPES_FILE = path.resolve("src/data/recipes.json");

fs.mkdirSync(DISPLAY_DIR, { recursive: true });
fs.mkdirSync(THUMB_DIR, { recursive: true });

function formatExposureTime(val) {
  if (!val) return "1/250s";
  if (typeof val === "string") {
    const s = val.trim();
    if (s.includes("/")) {
      return s.endsWith("s") ? s : `${s}s`;
    }
    const num = parseFloat(s);
    if (!isNaN(num)) val = num;
  }
  if (typeof val === "number") {
    if (val >= 1) return `${Math.round(val * 10) / 10}s`;
    const denom = Math.round(1 / val);
    return `1/${denom}s`;
  }
  return `${val}s`;
}

function formatFocalLength(fl, fl35) {
  const target = fl || fl35;
  if (!target) return "23mm";
  if (typeof target === "number") return `${Math.round(target)}mm`;
  const m = String(target).match(/(\d+(\.\d+)?)/);
  return m ? `${Math.round(parseFloat(m[1]))}mm` : "23mm";
}

function formatFNumber(f) {
  if (!f) return "ƒ/--";
  const num = typeof f === "number" ? f : parseFloat(String(f).replace(/^[fƒ\/]\s*/i, ""));
  if (isNaN(num)) return `ƒ/${f}`;
  const rounded = Math.round(num * 10) / 10;
  return Number.isInteger(rounded) ? `ƒ/${rounded}.0` : `ƒ/${rounded}`;
}

function formatLensModel(lensModel, focalLength) {
  if (!lensModel) {
    return focalLength ? `Fujinon Lens (${Math.round(focalLength)}mm)` : "Fujinon Lens";
  }
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

function parseTone(val) {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  const m = String(val).match(/([+-]?\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function parseColor(val) {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  const m = String(val).match(/([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function parseSharpness(val) {
  if (val === undefined || val === null) return 0;
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
  return m ? parseInt(m[1], 10) : 0;
}


function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

function matchOrRecordRecipe(recipeDetails) {
  let recipes = [];
  try {
    if (fs.existsSync(RECIPES_FILE)) {
      recipes = JSON.parse(fs.readFileSync(RECIPES_FILE, "utf8"));
    }
  } catch (e) {
    recipes = [];
  }

  const { filmSimulation, wbShift } = recipeDetails;

  // 1. Look for matching recipe in table (exact or within ±1 shift tolerance)
  let match = recipes.find(r => {
    if (!r.filmSimulation && !r.baseFilmSim) return false;
    const sim = (r.filmSimulation || r.baseFilmSim).toLowerCase();
    const simMatch = sim === filmSimulation.toLowerCase();
    const rShift = Array.isArray(r.wbShift) ? r.wbShift : [0, 0];
    const wbMatch = Math.abs(rShift[0] - wbShift[0]) <= 1 && Math.abs(rShift[1] - wbShift[1]) <= 1;
    return simMatch && wbMatch;
  });

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

async function processSinglePhoto({ inputPath, seriesName, profileOverride = null, lensOverride = null }) {
  const file = path.basename(inputPath);
  const ext = path.extname(file);
  // Remove extension safely regardless of case
  const baseName = path.basename(file, ext).toLowerCase().replace(/\.(jpe?g|png)$/i, "");
  const id = `${slugify(seriesName)}-${baseName}`;
  const displayFileName = `${id}.jpg`;
  const thumbFileName = `${id}.jpg`;

  const displayPath = path.join(DISPLAY_DIR, displayFileName);
  const thumbPath = path.join(THUMB_DIR, thumbFileName);
  const tinyPath = `/tmp/tiny-${id}.jpg`;

  console.log(`Processing: ${file} -> ${id}`);

  // Resize with sips
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
  let width = widthMatch ? parseInt(widthMatch[1], 10) : 2048;
  let height = heightMatch ? parseInt(heightMatch[1], 10) : 1365;

  // Read full EXIF with exiftool
  const tags = await exiftool.read(inputPath);

  // Check EXIF orientation (5, 6, 7, 8 denote 90/270 degree rotation, requiring width/height swap for visual aspect ratio)
  const isRotated = tags.Orientation === 5 || tags.Orientation === 6 || tags.Orientation === 7 || tags.Orientation === 8 ||
    String(tags.Orientation).includes("90") || String(tags.Orientation).includes("270");

  if (isRotated && width > height) {
    const temp = width;
    width = height;
    height = temp;
  }
  const aspectRatio = Math.round((width / height) * 1000) / 1000;

  const camera = tags.Model ? `FUJIFILM ${String(tags.Model).replace(/^FUJIFILM\s*/i, "")}` : "FUJIFILM X-T5";
  const lens = lensOverride || formatLensModel(tags.LensModel, tags.FocalLength);
  const aperture = formatFNumber(tags.FNumber);
  const shutterSpeed = formatExposureTime(tags.ExposureTime);
  const iso = tags.ISO ? `ISO ${tags.ISO}` : "ISO 125";
  const focalLength = formatFocalLength(tags.FocalLength, tags.FocalLengthIn35mmFormat);

  let profile = profileOverride;
  let recipeDetails = undefined;

  if (!profile) {
    // 1. Check if edited in Lightroom (XMP CameraProfile)
    if (tags.CameraProfile) {
      const rawProfile = String(tags.CameraProfile)
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

      const normalized = nameMap[rawProfile.toLowerCase()] || (rawProfile ? `${rawProfile} · RAW Edit` : "RAW Edit");
      profile = normalized.endsWith("RAW Edit") ? normalized : `${normalized} · RAW Edit`;
    } 
    // 2. SOOC JPEG with Fujifilm MakerNotes
    else if (tags.FilmMode) {
      const filmSim = String(tags.FilmMode).trim();
      
      // White balance & shifts
      let wb = tags.WhiteBalance || "Auto";
      if (tags.ColorTemperature) wb = `${tags.ColorTemperature}K`;
      let wbShift = [0, 0];
      let wbShiftStr = "";
      if (tags.WhiteBalanceFineTune) {
        const m = String(tags.WhiteBalanceFineTune).match(/Red\s+([+-]?\d+),\s*Blue\s+([+-]?\d+)/i);
        if (m) {
          const r = Math.round(parseInt(m[1], 10) / 20);
          const b = Math.round(parseInt(m[2], 10) / 20);
          wbShift = [r, b];
          wbShiftStr = ` (R:${r >= 0 ? "+" + r : r}, B:${b >= 0 ? "+" + b : b})`;
        }
      }

      // Dynamic Range
      let dr = "DR100";
      if (tags.DevelopmentDynamicRange) dr = `DR${tags.DevelopmentDynamicRange}`;
      else if (typeof tags.DynamicRange === "number") dr = `DR${tags.DynamicRange}`;
      else if (tags.DynamicRange && String(tags.DynamicRange).includes("400")) dr = "DR400";
      else if (tags.DynamicRange && String(tags.DynamicRange).includes("200")) dr = "DR200";

      let ecStr = "0 EV";
      if (tags.ExposureCompensation !== undefined && tags.ExposureCompensation !== null) {
        const ec = tags.ExposureCompensation;
        if (typeof ec === "number") {
          ecStr = (ec > 0 ? `+${ec}` : `${ec}`) + " EV";
        } else {
          const s = String(ec).trim();
          ecStr = (s.startsWith("+") || s.startsWith("-") ? s : `+${s}`) + " EV";
        }
      }

      recipeDetails = {
        filmSimulation: filmSim,
        dynamicRange: dr,
        highlight: parseTone(tags.HighlightTone),
        shadow: parseTone(tags.ShadowTone),
        color: parseColor(tags.Saturation),
        noiseReduction: parseColor(tags.NoiseReduction),
        sharpening: parseSharpness(tags.Sharpness),
        clarity: typeof tags.Clarity === "number" ? tags.Clarity : 0,
        grainEffect: (tags.GrainEffectRoughness && tags.GrainEffectRoughness !== "Off")
          ? `${tags.GrainEffectRoughness}, ${tags.GrainEffectSize || "Small"}`
          : "Off",
        colorChromeEffect: tags.ColorChromeEffect || "Off",
        colorChromeFXBlue: tags.ColorChromeFXBlue || "Off",
        whiteBalance: `${wb}${wbShiftStr}`,
        wbShift,
        iso: tags.ISO ? `ISO ${tags.ISO}` : "ISO 125",
        exposureCompensation: ecStr
      };

      const res = matchOrRecordRecipe(recipeDetails);
      profile = res.profile;
    } else {
      profile = "Reala Ace · RAW Edit";
    }
  }

  let dateTaken = "";
  if (tags.DateTimeOriginal) {
    try {
      const dt = tags.DateTimeOriginal;
      if (dt.year && dt.month && dt.day) {
        const y = dt.year;
        const m = String(dt.month).padStart(2, "0");
        const d = String(dt.day).padStart(2, "0");
        dateTaken = ;
      } else if (typeof dt.toDate === "function") {
        dateTaken = dt.toDate().toISOString().split("T")[0];
      } else {
        const raw = dt.rawValue || String(dt);
        const match = raw.match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})/);
        if (match) {
          dateTaken = ;
        }
      }
    } catch {}
  }
  if (!dateTaken) {
    dateTaken = new Date().toISOString().split("T")[0];
  }

  return {
    id,
    series: seriesName,
    fileNumber: path.basename(file, ext).toUpperCase(),
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
    recipeDetails,
    dateTaken,
    featured: false,
  };
}

function writePhotosFile(allPhotos) {
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
      id: slugify(name),
      name,
      count
    }))
  ];

  const fileContent = `// Auto-generated by scripts/ingest.mjs
// Accurate EXIF-based lens, simulation, and recipe metadata.

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
  wbShift?: [number, number];
  iso?: string;
  exposureCompensation?: string;
}

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
  recipeDetails?: RecipeDetails;
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
  try {
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

    // Default: Process baseline Hokkaido, Seoul, & Sokcho selection
    const HOKKAIDO_DIR = resolveUserPath("~/Desktop/Untitled Export/Hokkaido 2025");
    const KOREA_DIR = resolveUserPath("~/Desktop/Untitled Export/Korea 2025");
    const SOKCHO_DIR = resolveUserPath("~/Desktop/Untitled Export/Sokcho 25 Photos");

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
      if (fs.existsSync(path.join(item.dir, item.file))) {
        const p = await processSinglePhoto({
          inputPath: path.join(item.dir, item.file),
          seriesName: item.series,
        });
        results.push(p);
      }
    }

    writePhotosFile([...existingPhotos, ...results]);
  } finally {
    await exiftool.end();
  }
}

run().catch(console.error);
