// Compare two editorial runs of one place, side by side, with notes on every section
// (see editorial/README.md, "Comparing two runs").
//
//   node scripts/compare.mjs serve <album>.compare.json [--port 3099]
//
// The compare file holds the judgement: which runs, their files, and the analysis written
// for them (a line per frame, chapter notes, themes, twin pairs, questions). Everything
// mechanical (who is shared, who moved, the rating grid) is computed here from the ratings
// and first-look files it names. The page is rebuilt on every load, so an edit to the
// compare file shows on reload.
//
// Notes typed on the page save to the file named by "notes" (beside the compare file),
// keyed by section: "page", "chapter:<slug>", "theme:<slug>", "grid", "twin:<slug>",
// "frame:<n>", "question:<slug>". Each is {"kind": "note"|"question"|"decision", "text",
// "updated"}. A note whose section is no longer on the page is listed at the top, never
// dropped.

import fs from "fs";
import os from "os";
import path from "path";
import http from "http";
import sharp from "sharp";

const SOURCE_ROOT = path.join(os.homedir(), "Pictures", "portfolio-source");
const IMG_EDGE = 820;

const [cmd, file, ...rest] = process.argv.slice(2);
if (cmd !== "serve" || !file) {
  console.error("usage: node scripts/compare.mjs serve <album>.compare.json [--port 3099]");
  process.exit(1);
}
const port = Number(rest[rest.indexOf("--port") + 1]) || 3099;
const compareFile = path.resolve(file);
const dir = path.dirname(compareFile);
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(dir, p), "utf8"));

function load() {
  const C = JSON.parse(fs.readFileSync(compareFile, "utf8"));
  const [r1, r2] = C.runs.map((r) => {
    const ratings = readJson(r.ratings);
    const firstlook = readJson(r.firstlook);
    const chapters = r.chapters ?? ratings.chapters;
    return { ...r, firstlook, chapters, frames: Object.fromEntries(ratings.frames.map((f) => [f.n, f])) };
  });
  return { C, r1, r2 };
}

const notesPath = (C) => path.join(dir, C.notes);
function readNotes(C) {
  try { return JSON.parse(fs.readFileSync(notesPath(C), "utf8")); } catch { return {}; }
}
function writeNotes(C, notes) {
  const sorted = Object.fromEntries(Object.keys(notes).sort().map((k) => [k, notes[k]]));
  const tmp = notesPath(C) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(sorted, null, 1) + "\n");
  fs.renameSync(tmp, notesPath(C));
}

// ---------- page ----------

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stars = (v) => (v ? "★".repeat(v) + `<span class="dim">${"★".repeat(5 - v)}</span>` : "—");

