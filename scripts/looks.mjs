// The look behind a RAW edit: Lightroom's develop settings, read from the XMP that a
// Lightroom export ("All metadata") carries, reduced to what differs from a fresh import.
//
//   node scripts/looks.mjs <photo-id> [<photo-id>...]   add those photos to src/data/looks.json
//   node scripts/looks.mjs --all                        every RAW edit on the site
//   node scripts/looks.mjs --all --dry                  print the lines, write nothing
//   --source=<dir>   where the exports live (default ~/Pictures/portfolio-source)
//
// A photo is matched to its export by file number (DSCF1234), searching the source folder
// recursively; when two exports share a number (the camera counter wraps), the one whose
// site|place keyword matches the photo's place wins. Camera JPEGs (SOOC) carry no develop
// settings and are skipped: their look is the recipe in recipes.json.
//
// Prototype (looks-pages branch): photos.json doesn't hold this yet, so the site reads
// looks.json beside it. Folding it into ingest is the full version.

import fs from "fs";
import path from "path";
import os from "os";
import { exiftool } from "exiftool-vendored";

const PHOTOS_FILE = path.resolve("src/data/photos.json");
const LOOKS_FILE = path.resolve("src/data/looks.json");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const ids = args.filter((a) => !a.startsWith("--"));
const sourceRoot = (option("source") ?? "~/Pictures/portfolio-source").replace(/^~/, os.homedir());

if (!flag("all") && ids.length === 0) {
  console.error("Usage: node scripts/looks.mjs <photo-id>... | --all [--dry] [--source=<dir>]");
  process.exit(1);
}

// ---- Formatting -------------------------------------------------------------------

const MINUS = "−";
const num = (v) => (v === undefined || v === null || v === "" ? 0 : Number(String(v).replace(/^\+/, "")));
const signed = (n, digits = 0) => {
  const s = Math.abs(n).toFixed(digits);
  return n > 0 ? `+${s}` : n < 0 ? `${MINUS}${s}` : s;
};

// Lightroom's names for the Fujifilm camera profiles, as the site writes the simulations
const PROFILE_NAMES = {
  "Camera REALA ACE v2": "Reala Ace",
  "Camera PROVIA/Standard": "Provia",
  "Camera Velvia/Vivid": "Velvia",
  "Camera ASTIA/Soft": "Astia",
  "Camera CLASSIC CHROME": "Classic Chrome",
  "Camera CLASSIC Neg": "Classic Neg",
  "Camera NOSTALGIC Neg": "Nostalgic Neg",
  "Camera ETERNA/Cinema": "Eterna",
  "Camera ACROS": "Acros",
  "Camera Pro Neg Hi": "Pro Neg Hi",
  "Camera Pro Neg Std": "Pro Neg Std",
};
const profileName = (p) => PROFILE_NAMES[p] ?? String(p ?? "").replace(/^Camera /, "");

const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

// The global sliders in Lightroom's panel order. All default to 0 on a fresh import.
const SLIDERS = [
  ["Exposure", "Exposure2012", 2],
  ["Contrast", "Contrast2012"],
  ["Highlights", "Highlights2012"],
  ["Shadows", "Shadows2012"],
  ["Whites", "Whites2012"],
  ["Blacks", "Blacks2012"],
  ["Texture", "Texture"],
  ["Clarity", "Clarity2012"],
  ["Dehaze", "Dehaze"],
  ["Vibrance", "Vibrance"],
  ["Saturation", "Saturation"],
];

const HSL_COLOURS = ["Red", "Orange", "Yellow", "Green", "Aqua", "Blue", "Purple", "Magenta"];

function isLinearCurve(points) {
  const p = list(points).map((s) => String(s).replace(/\s/g, ""));
  return p.length === 0 || (p.length === 2 && p[0] === "0,0" && p[1] === "255,255");
}

