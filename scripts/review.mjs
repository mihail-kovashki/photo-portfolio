// Review images for an editorial pass (see editorial/README.md, "Running a pass").
// Reads a source folder of finished exports; writes only to the output folder.
//
//   node scripts/review.mjs sheets <folder> <out>
//       Contact sheets by day, 9 per page at 600px, labelled with file number and time.
//       600px is the first-look size: it shows glass reflections and intruding foreground,
//       which 450px missed; dust and soft focus need `view` and `crop` at any size.
//   node scripts/review.mjs view <folder> <out> <n> [<n>...]
//   node scripts/review.mjs view <folder> <out> --shortlist <album>.firstlook.json
//       One image per photo at 1400px on the long edge, for judging the frame: distractions,
//       glass, the light, whether a flaw seen on the sheet matters. Focus is the crop's job.
//       --shortlist reads the numbers from the first look's file instead of the command line.
//   node scripts/review.mjs twins <folder> <out> <n>,<n>[,<n>...] [...]
//   node scripts/review.mjs twins <folder> <out> --groups <album>.firstlook.json
//       Near-twin runs side by side at 1000px each, one image per run (four landscape or
//       three portrait frames to an image; a longer run continues on the next). For choosing
//       between twins, which a contact sheet is too small for. --groups reads the "groups"
//       of a first-look or cull file.
//   node scripts/review.mjs crop <folder> <out> <n>@<x>,<y> [...]
//       A 500px window at 100% of the export, centred on x,y (fractions of width and
//       height), for judging focus where the photo is meant to be sharp. Four crops per
//       output image, labelled, to keep a pass cheap. Give a frame two spots when its
//       subject is spread out or small (6390@0.3,0.6 6390@0.7,0.4).
//   node scripts/review.mjs chapters <folder> <selection.json> <out>
//       One sheet per chapter: {"ratings": {"6390": 4}, "sets": [[id, name, [n...]]]}.
//   node scripts/review.mjs fives <out>
//       Every 5★ photo on the site, on one sheet, from the site's own display images:
//       the bar a proposed 5★ is measured against (editorial/README.md).
//
// <n> is the camera number without "DSCF" (6390), with any copy suffix (6390-2, 2726(1)).

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { exiftool } from "exiftool-vendored";

// Every output image stays within 2000px on the long edge: Claude Code shows larger images
// to the model downscaled to that, so pixels beyond it cost time and buy nothing.
const VIEW_EDGE = 1400;
const TWIN_EDGE = 1000;
const CROP_SIZE = 500;

function keyOf(fileName) {
  const base = path.basename(fileName, path.extname(fileName)).toUpperCase();
  return base.match(/DSCF\d+.*$/)?.[0] ?? base;
}

function index(folder) {
  const map = new Map();
  for (const f of fs.readdirSync(folder)) {
    if (/\.(jpe?g|png)$/i.test(f)) map.set(keyOf(f), path.join(folder, f));
  }
  return map;
}

function find(files, n) {
  const key = `DSCF${String(n).toUpperCase()}`;
  const file = files.get(key);
  if (!file) throw new Error(`No file for ${n} (looked for ${key})`);
  return file;
}

function label(text, width, height = 28, size = 19) {
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return Buffer.from(
    `<svg width="${width}" height="${height}"><text x="8" y="${height - 8}" font-size="${size}" fill="#fff" font-family="Menlo">${safe}</text></svg>`,
  );
}

async function grid(items, out, { cols, cell }) {
  const L = 28;
  const rows = Math.ceil(items.length / cols);
  const comps = [];
  for (const [k, { file, text }] of items.entries()) {
    const img = await sharp(file).rotate().resize(cell - 6, cell - L - 6, { fit: "contain", background: "#111" }).toBuffer();
    const x = (k % cols) * cell;
    const y = Math.floor(k / cols) * cell;
    comps.push({ input: img, left: x + 3, top: y + 3 });
    comps.push({ input: label(text, cell), left: x, top: y + cell - L });
  }
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: "#000" } })
    .composite(comps)
    .jpeg({ quality: 82 })
    .toFile(out);
}