function build() {
  const { C, r1, r2 } = load();
  const A = r1.frames, B = r2.frames;
  const v1 = (n) => A[n]?.v2 ?? null, v2 = (n) => B[n]?.v2 ?? null;
  const F = C.frames;
  const keys = new Set(["page", "grid"]);

  const pos = (run) => {
    const m = {};
    run.chapters.forEach((c) => c.photos.forEach((n, i) => (m[n] = { name: c.name, i: i + 1, of: c.photos.length })));
    return m;
  };
  const pos1 = pos(r1), pos2 = pos(r2);
  const sel1 = r1.chapters.flatMap((c) => c.photos), sel2 = r2.chapters.flatMap((c) => c.photos);
  const shared = sel2.filter((n) => sel1.includes(n));
  const out = sel1.filter((n) => !sel2.includes(n));
  const inn = sel2.filter((n) => !sel1.includes(n));

  const posted = {};
  const ig = r2.firstlook.instagram ?? r1.firstlook.instagram ?? {};
  for (const p of Object.values(ig)) p.frames.forEach((n, i) => (posted[n] = `posted: ${p.theme.split(":")[0].replace(/\(.*\)/, "").trim()} #${i + 1}${i === 0 ? " · cover" : ""}`));
  const nonBlind = (n) => Object.entries(C.nonBlind ?? {}).filter(([, ns]) => ns.includes(n)).map(([k]) => k);

  const status = (run, n) => {
    const fl = run.firstlook, s = [];
    for (const [k, v] of Object.entries(fl.rejects ?? {})) if (v.includes(n)) s.push(`sheet ${k}★`);
    if (fl.shortlist?.includes(n)) s.push("shortlisted");
    if (fl.reserve?.includes(n)) s.push("reserve");
    if (fl.held?.includes(n)) s.push("held (not viewed at size)");
    if (fl.parked?.includes(n)) s.push("parked at the first look");
    for (const g of fl.groups ?? []) {
      if (!g.includes(n)) continue;
      if (g[0] !== n) s.push(`twin, lost to ${g[0]}`);
      else if (g.length > 1) s.push(`won its twin run over ${g.slice(1).join(", ")}`);
    }
    if (C.notInSource?.[run.id]?.includes(n)) s.push(`not in ${run.label}’s source`);
    return s.join(" · ") || "—";
  };

  const note = (key, label) => {
    keys.add(key);
    return `<div class="note" data-key="${esc(key)}"><button class="addnote" type="button" aria-expanded="false">+ Note${label ? ` on ${esc(label)}` : ""}</button>
<div class="noteui" hidden><div class="kinds" role="radiogroup" aria-label="Kind of note">
<label><input type="radio" name="k-${esc(key)}" value="note" checked> note</label>
<label><input type="radio" name="k-${esc(key)}" value="question"> question for Claude</label>
<label><input type="radio" name="k-${esc(key)}" value="decision"> decision</label><span class="saved" aria-live="polite"></span></div>
<textarea rows="3" aria-label="Note${label ? ` on ${esc(label)}` : ""}" placeholder="Type or dictate…"></textarea></div></div>`;
  };

  const thumb = (n, run) => {
    const r = run === 1 ? v1(n) : v2(n) ?? (F[n]?.seenNow ? F[n].seenNow.rating : v1(n));
    return `<a href="#f-${n}" class="th ${shared.includes(n) ? "sh" : ""}" title="DSCF${n}"><img src="/img/${n}" alt="${n}" loading="lazy"><span>${n} · ${r ?? "–"}★</span></a>`;
  };
  const strip = (ns, run = 2) => `<div class="strip">${ns.map((n) => thumb(n, run)).join("")}</div>`;

  const badge = (n) => {
    const a = v1(n), b = v2(n);
    if (b == null && F[n]?.seenNow) return `<span class="mv seen">${a}★ → <em>not seen</em> <small>(seen now: ${F[n].seenNow.rating}★)</small></span>`;
    if (a == null && b == null) return "";
    if (a == null) return `<span class="mv new">not rated → ${b}★</span>`;
    if (b == null) return `<span class="mv">${a}★ → not rated</span>`;
    const c = b > a ? "up" : b < a ? "down" : "same";
    return `<span class="mv ${c}">${a}★ ${b > a ? "↑" : b < a ? "↓" : "="} ${b}★</span>`;
  };
  const where = (m, n) => (m[n] ? `${esc(m[n].name)} · ${m[n].i} of ${m[n].of}` : `<span class="muted">not on the page</span>`);

  const runCol = (run, f, m, n) => {
    const fl = run.firstlook, sheet = fl.notes?.[n];
    const body = f
      ? `<p>${esc(f.critique)}</p><div class="meta">focus: ${esc(f.focus)}${f.technical ? `<br>technical: ${esc(f.technical)}` : ""}</div>`
      : `<p class="muted">No close-look critique in this run.</p>`;
    return `<div class="run"><div class="runhead"><span class="runlbl">${esc(run.label)}</span><span class="st">${stars(f?.v2)}</span></div>
<div class="where">${where(m, n)}</div>${body}<div class="meta">first look: ${esc(status(run, n))}${sheet ? `<br>sheet note: <i>${esc(sheet)}</i>` : ""}</div></div>`;
  };

  const card = (n, group) => {
    const tags = [];
    if (posted[n]) tags.push(`<span class="tag ig">${esc(posted[n])}</span>`);
    for (const t of nonBlind(n)) tags.push(`<span class="tag nb">not blind: ${esc(t)}</span>`);
    if (B[n]?.pulled) tags.push(`<span class="tag">pulled from the held pile</span>`);
    const flags = [posted[n] ? "posted" : "", nonBlind(n).length ? "nonblind" : ""].join(" ");
    const rv = C.review?.[n] ? `<blockquote class="review"><span class="lbl">Your review of ${esc(r1.label.toLowerCase())}</span>${esc(C.review[n])}</blockquote>` : "";
    const sn = F[n]?.seenNow && !B[n] ? `<div class="seen-now"><span class="lbl">Seen after the comparison (not blind) · ${stars(F[n].seenNow.rating)}</span>${esc(F[n].seenNow.text)}</div>` : "";
    return `<article class="card" id="f-${n}" data-group="${group}" data-flags="${flags}">
<div class="pic"><img src="/img/${n}" alt="DSCF${n}" loading="lazy" tabindex="0"></div>
<div class="txt"><header><h3>DSCF${n}</h3>${badge(n)}<div class="tags">${tags.join("")}</div></header>
<p class="why">${esc(F[n]?.why)}</p>${rv}${sn}
<div class="runs">${runCol(r1, A[n], pos1, n)}${runCol(r2, B[n], pos2, n)}</div>${note(`frame:${n}`, `DSCF${n}`)}</div></article>`;
  };

  const avg = (ns, src) => {
    const v = ns.map((n) => src[n]?.v2).filter(Boolean);
    return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
  };
  const chap1 = Object.fromEntries(r1.chapters.map((c) => [c.name, c.photos]));
  const chap2 = Object.fromEntries(r2.chapters.map((c) => [c.name, c.photos]));
  const chapters = C.chapterPairs.map((p) => {
    const a = chap1[p.a] ?? [], b = chap2[p.b] ?? [];
    return `<section class="chap" id="chapter-${p.slug}"><h3>${esc(p.b)}</h3><p class="chnote">${esc(p.note)}</p>
<div class="chrow"><div class="chlbl"><b>${esc(r1.label)}</b><span>${esc(p.a)} · ${a.length} · avg ${avg(a, A)}</span></div>${strip(a, 1)}</div>
<div class="chrow"><div class="chlbl"><b>${esc(r2.label)}</b><span>${b.length} · avg ${avg(b, B)} · ${b.filter((n) => a.includes(n)).length} shared</span></div>${strip(b, 2)}</div>
${note(`chapter:${p.slug}`, p.b)}</section>`;
  }).join("");

  const themes = C.themes.map((t) => `<section class="theme" id="theme-${t.slug}"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>${strip(t.frames)}${note(`theme:${t.slug}`, t.title)}</section>`).join("");

  const both = Object.keys(A).filter((n) => B[n] && A[n].v2 && B[n].v2);
  let grid = `<table class="mx"><tr><th class="nw">${esc(r1.label)} ↓ · ${esc(r2.label)} →</th>${[2, 3, 4, 5].map((j) => `<th>${j}★</th>`).join("")}</tr>`;
  for (const i of [2, 3, 4, 5]) {
    grid += `<tr><th>${i}★</th>`;
    for (const j of [2, 3, 4, 5]) {
      const ns = both.filter((n) => A[n].v2 === i && B[n].v2 === j).sort((a, b) => a - b);
      grid += `<td class="${i === j ? "diag" : j > i ? "up" : "down"}"><b>${ns.length || ""}</b>${ns.length && i !== j ? `<small>${ns.map((n) => `<a href="#f-${n}">${n}</a>`).join(" ")}</small>` : ""}</td>`;
    }
    grid += "</tr>";
  }
  grid += "</table>";
  const moved = both.filter((n) => A[n].v2 !== B[n].v2).length;

  const twinSide = (n) => {
    const b = v2(n) ?? (F[n]?.seenNow ? `seen now ${F[n].seenNow.rating}` : "–");
    return `<figure><img src="/img/${n}" alt="DSCF${n}" loading="lazy" tabindex="0"><figcaption><b><a href="#f-${n}">DSCF${n}</a></b> ${esc(r1.label.toLowerCase())} ${v1(n) ?? "–"}★ · ${esc(r2.label.toLowerCase())} ${b}★</figcaption></figure>`;
  };
  const twins = C.twins.map((t) => `<section class="twin" id="twin-${t.slug}"><div class="pair">${twinSide(t.a)}${twinSide(t.b)}</div><p>${esc(t.text)}</p>${note(`twin:${t.slug}`, `${t.a} and ${t.b}`)}</section>`).join("");

  const order1 = Object.fromEntries(r1.chapters.map((c, i) => [c.name, i]));
  const sharedSorted = [...shared].sort((x, y) => order1[pos1[x].name] - order1[pos1[y].name] || pos1[x].i - pos1[y].i);
  const lower = out.filter((n) => B[n] && v2(n) < (v1(n) ?? 0));
  const unseen = out.filter((n) => !B[n]);
  const sameOut = out.filter((n) => B[n] && v2(n) >= (v1(n) ?? 0));
  const newIn = inn.filter((n) => v1(n) == null);
  const raised = inn.filter((n) => v1(n) != null && v2(n) > v1(n));
  const sameIn = inn.filter((n) => !newIn.includes(n) && !raised.includes(n));
  const sub = (title, ns, group, lede = "") => (ns.length ? `<h3 class="sub">${esc(title)} · ${ns.length}</h3>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}${ns.map((n) => card(n, group)).join("")}` : "");

  const cards = `
<div id="shared"><h3 class="sub big">On both pages · ${shared.length}</h3><p class="lede">In ${esc(r1.label.toLowerCase())}’s page order.</p>${sharedSorted.map((n) => card(n, "shared")).join("")}</div>
<div id="out"><h3 class="sub big">On ${esc(r1.label.toLowerCase())}’s page, not ${esc(r2.label.toLowerCase())}’s · ${out.length}</h3>
${sub(`Rated lower in ${r2.label.toLowerCase()}`, lower, "out")}
${sub(`Never seen at size in ${r2.label.toLowerCase()}`, unseen, "out", "Held at the first look or a sheet 2★. Any verdict under them is from after the comparison: not blind, and labelled.")}
${sub("Same rating, left out for the sequence", sameOut, "out")}</div>
<div id="in"><h3 class="sub big">On ${esc(r2.label.toLowerCase())}’s page, not ${esc(r1.label.toLowerCase())}’s · ${inn.length}</h3>
${sub(`Never rated at size in ${r1.label.toLowerCase()}`, newIn, "in", `Reserve, a lost twin at the sheet, or not in ${r1.label.toLowerCase()}’s source at all.`)}
${sub("Raised by a star", raised, "in")}
${sub("Same rating, a new role", sameIn, "in")}</div>
${C.neither?.length ? `<div id="neither"><h3 class="sub big">Moved a star, on neither page · ${C.neither.length}</h3>${C.neither.map((n) => card(n, "neither")).join("")}</div>` : ""}`;

  const questions = C.questions.map((q) => `<li id="question-${q.slug}"><b>${esc(q.title)}.</b> ${esc(q.text)}${note(`question:${q.slug}`, q.title)}</li>`).join("");

  const stats = [
    [shared.length, "on both pages"], [out.length, `${r1.label.toLowerCase()} only`], [inn.length, `${r2.label.toLowerCase()} only`],
    [moved, `of ${both.length} rated in both moved a star`], ...(C.extraStats ?? []).map((s) => [s.value, s.label]),
  ].map(([v, l]) => `<div class="stat"><b>${v}</b><span>${esc(l)}</span></div>`).join("");
  const howto = (C.howto ?? []).map(([t, s]) => `<div><b>${esc(t)}</b>${esc(s)}</div>`).join("");

  const body = TEMPLATE
    .replace("{{TITLE}}", () => esc(C.title)).replace("{{H1}}", () => esc(C.title).replace(/, (.*)$/, ", <em>$1</em>"))
    .replace("{{KICKER}}", () => esc(C.kicker)).replace("{{LEDE}}", () => esc(C.lede))
    .replace("{{STATS}}", () => stats).replace("{{HOWTO}}", () => howto).replace("{{PAGENOTE}}", () => note("page", "the whole comparison"))
    .replace("{{CHAPTERS}}", () => chapters).replace("{{THEMES}}", () => themes).replace("{{GRID}}", () => grid).replace("{{GRIDNOTE}}", () => note("grid", "the rating grid"))
    .replace("{{TWINS}}", () => twins).replace("{{CARDS}}", () => cards).replace("{{QUESTIONS}}", () => questions)
    .replace("{{FOOTER}}", () => esc(`Sources: ${C.runs.flatMap((r) => [r.ratings, r.firstlook, r.log]).join(", ")}, ${path.basename(compareFile)}. Notes: ${C.notes}.`))
    .replace("{{KEYS}}", () => JSON.stringify([...keys]));
  return body;
}

