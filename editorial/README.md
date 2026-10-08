# Editorial standard

How a trip I've shot and edited becomes what this site shows: which photos, in what
order, grouped how, tagged how, and with which few words. Frame quality ("is this photo
good?") is a separate question, answered during culling with `taste.md` in the
[lr-agent](https://github.com/mihail-kovashki/lr-agent) repo. This file answers "how does
the site present it?"

It's a working draft. Rules get added as trips go through the process, starting with
Seoul 2025.

## The site in one line

A photo journal of my travels, somewhere between the archive (Google Photos: hundreds per
trip) and Instagram (a few frames per post): **selected, but generous.** The home page is
a portfolio front, the best of everything; the journal lives in trips and places.

## Content model

| Level | What it is | Rule |
| --- | --- | --- |
| **Trip** | One journey I'd write a single entry about ("Czechia · Summer 2026") | Typically a few days to two weeks. A long stay is its own trip, and trips taken from it are separate trips. |
| **Place** | The reference level: its own page, findable by name | The most specific name with enough photos for its own page. Each place belongs to one trip. |
| **Chapter** | An optional themed set inside a place | Named freely, in my voice, used once. |
| **Tag** | A theme across the whole site | Controlled vocabulary in [`src/data/tags.ts`](../src/data/tags.ts). |

More photos from the same visit extend the same place; a return visit is a new trip.
Albums often don't map onto places or even trips (the Copenhagen album is half Malmö,
the Madeira one starts with a day in Charleroi), so every pass starts by mapping
**album → trip → places**.

## Where the data lives

- **Per-photo facts live in the photo files,** as Lightroom-style hierarchical keywords
  (`XMP-lr:HierarchicalSubject`, mirrored as plain keywords in `XMP-dc:Subject`) and the
  standard star rating (`XMP-xmp:Rating`):
  - `site|place|<place-id>`, where the place id includes the trip year: `seoul-25`
  - `site|tag|<tag-id>`, from [`src/data/tags.ts`](../src/data/tags.ts)
  Lightroom writes these on export; for back-catalogue JPEGs that never went through
  Lightroom, ExifTool writes them. Keywords are a portable standard (XMP/IPTC), so they
  survive leaving Lightroom.
- **Words and order live in this repo,** one file per place in
  [`src/data/collections/`](../src/data/collections/): chapter names and text, the photos
  in each chapter in display order, notes on my overrides, the parked list, and
  deliberate drops. Chapter membership lives only here: it's part of the sequence, and
  keeping it in the files too would let the two copies drift apart.
- The site's input is a folder of finished JPEGs with those keywords, plus the files
  here. Lightroom exports and Google Photos downloads both produce it.

## Judging finished photos

The editorial pass works on finished exports, not raw material, so it judges them
differently from culling (`taste.md`):

- **Judge what the viewer sees.** The edit is part of the photo: colour, contrast and
  exposure count as shown. The crop is final; no credit for what a crop could do.
  Near-duplicates can differ by their edit as well as the moment.
- **Everything here already passed a first filter** when I chose to export it. Ratings
  are relative to that: a 2 means "less strong here", not "bad".
- **5★ is measured against the portfolio, not the session.** Several in a great session
  are fine, none in a weak one. Check each against the existing 5★ frames; the home page
  (20–30 photos) is the natural ceiling.
- **Rate the photo, not its subject or idea.** Czechia 2026 showed one bias in both
  directions: interesting subjects and clever concepts were rated too high (the Český
  Krumlov castle, Prague's tram blur), and quiet minimal frames too low (6853, 6509).
  `taste.md`'s "What costs a frame" has the cases; read it before rating.
- **Critique in photographic terms; judge light by what it does; composition before
  subject.** These live in `taste.md` ("How to critique", "What costs a frame"), shared
  with the cull and Instagram picks; read them before rating.
- **Stars rank frames; the sequence decides roles.** A frame can hold a position its
  stars alone wouldn't give it: a wide establishing shot can open a chapter at 3★, and a
  quiet favourite can close one.
- **One establishing shot per chapter, at most.** Wide city views rarely earn a 4 on
  their own (everyone's phone takes them), but one can say "here's where we are" before
  the tighter frames.
- **Near-duplicate runs collapse to one pick,** plus a real variation only if it adds a
  different moment, framing or light.

## Chapters and selection

- **Fewer, fuller chapters.** A chapter has about five photos or more; a place has three
  to five chapters, five being a soft cap that a big city can pass (Prague 2026: a gardens
  chapter beside Malá Strana). A smaller set folds into a neighbour, decided by location or by one
  continuous walk (Seoul: the Wall joined Gwanghwamun, the flower field joined the evening
  in Anguk). Tiny sections also read badly on the site.
- **Order: weigh the story against the best photo.** Neither always wins; it depends on
  how strong the story is and how far the best photos stand above the rest. The same
  question applies to the chapters of a place and to the photos in a chapter.
  - **The story wins** when the sequence is the point: one evening as the light changes,
    one walk, an arrival. Keep it in order, as long as the opening photo can hold the
    first screen (Seoul 24 runs from the light on Namsan to Yeouido after sunset; Yeosu
    by dusk runs from sunset to night).
  - **The best photo wins** when the days or scenes are unrelated, or when one chapter
    clearly outclasses the rest (Seoul 25: Achasan, averaging 4.1 with two 5★, had come
    last by date).
  - Either way, the opener should say where we are, and the closer matters as much as
    the opener: a strong frame buried in the middle of a weak run is the thing to fix.
- **A city opens with the city.** On a city page, people expect the city first, so the
  chapter that shows it leads even if a more specific one scores higher; the specific
  places follow (Sapporo: the city before the Hill of the Buddha).
- **Chapter names say where we are.** The site's space is limited, so a name places the
  viewer ("Gwanghwamun and the Wall"); wit belongs in Instagram captions and, later, in
  page text.
- **A toss-up keeps both, for now.** When I can't say which of two frames I prefer, both
  go in and the collection file notes it; living with the page decides.
- **My override beats the stars, and it's recorded.** A frame I want in stays at its
  rating as a frame, but gets its place because I chose it, noted as my pick (Seoul: the
  2★ "People of the palace" cover).
- **People I travel with are in a photo, never its subject.** Seen from behind, in
  silhouette, or too small to recognise is fine; portraits and frames where a recognisable
  face is the point stay out (Madeira: 9762 and 0021 out, 9858's profile skipped). I ask
  them before their frames go live, and the pass log lists those frames.
- **Everyone else is assumed a stranger; the pass doesn't stop to ask.** Whether someone
  in frame is a companion is not a mapping question and never holds up a session. Treat
  them as strangers, carry on, and list every frame with a recognisable person under
  "People" in the pass log, marked "assumed stranger, check", so I confirm at review. The
  one exception: someone clearly posing for the camera (facing it, placed, the subject) may
  be asked about at mapping, since it decides whether the frame can be a candidate at all.
  If I'm not around to answer, assume a stranger and flag it the same way.
- **Stragglers are parked, not dropped.** Good photos that fit no chapter go on the
  place's parked list; enough of them can become an "Around <place>" chapter later.
  Deliberate drops (a great memory, a weak photo) are logged separately so they aren't
  reconsidered by accident.

## Running a pass

Added 2026-10-01, after the first four albums were chosen from contact sheets alone. At
thumbnail size soft focus doesn't show (Hokkaido's 3184 was "largely out of focus" and
still got proposed for 5★), so no rating above 2★ comes from a thumbnail any more. The
images come from [`scripts/review.mjs`](../scripts/review.mjs).

0. **Cull, for an uncut album only.** Added 2026-10-08 for Czechia 2026: about 1,350
   straight-out-of-camera frames that nobody had filtered, where the steps below assume a
   finished export. The album's folder splits in two:
   ```
   portfolio-source/Czechia 26/
     raw/2026-07-02 Prague/     camera JPEGs as downloaded, read-only, never ingested
     selects/Prague/            copies of the survivors, one folder per place
   ```
   Day folders are named by date and place, never "Day 1": the date and place do half of
   step 2's mapping. File names stay as the camera wrote them (`DSCF6334.JPG`), since
   ingest and `--refresh` match on the number.

   Cull one day per session from contact sheets (`review.mjs sheets`): collapse
   near-duplicate runs to one pick, then keep or drop, nothing finer. Keep generously;
   the first look tightens it. Frames I picked or posted earlier (an old selection,
   Instagram) are evidence, not automatic keeps.

   A run's pick is made side by side at size, not on the sheet: write the runs down while
   the sheets are in view, then `review.mjs twins <day folder> <out> <n>,<n>,...` for any
   run whose winner isn't obvious, and always for a run holding a posted or earlier pick.
   When it's still close, keep both and let the first look decide. On Czechia 2026 the
   sheet-size choice dropped posted Kutná Hora 7034 for a worse twin, and some Malá
   Strana frames I remember never reached `selects/`.

   Save the day as
   `passes/v2/<album>.cull.<date>.json`:
   ```
   {"album": "Czechia 2026", "day": "2026-07-02", "folder": "raw/2026-07-02 Prague",
    "place": "prague-26", "keep": ["6343", "6367"], "groups": [["6345", "6344", "6346"]],
    "prior": ["6343", "6345"], "notes": {"6367": "keep for the light, check focus"}}
   ```
   Every frame not in `keep` is accounted for: it sits in a group under the frame that
   beat it, or it has a note saying why it's out. A drop with neither is a frame nobody
   decided on. The Malá Strana re-cull found two of those (6828, 6850) that neither the
   twin rule nor the flaw rule would have caught.

   Anything not in `keep` is out, and nothing is deleted from `raw/`. After the day is
   saved, its keeps are copied into `selects/<Place>/`. Once every day is culled, each
   place in `selects/` is an album for the steps below, its files named by the place id
   (`prague-26.firstlook.json`).
1. **Instagram first.** Find the trip's posts: which frames I published, which fronted a
   post, how I grouped them. That is the best evidence of what I think matters.
2. **Map the album** to trip and places from contact sheets and dates (`review.mjs
   sheets`). Ask me about anything I'd know and the files don't, except who's in frame:
   that waits for the log's "People" section (see the people rules above).
3. **First look, from contact sheets** at 600px per photo, nine to a sheet (`review.mjs
   sheets`). Group near-duplicates, give 1★ to clear rejects and 2★ to the plainly
   unremarkable. Everything else is a candidate. No higher stars yet. Tested on Korea
   2024's known problems: 450px missed shooting through glass and an intruding
   foreground, which 600px shows; 900px added nothing more; dust and soft focus never
   show on a sheet, which is what step 4 is for.

   **One flaw on the sheet is a reason to look, not a 2★.** A frame that would be a
   candidate but for a single thing (a white sky, a cloud shadow, someone at the edge)
   goes on the shortlist with that flaw in `notes`; step 4 decides what it costs. On
   Czechia 2026, two such frames (Kutná Hora 7110, Český Krumlov 7584) were the better
   photos at size, and a 2★ from the sheet means nobody looks again. 2★ is for frames
   with nothing to hold them, not for good frames with one problem.

   Near-twin runs whose winner isn't obvious on the sheet are settled side by side
   (`review.mjs twins <folder> <out> --groups <file>`, 1000px each), not by time order or
   by which was posted.

   Save the result as `passes/v2/<album>.firstlook.json`, so the close look can start in
   another session without redoing the sheets (Vietnam's first look was lost that way):
   ```
   {"album": "Vietnam 2024", "date": "2026-10-02",
    "places": {"hanoi-24": "24–25 Nov, Hanoi"},
    "rejects": {"1": ["7979"], "2": ["7470", "8174"]},
    "groups": [["8038", "8010", "8015", "8031"]],
    "shortlist": ["7469", "7489-Enhanced-NR", "8038"],
    "notes": {"7489-Enhanced-NR": "keyword this copy, not the original"}}
   ```
   `groups` are near-twin runs, the likely winner first; `shortlist` uses the names
   `review.mjs` takes, and `review.mjs view <folder> <out> --shortlist <file>` reads it.
4. **Close look at the shortlist** (`review.mjs view`, 1400px): about 1.5× the final set,
   chosen generously from the sheets, since photos that only show their worth up close
   are the main risk of a tight list. Then 100% crops, four to an image (`review.mjs
   crop`), where the photo is meant to be sharp: the person, the building, the flower,
   not the centre of the frame. When the subject is spread out or small, give the frame
   two crops rather than one guess (Český Krumlov 7519's single crop landed on the floor
   and missed the figures). Spot-check smooth skies for dust. For each candidate
   record:
   - **focus**: `sharp`, `soft-intended` (shallow focus that is clearly the point) or
     `soft` (a miss, shake or motion blur), with where it was checked;
   - **technical**: tilt, noise, halos, clipped highlights, banding, edit artefacts;
   - **critique**: what works and what doesn't, plainly. Be critical; I want to get
     better, and analysis must not talk a weak photo up;
   - the rating.
   A `soft` frame can still be chosen, but only knowingly: it's flagged to me.

   **Write as you look.** Note each frame's verdict, and where its crop should go, while
   the image is in view, in batches of eight or so. Images drop out of a long session's
   context, and a crop aimed later from memory misses its subject (Vietnam: 7489, 7554).
   Any proposed 5★ is then checked against the site's current ones on one sheet
   (`review.mjs fives`).

   **Flaws and what they cost.** I'm not at the level where every flaw makes a frame
   trash, so a set is filled with photos that have small imperfections, and the
   imperfections are noted for me to improve on. Separate three kinds:
   - **Disqualifying:** the flaw is the photo. Reflections or blur from glass across the
     whole frame (Yeosu 4871), a missed subject with nothing else to hold it.
   - **A blemish:** an intruding foreground, a busy scene, a softness that has its own
     charm. It costs a star at most and never removes a frame on its own. Say what still
     works: busy can still carry great light and small human moments (Seoul 24 6381), and
     out of focus can be creative (the YEOSU sign, 4890).
   - **Fixable in the edit:** sensor dust, a tilt, a crop. Never a reason to drop; it goes
     on the edit queue in the project's vault note, and the fixed export replaces it.
5. **Select and present**: chapters, order, names, under the rules above. Judge the page as
   a viewer meets it: what opens, what closes, whether names say something, whether a
   chapter repeats itself.
6. **Write the pass log** (below) and stop for my review.
7. **After I approve:** collection files in `src/data/collections/` (registered in
   `index.ts`), then the tags file `passes/v2/<album>.tags.json` (format in the header of
   [`scripts/keyword.mjs`](../scripts/keyword.mjs)). Run `keyword.mjs` without `--write`
   first and show me the tags: they're the one thing I haven't seen in the log. Then
   `--write`, `npm run ingest -- "<full path to the source folder>" "<Place 24>" --keyworded` (a path relative to `portfolio-source/` fails) once per
   place, check that every chapter entry was ingested, commit, push, and update the vault.

**Sessions.** Images stay in the conversation, so a long session gets expensive fast and
drags finished albums along: one album per session, started with the `editorial-pass`
skill (kept local in `.claude/skills/`, which is gitignored). A large album (more than about 150 photos, or several places)
splits in two:
- **Session A:** steps 1–3. Ends with the first-look file and a handoff in the album's
  section of the vault note.
- **Session B:** steps 4–7, starting from the first-look file. Stops for my review after
  step 6; step 7 can follow in the same session.

A small album runs as one session. A cull (step 0) is one session per day, before any of
these.

**Cost.** Measured on the second passes, the 1568px views cost far more than anything
else and caught nothing that 1000px wouldn't; Instagram fingerprints cost almost nothing
and changed the most selections. (Changed 2026-10-02; the earlier passes used 1568px views
and 1000px crops.)

Raised again on 2026-10-08, after Czechia 2026 ran a whole trip of camera JPEGs at the
cheap sizes and the cost was reasonable, but the misses were upstream: frames marked down
on the sheet, twins chosen at sheet size. Views went to 1400px (about twice the image
tokens of 1000px, four-fifths of 1568px), twins got their own side-by-side image, and the
flaw and twin rules above make more frames reach those sizes. Sheets stayed at 600px and
crops at 500px windows. Image tokens grow with area, about one per 28×28 pixels: a sheet
is about 460 per photo, a 1400px view about 1,700, a crop about 340. Claude Code shows the
model any image larger than 2000px on the long edge downscaled to that, so `review.mjs`
keeps every output within it. The test of the change: re-cull Prague's Malá Strana days
and see whether it finds the frames I remember.

## Pass logs

Each place's pass is written up in [`passes/`](passes/): Claude's rating for every photo
considered, a line on each selected photo, the near-duplicate runs and which frame won,
and the notable drops. The collection file holds only the result.

From the second pass on, a log also has a ratings file next to it
(`<album>.ratings.json`): every candidate with its rating, focus, technical notes and
critique, so the reasoning can be checked photo by photo. The first-pass logs stay as
they were, for comparison; the re-runs live in [`passes/v2/`](passes/v2/).

Since Vietnam, an album also leaves `<album>.firstlook.json` (step 3) and
`<album>.tags.json` (step 7) beside them. Frames added to an album that already has a pass
get their own files (`seoul-25-additions.*`); the tags file then covers every place they
touch, old frames included, with `"ratings"` as a list of both ratings files, since
`keyword.mjs` strips the keywords from any file of a listed place it isn't given. Re-running `keyword.mjs` on a changed tags file
or collection updates the files, so a later change is an edit plus a re-run.

## Tags

The vocabulary is [`src/data/tags.ts`](../src/data/tags.ts): 24 tags, 17 for subject and
7 for light, weather and treatment, with a description and an "applies when" for each.

- **Names are plain and consistent** (`looking-up`, `blue-hour`). Personality goes into
  chapter names and page text, not tag ids.
- **Most photos get 1–3 tags,** usually one or two for subject and at most one for light.
  That's the natural shape, not a rule.
- **A tag must fit photos in several places.** Something that only happens in one place
  is a chapter, not a tag (karsts, the sea of clouds, Train Street).
- **Close tags stay separate when the feel differs:** temples vs churches,
  skyline vs city-from-above. Parks are designed, forests are grown.

### Candidates: how the list grows

The vocabulary isn't fixed. During each trip's pass, anything that doesn't fit a tag is
noted below, with the trip and an example. **A candidate becomes a tag once it has shown
up in three trips.** Renames and merges are allowed; log them below, since a rename is a
bulk keyword rewrite.

| Candidate | Seen in | Notes |
| --- | --- | --- |
| `sun-in-frame` | Many sunsets and sunrises | Currently part of `golden-hour`; useful mainly for filtering |
| `markets` | Madeira (Funchal market, 9700), Vietnam (Hanoi Old Quarter), Hokkaido (Otaru glass shops) | Three trips, but a frame or two each; not yet worth a page |
| `waterfalls` | Seoraksan (Biryong, Towangseong), Madeira (Véu da Noiva, 0083), probably Hokkaido, Vietnam | DSCF3618 fits no tag today |
| `fireworks` | Seoul 2025 (the festival from Seoraeseom, 2589) | An event, one trip so far |
| `boats` | Vietnam (Ha Long, Ninh Binh), Copenhagen, Hokkaido (Otaru) | Might be a chapter rather than a tag |

### Log

- 2026-09-30: v1, 22 tags, from a survey of 8 albums (1,368 photos, 2024–2026).
  `parks-and-gardens` added after review.
- 2026-09-30: `new-architecture` now includes towers when they're the subject (Lotte Tower,
  N Seoul Tower; later the Sapporo TV tower).
- 2026-10-02: `animals` added early, ahead of the three-trip rule, because it's an obvious
  tag to have (Madeira 2025's cat, 9771; the parked Hanoi cat, 7554).
- 2026-10-02: `black-and-white` added early, for the same reason: St Joseph's in Hanoi (7508)
  and the Ny Carlsberg Glyptotek chapter in Copenhagen 2024.