async function sheets(folder, out) {
  const files = [...index(folder).entries()];
  const dated = [];
  for (const [key, file] of files) {
    const tags = await exiftool.read(file);
    dated.push({ key, file, t: String(tags.DateTimeOriginal ?? "") });
  }
  dated.sort((a, b) => a.t.localeCompare(b.t) || a.key.localeCompare(b.key));
  const byDay = {};
  for (const d of dated) (byDay[d.t.slice(0, 10) || "undated"] ??= []).push(d);
  for (const [day, list] of Object.entries(byDay)) {
    for (let p = 0; p * 9 < list.length; p++) {
      const items = list.slice(p * 9, p * 9 + 9).map((d) => ({
        file: d.file,
        text: `${d.key.replace(/^DSCF/, "")}  ${d.t.slice(11, 16)}`,
      }));
      const name = path.join(out, `${day.replace(/\D/g, "-")}_${String(p + 1).padStart(2, "0")}.jpg`);
      await grid(items, name, { cols: 3, cell: 600 });
      console.log(name, items.length);
    }
  }
}

async function view(folder, out, nums) {
  const files = index(folder);
  for (const n of nums) {
    const name = path.join(out, `${n}.jpg`);
    await sharp(find(files, n))
      .rotate()
      .resize(VIEW_EDGE, VIEW_EDGE, { fit: "inside" })
      .jpeg({ quality: 88 })
      .toFile(name);
    console.log(name);
  }
}

async function twins(folder, out, groups) {
  const files = index(folder);
  const L = 28;
  for (const group of groups) {
    const first = await sharp(find(files, group[0])).metadata();
    const turned = (first.orientation ?? 1) >= 5;
    const portrait = (turned ? first.width : first.height) > (turned ? first.height : first.width);
    const w = portrait ? Math.floor((TWIN_EDGE * 2) / 3) : TWIN_EDGE;
    const h = portrait ? TWIN_EDGE : Math.floor((TWIN_EDGE * 2) / 3);
    const cols = portrait ? 3 : 2;
    const perImage = portrait ? 3 : 4;
    for (let p = 0; p * perImage < group.length; p++) {
      const part = group.slice(p * perImage, p * perImage + perImage);
      const comps = [];
      for (const [k, n] of part.entries()) {
        const img = await sharp(find(files, n)).rotate().resize(w, h, { fit: "contain", background: "#111" }).toBuffer();
        const x = (k % cols) * w, y = Math.floor(k / cols) * (h + L);
        comps.push({ input: img, left: x, top: y });
        comps.push({ input: label(`${p * perImage + k + 1}. ${n}`, w), left: x, top: y + h });
      }
      const rows = Math.ceil(part.length / cols);
      const suffix = p > 0 ? `_${p + 1}` : "";
      const name = path.join(out, `twins_${group[0]}${suffix}.jpg`);
      await sharp({ create: { width: Math.min(part.length, cols) * w, height: rows * (h + L), channels: 3, background: "#000" } })
        .composite(comps)
        .jpeg({ quality: 88 })
        .toFile(name);
      console.log(name, part.join(" "));
    }
  }
}