// ---------- server ----------

const cacheDir = path.join(os.tmpdir(), "compare-img-cache");
fs.mkdirSync(cacheDir, { recursive: true });
let sourceIndex = null;
function sourceFile(C, n) {
  if (!sourceIndex) {
    const folder = path.join(SOURCE_ROOT, C.source);
    sourceIndex = new Map(fs.readdirSync(folder).filter((f) => /\.(jpe?g|png)$/i.test(f))
      .map((f) => [path.basename(f, path.extname(f)).toUpperCase().match(/DSCF(.+)$/)?.[1] ?? f, path.join(folder, f)]));
  }
  return sourceIndex.get(String(n).toUpperCase());
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      return res.end(build());
    }
    const img = url.pathname.match(/^\/img\/([\w()-]+)$/);
    if (req.method === "GET" && img) {
      const { C } = load();
      const src = sourceFile(C, img[1]);
      if (!src) { res.writeHead(404); return res.end(); }
      const cached = path.join(cacheDir, `${C.place}-${img[1]}-${IMG_EDGE}.jpg`);
      if (!fs.existsSync(cached)) await sharp(src).rotate().resize(IMG_EDGE, IMG_EDGE, { fit: "inside" }).jpeg({ quality: 78 }).toFile(cached);
      res.writeHead(200, { "content-type": "image/jpeg", "cache-control": "max-age=86400" });
      return fs.createReadStream(cached).pipe(res);
    }
    if (url.pathname === "/notes" && req.method === "GET") {
      const { C } = load();
      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
      return res.end(JSON.stringify(readNotes(C)));
    }
    const nk = url.pathname.match(/^\/notes\/(.+)$/);
    if (nk && req.method === "PUT") {
      let data = "";
      for await (const chunk of req) data += chunk;
      const { kind, text } = JSON.parse(data || "{}");
      const { C } = load();
      const notes = readNotes(C);
      const key = decodeURIComponent(nk[1]);
      if (text && text.trim()) notes[key] = { kind: ["note", "question", "decision"].includes(kind) ? kind : "note", text, updated: new Date().toISOString() };
      else delete notes[key];
      writeNotes(C, notes);
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ ok: true, updated: notes[key]?.updated ?? null }));
    }
    res.writeHead(404); res.end();
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "content-type": "text/plain" }); res.end(String(e.stack ?? e));
  }
});
server.listen(port, "127.0.0.1", () => console.log(`compare: http://127.0.0.1:${port}/  (${path.relative(process.cwd(), compareFile)})`));