/** The develop settings that differ from a fresh import, or undefined for a camera JPEG. */
export function lookFromXmp(x) {
  if (x.ProcessVersion === undefined) return undefined;

  // What the edit is built on: the profile, plus a creative profile layered over it
  const base = [profileName(x.CameraProfile)];
  if (x.LookName) {
    const amount = x.LookAmount !== undefined && num(x.LookAmount) !== 1 ? ` ${Math.round(num(x.LookAmount) * 100)}%` : "";
    base.push(`${profileName(x.LookName)}${amount}`);
  }
  if (x.ConvertToGrayscale === true || x.ConvertToGrayscale === "True") base.push("B&W");

  const settings = [];
  if (x.WhiteBalance && x.WhiteBalance !== "As Shot") {
    const tint = num(x.Tint);
    settings.push(["WB", `${x.ColorTemperature}K${tint ? ` ${signed(tint)}` : ""}`]);
  }
  for (const [label, key, digits] of SLIDERS) {
    const v = num(x[key]);
    if (v) settings.push([label, signed(v, digits)]);
  }
  const vignette = num(x.PostCropVignetteAmount);
  if (vignette) settings.push(["Vignette", signed(vignette)]);
  const grain = num(x.GrainAmount);
  if (grain) settings.push(["Grain", String(grain)]);

  // The rest is named, not spelled out: there are too many values for one line
  const more = [];
  const parametric = ["ParametricShadows", "ParametricDarks", "ParametricLights", "ParametricHighlights"].some((k) => num(x[k]));
  const curves = ["", "Red", "Green", "Blue"].some((c) => !isLinearCurve(x[`ToneCurvePV2012${c}`]));
  if (parametric || curves) more.push("Tone curve");
  const hsl = HSL_COLOURS.filter((c) =>
    ["HueAdjustment", "SaturationAdjustment", "LuminanceAdjustment"].some((k) => num(x[`${k}${c}`])),
  );
  if (hsl.length) more.push(`HSL: ${hsl.join(", ").toLowerCase()}`);
  const grading = [
    "SplitToningShadowSaturation", "SplitToningHighlightSaturation", "ColorGradeMidtoneSat", "ColorGradeGlobalSat",
    "ColorGradeShadowLum", "ColorGradeMidtoneLum", "ColorGradeHighlightLum", "ColorGradeGlobalLum",
  ].some((k) => num(x[k]));
  if (grading) more.push("Colour grading");
  const calibration = ["ShadowTint", "RedHue", "RedSaturation", "GreenHue", "GreenSaturation", "BlueHue", "BlueSaturation"].some((k) => num(x[k]));
  if (calibration) more.push("Calibration");
  const masks = list(x.MaskGroupBasedCorrCorrectionName);
  if (masks.length) {
    // Lightroom's default names ("Mask 1") say nothing; named masks say what was worked on
    const named = masks.filter((m) => !/^Mask \d+( Inverted)?$/.test(m));
    more.push(`${masks.length} mask${masks.length > 1 ? "s" : ""}${named.length ? `: ${named.join(", ").toLowerCase()}` : ""}`);
  }

  return { base: base.join(" + "), settings, more };
}

export const lookLine = (look) =>
  [look.base, ...look.settings.map(([l, v]) => `${l} ${v}`), ...look.more].join(" · ");

// ---- Matching photos to exports ---------------------------------------------------

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.jpe?g$/i.test(e.name) ? [p] : [];
  });
}

function fileNumberOf(file) {
  const base = path.basename(file, path.extname(file)).toUpperCase();
  const m = base.match(/(DSCF\d+)(?:-(\d+)|\((\d+)\))?/);
  if (!m) return base;
  const copy = m[2] ?? m[3];
  return copy ? `${m[1]}-${copy}` : m[1];
}

const photos = JSON.parse(fs.readFileSync(PHOTOS_FILE, "utf8"));
const wanted = flag("all")
  ? photos.filter((p) => !p.recipeDetails && /RAW/.test(p.profile ?? ""))
  : ids.map((id) => photos.find((p) => p.id === id) ?? (console.error(`Unknown photo id: ${id}`), process.exit(1)));

const files = walk(sourceRoot);
const byNumber = new Map();
for (const f of files) byNumber.set(fileNumberOf(f), [...(byNumber.get(fileNumberOf(f)) ?? []), f]);

const looks = flag("dry") || !fs.existsSync(LOOKS_FILE) ? {} : JSON.parse(fs.readFileSync(LOOKS_FILE, "utf8"));
const missing = [];
try {
  for (const photo of wanted) {
    const candidates = byNumber.get(photo.fileNumber) ?? [];
    let found;
    for (const file of candidates) {
      const tags = await exiftool.read(file, { readArgs: ["-XMP-crs:all", "-XMP-lr:HierarchicalSubject"] });
      const look = lookFromXmp(tags);
      if (!look) continue;
      const places = list(tags.HierarchicalSubject).filter((s) => String(s).startsWith("site|place|"));
      const samePlace = places.includes(`site|place|${photo.place}`);
      if (!found || samePlace) found = { file, look };
      if (samePlace) break;
    }
    if (!found) {
      missing.push(photo.id);
      continue;
    }
    if (flag("dry")) console.log(`${photo.id}\t${photo.rating ?? ""}\t${lookLine(found.look)}`);
    else looks[photo.id] = { ...found.look, source: path.relative(sourceRoot, found.file) };
  }
} finally {
  await exiftool.end();
}

if (!flag("dry")) {
  const sorted = Object.fromEntries(Object.entries(looks).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(LOOKS_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`looks.json: ${Object.keys(sorted).length} photos`);
}
console.error(`${wanted.length - missing.length} of ${wanted.length} matched to an export with develop settings`);
if (missing.length) console.error(`No develop settings found for: ${missing.join(", ")}`);