async function crop(folder, out, specs) {
  const files = index(folder);
  const tiles = [];
  for (const spec of specs) {
    const [n, at] = spec.split("@");
    const [fx, fy] = (at ?? "0.5,0.5").split(",").map(Number);
    const { data, info } = await sharp(find(files, n)).rotate().toBuffer({ resolveWithObject: true });
    const size = Math.min(CROP_SIZE, info.width, info.height);
    const left = Math.round(Math.min(Math.max(fx * info.width - size / 2, 0), info.width - size));
    const top = Math.round(Math.min(Math.max(fy * info.height - size / 2, 0), info.height - size));
    const tile = await sharp(data).extract({ left, top, width: size, height: size }).resize(CROP_SIZE, CROP_SIZE).toBuffer();
    tiles.push({ tile, text: `${n} @${fx},${fy}` });
  }
  const L = 28;
  for (let p = 0; p * 4 < tiles.length; p++) {
    const group = tiles.slice(p * 4, p * 4 + 4);
    const comps = [];
    for (const [k, { tile, text }] of group.entries()) {
      const x = (k % 2) * CROP_SIZE, y = Math.floor(k / 2) * (CROP_SIZE + L);
      comps.push({ input: tile, left: x, top: y });
      comps.push({ input: label(text, CROP_SIZE), left: x, top: y + CROP_SIZE });
    }
    const rows = Math.ceil(group.length / 2);
    const name = path.join(out, `crops_${String(p + 1).padStart(2, "0")}.jpg`);
    await sharp({ create: { width: 2 * CROP_SIZE, height: rows * (CROP_SIZE + L), channels: 3, background: "#000" } })
      .composite(comps)
      .jpeg({ quality: 92 })
      .toFile(name);
    console.log(name, group.map((g) => g.text).join(" | "));
  }
}

async function fives(out) {
  const photos = JSON.parse(fs.readFileSync(path.resolve("src/data/photos.json"), "utf8"));
  const items = photos
    .filter((p) => p.rating === 5)
    .map((p) => ({ file: path.join("public", p.displayUrl), text: `${p.series}  ${p.fileNumber.replace(/^DSCF/, "")}` }));
  if (items.length === 0) return console.log("No 5★ photos on the site yet.");
  const name = path.join(out, "fives.jpg");
  await grid(items, name, { cols: 3, cell: 560 });
  console.log(name, items.length);
}

function shortlistFrom(file) {
  const { shortlist } = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(shortlist) || shortlist.length === 0) throw new Error(`No "shortlist" array in ${file}`);
  return shortlist.map(String);
}

function groupsFrom(file) {
  const { groups } = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(groups) || groups.length === 0) throw new Error(`No "groups" array in ${file}`);
  return groups.map((g) => g.map(String));
}

async function chapters(folder, selectionFile, out) {
  const files = index(folder);
  const { ratings = {}, sets } = JSON.parse(fs.readFileSync(selectionFile, "utf8"));
  for (const [id, name, nums] of sets) {
    const items = nums.map((n, k) => ({ file: find(files, n), text: `${k + 1}. ${n}  ${"★".repeat(ratings[n] ?? 0)}` }));
    const file = path.join(out, `${id}.jpg`);
    await grid(items, file, { cols: 3, cell: 560 });
    const stars = nums.map((n) => ratings[n] ?? 0);
    console.log(file, name, nums.length, "avg", (stars.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
  }
}

const [cmd, folder, ...rest] = process.argv.slice(2);
try {
  if (cmd === "sheets") {
    fs.mkdirSync(rest[0], { recursive: true });
    await sheets(folder, rest[0]);
  } else if (cmd === "view") {
    fs.mkdirSync(rest[0], { recursive: true });
    const nums = rest[1] === "--shortlist" ? shortlistFrom(rest[2]) : rest.slice(1);
    await view(folder, rest[0], nums);
  } else if (cmd === "twins") {
    fs.mkdirSync(rest[0], { recursive: true });
    const groups = rest[1] === "--groups" ? groupsFrom(rest[2]) : rest.slice(1).map((g) => g.split(","));
    await twins(folder, rest[0], groups);
  } else if (cmd === "crop") {
    fs.mkdirSync(rest[0], { recursive: true });
    await crop(folder, rest[0], rest.slice(1));
  } else if (cmd === "fives") {
    fs.mkdirSync(folder, { recursive: true });
    await fives(folder);
  } else if (cmd === "chapters") {
    fs.mkdirSync(rest[1], { recursive: true });
    await chapters(folder, rest[0], rest[1]);
  } else {
    console.log("Usage: see the header of scripts/review.mjs");
    process.exitCode = 1;
  }
} finally {
  await exiftool.end();
}