// ---------- template ----------

const TEMPLATE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{TITLE}}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#09090b;--card:#121215;--card2:#18181c;--line:#26262b;--fg:#f4f4f5;--fg2:#d4d4d8;--muted:#8a8a93;--dim:#3f3f46;--red:#d93829;--amber:#e59866;--up:#86c39a;--down:#e0806f;--blue:#8fb3d9;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:64px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 "Geist",system-ui,sans-serif}
a{color:inherit}
.wrap{max-width:1240px;margin:0 auto;padding:0 24px}
@media (max-width:600px){.wrap{padding:0 16px}}
.meta,.lbl,.tag,.mv,.st,.runlbl,.where,.th span,figcaption,.chlbl span,nav a,.hero .kicker,.stat span,.filters button,.kinds,.addnote,.saved,.mx small,.mx th{font-family:"Geist Mono",ui-monospace,monospace}
.dim{color:var(--dim)} .muted{color:var(--muted)}
nav{position:sticky;top:0;z-index:20;background:rgba(9,9,11,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
nav .wrap{display:flex;gap:6px 18px;align-items:center;overflow-x:auto;white-space:nowrap;height:52px;scrollbar-width:none}
nav .wrap::-webkit-scrollbar{display:none}
nav b{font-family:"Playfair Display",serif;font-weight:500;font-size:17px;margin-right:6px}
nav b i{color:var(--red);font-style:normal}
nav a{font-size:11.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);text-decoration:none}
nav a:hover{color:var(--fg)}
nav .count{margin-left:auto;font-family:"Geist Mono",monospace;font-size:11.5px;color:var(--amber)}
.hero{padding:64px 0 32px}
.hero h1{font-family:"Playfair Display",serif;font-weight:500;font-size:clamp(40px,6vw,72px);line-height:1.02;letter-spacing:-.02em;margin:0 0 18px}
.hero h1 em{color:var(--fg2)}
.hero .kicker{color:var(--muted);font-size:12.5px;letter-spacing:.06em;text-transform:uppercase}
p.lede{color:var(--fg2);max-width:820px}
.hero p.lede{font-size:17px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:30px 0 0}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
.stat b{display:block;font-family:"Playfair Display",serif;font-size:36px;font-weight:500;line-height:1}
.stat span{display:block;margin-top:8px;color:var(--muted);font-size:11.5px;text-transform:uppercase;letter-spacing:.06em}
.howto{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:16px}
.howto div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-size:13.5px;color:var(--fg2)}
.howto b{display:block;color:var(--fg);margin-bottom:4px}
section.block{padding:52px 0 8px;border-top:1px solid var(--line);margin-top:36px}
h2{font-family:"Playfair Display",serif;font-weight:500;font-size:clamp(28px,3.4vw,40px);letter-spacing:-.01em;margin:0 0 10px}
h3.sub{font-family:"Playfair Display",serif;font-weight:500;font-size:24px;margin:40px 0 6px}
h3.sub.big{font-size:30px;margin-top:60px}
.strip{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 10px;scrollbar-width:thin;scrollbar-color:var(--dim) transparent}
.th{flex:0 0 auto;text-decoration:none;border-radius:8px}
.th img{height:132px;width:auto;min-width:88px;display:block;border-radius:8px;background:var(--card2)}
.th span{display:block;font-size:11px;color:var(--muted);margin-top:4px}
.th.sh img{box-shadow:0 0 0 2px var(--amber)}
.legend-sh{display:inline-block;width:12px;height:12px;border-radius:3px;box-shadow:0 0 0 2px var(--amber);vertical-align:-1px;margin:0 4px}
.chap,.theme,.twin{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin:16px 0}
.chap h3,.theme h3{font-family:"Playfair Display",serif;font-weight:500;font-size:24px;margin:0 0 6px}
.chnote,.theme>p,.twin>p{color:var(--fg2);font-size:14.5px;margin:0 0 14px;max-width:920px}
.chrow{display:grid;grid-template-columns:150px 1fr;gap:12px;border-top:1px solid var(--line);padding-top:12px;margin-bottom:4px}
.chlbl b{display:block;font-weight:500}
.chlbl span{display:block;color:var(--muted);font-size:11.5px;line-height:1.4}
@media (max-width:700px){.chrow{grid-template-columns:1fr}.th img{height:104px}}
.mxwrap{overflow-x:auto}
table.mx{border-collapse:separate;border-spacing:6px;margin:18px 0;min-width:560px}
.mx th{font-size:12px;color:var(--muted);font-weight:400;text-align:left;padding:4px 8px}
.mx th.nw{white-space:nowrap}
.mx td{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;vertical-align:top;width:24%}
.mx td b{font-family:"Playfair Display",serif;font-size:26px;font-weight:500;display:block;line-height:1}
.mx td small{display:block;margin-top:6px;font-size:11px;color:var(--muted);line-height:1.6}
.mx td small a{text-decoration:none} .mx td small a:hover{color:var(--fg)}
.mx td.diag{background:var(--card2)} .mx td.up b{color:var(--up)} .mx td.down b{color:var(--down)}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:end}
.pair figure{margin:0}
.pair img{width:100%;max-height:520px;object-fit:contain;background:#000;border-radius:10px;display:block;cursor:zoom-in}
figcaption{font-size:12px;color:var(--muted);margin-top:8px}
figcaption b{color:var(--fg);font-weight:500;margin-right:6px} figcaption a{text-decoration:none}
.twin>p{margin-top:14px}
@media (max-width:640px){.pair{grid-template-columns:1fr}}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 6px}
.filters button{font-weight:500;font-size:12px;letter-spacing:.04em;background:var(--card);color:var(--fg2);border:1px solid var(--line);border-radius:999px;padding:7px 14px;cursor:pointer}
.filters button[aria-pressed=true]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
.card{display:grid;grid-template-columns:minmax(260px,400px) 1fr;gap:22px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin:16px 0}
.hidden{display:none!important}
.pic img{width:100%;max-height:560px;object-fit:contain;background:#000;border-radius:10px;display:block;cursor:zoom-in;position:sticky;top:70px}
.card header{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
.card h3{font-family:"Playfair Display",serif;font-weight:500;font-size:26px;margin:0}
.mv{font-size:12.5px;padding:3px 10px;border-radius:999px;background:var(--card2);border:1px solid var(--line);color:var(--fg2)}
.mv.up{color:var(--up);border-color:rgba(134,195,154,.35)} .mv.down{color:var(--down);border-color:rgba(224,128,111,.35)}
.mv.new{color:var(--blue);border-color:rgba(143,179,217,.35)} .mv.seen{color:var(--amber);border-color:rgba(229,152,102,.35)} .mv small{color:var(--muted)}
.tags{display:flex;flex-wrap:wrap;gap:6px;width:100%}
.tag{font-size:11px;padding:2px 8px;border-radius:6px;background:var(--card2);color:var(--muted);border:1px solid var(--line)}
.tag.ig{color:var(--fg2)} .tag.nb{color:var(--amber);border-color:rgba(229,152,102,.3)}
p.why{font-size:16px;line-height:1.55;margin:14px 0 12px}
blockquote.review,.seen-now{margin:0 0 12px;padding:10px 14px;border-left:2px solid var(--red);background:rgba(217,56,41,.06);border-radius:0 8px 8px 0;color:var(--fg2);font-size:14px}
.seen-now{border-left-color:var(--amber);background:rgba(229,152,102,.07)}
.lbl{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:4px}
.runs{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.run{background:var(--card2);border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-size:13.5px;color:var(--fg2)}
.run p{margin:8px 0}
.runhead{display:flex;justify-content:space-between;align-items:center}
.runlbl{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.st{color:var(--amber);letter-spacing:2px;font-size:13px}
.where{font-size:11.5px;color:var(--fg2);margin-top:4px}
.meta{font-size:11px;color:var(--muted);line-height:1.5;margin-top:8px}
.meta i{font-family:"Geist",sans-serif;font-size:12px}
@media (max-width:900px){.card{grid-template-columns:1fr}.pic img{position:static;max-height:70vh}}
@media (max-width:640px){.runs{grid-template-columns:1fr}}
.note{margin-top:14px}
.addnote{background:none;border:1px dashed var(--dim);color:var(--muted);border-radius:8px;padding:6px 12px;font-size:12px;cursor:pointer}
.addnote:hover{color:var(--fg);border-color:var(--muted)}
.note.has .addnote{display:none}
.noteui{border:1px solid var(--line);border-left:2px solid var(--amber);border-radius:0 10px 10px 0;background:var(--card2);padding:10px 12px}
.note.has .noteui{display:block}
.kinds{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:var(--muted);margin-bottom:6px;align-items:center}
.kinds label{cursor:pointer;display:flex;gap:5px;align-items:center}
.kinds input{accent-color:var(--amber);margin:0}
.saved{margin-left:auto;color:var(--muted);font-size:11px}
.note textarea{width:100%;background:transparent;border:0;color:var(--fg);font:15px/1.55 "Geist",sans-serif;resize:vertical;min-height:64px;padding:2px 0;outline:none}
.note[data-kind=question] .noteui{border-left-color:var(--blue)} .note[data-kind=decision] .noteui{border-left-color:var(--up)}
ol.q{padding-left:20px;max-width:920px} ol.q li{margin:0 0 18px;color:var(--fg2)} ol.q b{color:var(--fg);font-weight:500}
#orphans{display:none;background:rgba(217,56,41,.08);border:1px solid rgba(217,56,41,.4);border-radius:12px;padding:14px 18px;margin-top:20px;font-size:13.5px}
#orphans pre{white-space:pre-wrap;font:12px/1.5 "Geist Mono",monospace;color:var(--fg2);margin:6px 0 0}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center;z-index:50;cursor:zoom-out;padding:20px}
#lb.on{display:flex} #lb img{max-width:100%;max-height:100%;object-fit:contain}
#lb span{position:absolute;top:14px;left:18px;font-family:"Geist Mono",monospace;font-size:12px;color:var(--muted)}
footer{color:var(--muted);font-size:12.5px;padding:60px 0 80px;font-family:"Geist Mono",monospace}
</style></head><body>
<nav aria-label="Sections"><div class="wrap"><b>Compare<i>.</i></b>
<a href="#chapters">Chapters</a><a href="#themes">Themes</a><a href="#grid">Ratings</a><a href="#twins">Twins</a>
<a href="#shared">Shared</a><a href="#out">Out</a><a href="#in">In</a><a href="#neither">Moved</a><a href="#questions">Questions</a>
<span class="count" id="count" aria-live="polite"></span></div></nav>
<header class="hero"><div class="wrap">
<div class="kicker">{{KICKER}}</div><h1>{{H1}}</h1><p class="lede">{{LEDE}}</p>
<div class="stats">{{STATS}}</div><div class="howto">{{HOWTO}}</div>
<div id="orphans"><b>Notes whose section is no longer on this page</b> (kept in the notes file):<pre></pre></div>
{{PAGENOTE}}
</div></header>
<main class="wrap">
<section class="block" id="chapters"><h2>Chapter by chapter</h2>
<p class="lede">The second run’s chapters, each with the first run’s nearest equivalent. Frames on both pages have an amber outline <span class="legend-sh"></span>. Stars under each thumbnail are that run’s rating; in theme strips, the second run’s, or the after-comparison look for frames it never saw.</p>{{CHAPTERS}}</section>
<section class="block" id="themes"><h2>What moved, and why</h2>{{THEMES}}</section>
<section class="block" id="grid"><h2>Every frame rated in both runs</h2>
<p class="lede">Rows are the first run’s rating, columns the second’s. The diagonal held; green moved up, red down.</p><div class="mxwrap">{{GRID}}</div>{{GRIDNOTE}}</section>
<section class="block" id="twins"><h2>Where the twins went the other way</h2>{{TWINS}}</section>
<section class="block" id="frames"><h2>Every frame</h2>
<div class="filters" role="group" aria-label="Filter frames">
<button data-f="all" aria-pressed="true">All</button><button data-f="shared" aria-pressed="false">Shared</button>
<button data-f="out" aria-pressed="false">First run only</button><button data-f="in" aria-pressed="false">Second run only</button>
<button data-f="neither" aria-pressed="false">Moved, neither page</button><button data-f="posted" aria-pressed="false">Posted</button>
<button data-f="nonblind" aria-pressed="false">Not blind</button><button data-f="noted" aria-pressed="false">With my notes</button></div>
{{CARDS}}</section>
<section class="block" id="questions"><h2>Questions for you</h2><ol class="q">{{QUESTIONS}}</ol></section>
</main>
<footer><div class="wrap">{{FOOTER}}</div></footer>
<div id="lb" role="dialog" aria-modal="true" aria-label="Full-size photo"><span></span><img alt=""></div>
<script>
const KEYS = new Set({{KEYS}});
let NOTES = {};
const count = document.getElementById('count');
function refreshCount(){ const n = Object.keys(NOTES).filter(k => KEYS.has(k)).length; count.textContent = n ? n + (n === 1 ? ' note' : ' notes') : ''; }
function show(box, open){ box.querySelector('.noteui').hidden = !open; box.querySelector('.addnote').setAttribute('aria-expanded', open); }
async function save(box){
  const key = box.dataset.key, text = box.querySelector('textarea').value, kind = box.querySelector('input:checked').value;
  const st = box.querySelector('.saved'); st.textContent = 'saving…';
  try {
    const r = await fetch('/notes/' + encodeURIComponent(key), {method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({kind, text})});
    if (!r.ok) throw new Error(r.status);
    if (text.trim()) NOTES[key] = {kind, text}; else delete NOTES[key];
    box.classList.toggle('has', !!text.trim()); box.dataset.kind = kind;
    st.textContent = text.trim() ? 'saved' : 'removed'; refreshCount();
  } catch (e) { st.textContent = 'not saved: is the server running?'; }
}
document.querySelectorAll('.note').forEach(box => {
  let t; const ta = box.querySelector('textarea');
  box.querySelector('.addnote').addEventListener('click', () => { show(box, true); ta.focus(); });
  ta.addEventListener('input', () => { clearTimeout(t); box.querySelector('.saved').textContent = '…'; t = setTimeout(() => save(box), 700); });
  ta.addEventListener('blur', () => { clearTimeout(t); if ((NOTES[box.dataset.key]?.text ?? '') !== ta.value) save(box); else if (!ta.value.trim()) show(box, false); });
  box.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => { box.dataset.kind = r.value; if (ta.value.trim()) save(box); }));
});
fetch('/notes').then(r => r.json()).then(n => {
  NOTES = n;
  for (const [k, v] of Object.entries(n)) {
    const box = document.querySelector('.note[data-key="' + CSS.escape(k) + '"]'); if (!box) continue;
    box.querySelector('textarea').value = v.text; box.classList.add('has'); box.dataset.kind = v.kind; show(box, true);
    const r = box.querySelector('input[value="' + v.kind + '"]'); if (r) r.checked = true;
  }
  const lost = Object.entries(n).filter(([k]) => !KEYS.has(k));
  if (lost.length) { const o = document.getElementById('orphans'); o.style.display = 'block'; o.querySelector('pre').textContent = lost.map(([k, v]) => k + ' (' + v.kind + '): ' + v.text).join('\\n\\n'); }
  refreshCount();
});
const lb = document.getElementById('lb'), lbi = lb.querySelector('img'), lbs = lb.querySelector('span'); let last = null;
function openLb(t){ last = t; lbi.src = t.src; lbs.textContent = t.alt; lb.classList.add('on'); lb.tabIndex = -1; lb.focus(); }
function closeLb(){ lb.classList.remove('on'); last?.focus(); }
document.addEventListener('click', e => { if (e.target.matches('.pic img, .pair img')) openLb(e.target); else if (lb.classList.contains('on') && lb.contains(e.target)) closeLb(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lb.classList.contains('on')) closeLb();
  else if (e.key === 'Enter' && document.activeElement.matches('.pic img, .pair img')) openLb(document.activeElement);
});
const btns = document.querySelectorAll('.filters button');
btns.forEach(b => b.addEventListener('click', () => {
  btns.forEach(x => x.setAttribute('aria-pressed', x === b)); const f = b.dataset.f;
  document.querySelectorAll('.card').forEach(c => {
    const show = f === 'all' || c.dataset.group === f || c.dataset.flags.split(' ').includes(f) || (f === 'noted' && NOTES['frame:' + c.id.slice(2)]);
    c.classList.toggle('hidden', !show);
  });
  document.querySelectorAll('#frames > div[id]').forEach(box => {
    box.classList.toggle('hidden', !box.querySelector('.card:not(.hidden)'));
    box.querySelectorAll('h3.sub:not(.big)').forEach(h => {
      let el = h.nextElementSibling, any = false;
      while (el && !(el.matches('h3.sub'))) { if (el.matches('.card:not(.hidden)')) any = true; el = el.nextElementSibling; }
      h.classList.toggle('hidden', !any); if (h.nextElementSibling?.matches('p.lede')) h.nextElementSibling.classList.toggle('hidden', !any);
    });
  });
}));
</script></body></html>`;
