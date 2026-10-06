// Write an approved pass into the photo files (editorial/README.md, "Running a pass", step 6).
//
//   node scripts/keyword.mjs editorial/passes/v2/<album>.tags.json            preview
//   node scripts/keyword.mjs editorial/passes/v2/<album>.tags.json --write    write
//
// Nothing is stated twice. Which photos and which place come from the collection files
// (src/data/collections/<place>.ts); the stars from the pass's ratings file (v2); the tags
// from the tags file:
//
//   {
//     "source": "Vietnam 2024",                       // folder under ~/Pictures/portfolio-source/
//     "ratings": "vietnam-24.ratings.json",           // next to the tags file; a list when a place
//                                                     // grew in a later pass (later files win)
//     "places": ["hanoi-24", "ha-long-bay-24"],       // collection ids
//     "files": {"DSCF7489": "20241124-DSCF7489-Enhanced-NR.JPG"},   // only where a number has two files
//     "tags": {"DSCF7496": ["waterfront"], ...}
//   }
//
// The preview prints every photo with its place, stars and tags, and what would change, so
// the tags can be reviewed before anything is written. Writing replaces the site|... keywords
// and the rating on the selected files, and removes the site|... keywords from any other file
// in the folder that still carries one of these places (a frame dropped on a re-run), so
// `ingest --keyworded` sees exactly the approved set. Other keywords are left alone.

import fs from "fs";
import os from "os";
import path from "path";
import { exiftool } from "exiftool-vendored";

const [tagsFile, flag] = process.argv.slice(2);
if (!tagsFile) {
  console.log("Usage: see the header of scripts/keyword.mjs");
  process.exit(1);
}
const write = flag === "--write";

const spec = JSON.parse(fs.readFileSync(tagsFile, "utf8"));
const dir = path.join(os.homedir(), "Pictures/portfolio-source", spec.source);
const knownTags = new Set(
  [...fs.readFileSync("src/data/tags.ts", "utf8").matchAll(/id: "([a-z-]+)"/g)].map((m) => m[1]),
);

// DSCF1234, DSCF1234-2 (Lightroom copy), DSCF1234(1) -> DSCF1234-1 (Google Photos copy),
// the same rule as ingest. "7489-Enhanced-NR" in a ratings file is DSCF7489.
function numberOf(name) {
  const s = String(name).toUpperCase();
  const m = s.match(/DSCF(\d+)(?:-(\d+)\b|\((\d+)\))?/) ?? s.match(/^(\d+)(?:-(\d+)\b|\((\d+)\))?/);
  if (!m) throw new Error(`No photo number in "${name}"`);
  const copy = m[2] ?? m[3];
  return `DSCF${m[1]}${copy ? `-${copy}` : ""}`;
}

const stars = {};
for (const r of [spec.ratings].flat()) {
  for (const f of JSON.parse(fs.readFileSync(path.join(path.dirname(tagsFile), r), "utf8")).frames) {
    stars[numberOf(f.n)] = f.v2;
  }
}

const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));
const problems = [];
const wanted = new Map(); // file name -> { number, place, rating, tags }

for (const place of spec.places) {
  const src = fs.readFileSync(`src/data/collections/${place}.ts`, "utf8");
  const ids = [...src.matchAll(/photos: \[([^\]]*)\]/g)].flatMap((m) => m[1].match(/DSCF[\w-]+/g) ?? []);
  for (const number of ids) {
    const candidates = files.filter((f) => numberOf(f) === number);
    const file = spec.files?.[number] ?? (candidates.length === 1 ? candidates[0] : undefined);
    if (!file) problems.push(`${number}: ${candidates.length} files (${candidates.join(", ") || "none"}); name one in "files"`);
    const tags = spec.tags[number] ?? [];
    if (tags.length === 0) problems.push(`${number}: no tags`);
    for (const t of tags) if (!knownTags.has(t)) problems.push(`${number}: unknown tag "${t}"`);
    const rating = stars[number];
    if (!rating) problems.push(`${number}: no rating in ${spec.ratings}`);
    if (file) wanted.set(file, { number, place, rating, tags });
  }
}
for (const n of Object.keys(spec.tags)) {
  if (![...wanted.values()].some((w) => w.number === n)) problems.push(`${n}: tagged but in no chapter`);
}
if (problems.length > 0) {
  console.error(problems.map((p) => `❌ ${p}`).join("\n"));
  await exiftool.end();
  process.exit(1);
}

const siteOf = (kw) => [kw ?? []].flat().map(String).filter((k) => k.startsWith("site|"));
let changes = 0;
let place = "";
for (const [file, w] of wanted) {
  const current = await exiftool.read(path.join(dir, file));
  const next = [`site|place|${w.place}`, ...w.tags.map((t) => `site|tag|${t}`)];
  const same = siteOf(current.HierarchicalSubject).join() === next.join() && current.Rating === w.rating;
  if (w.place !== place) console.log(`\n${(place = w.place)}`);
  console.log(`  ${same ? " " : "*"} ${w.number.padEnd(11)} ${"★".repeat(w.rating).padEnd(5)} ${w.tags.join(", ")}`);
  if (same) continue;
  changes++;
  if (write) {
    const others = [current.HierarchicalSubject ?? []].flat().map(String).filter((k) => !k.startsWith("site|"));
    const otherSubjects = [current.Subject ?? []].flat().map(String)
      .filter((k) => !siteOf(current.HierarchicalSubject).some((s) => s.endsWith(`|${k}`)));
    await exiftool.write(
      path.join(dir, file),
      { HierarchicalSubject: [...next, ...others], Subject: [w.place, ...w.tags, ...otherSubjects], Rating: w.rating },
      ["-overwrite_original"],
    );
  }
}

// Frames that carried one of these places before and no longer should
for (const file of files.filter((f) => !wanted.has(f))) {
  const current = await exiftool.read(path.join(dir, file));
  const site = siteOf(current.HierarchicalSubject);
  if (!site.some((k) => spec.places.some((p) => k === `site|place|${p}`))) continue;
  changes++;
  console.log(`  - ${numberOf(file).padEnd(11)} no longer selected: site keywords ${write ? "removed" : "to remove"}`);
  if (write) {
    await exiftool.write(
      path.join(dir, file),
      {
        HierarchicalSubject: [current.HierarchicalSubject ?? []].flat().map(String).filter((k) => !k.startsWith("site|")),
        Subject: [current.Subject ?? []].flat().map(String).filter((k) => !site.some((s) => s.endsWith(`|${k}`))),
      },
      ["-overwrite_original"],
    );
  }
}

console.log(
  `\n${wanted.size} photos, ${changes} ${write ? "written" : "to change (* and -)"}.` +
    (write || changes === 0 ? "" : " Review the tags above, then run again with --write."),
);
await exiftool.end();
