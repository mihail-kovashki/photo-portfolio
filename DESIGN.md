# Design

How the site looks and moves, and why. Read before changing any UI. The values live in
`src/app/globals.css` and the components; this file says which ones are deliberate.

## The brief

A personal photo journal from travels, for friends arriving from Instagram first and
Fujifilm and recipe people second. **The photos are the hero; the interface stays quiet
around them.** Spend boldness on how photos appear and move, not on chrome.

- The site is a journal organised by trips, places and chapters, not by camera or recipe.
- Fujifilm is content, not branding: recipe and settings detail sits behind the lightbox
  info panel, the gear modal and (later) recipe pages, never on thumbnails.

## Home page

A portfolio front and a gateway, not the archive (`src/components/Home.tsx`,
`HomeTrips.tsx`, choices in `src/data/home.ts`). After the opening wall, one full-screen
cover from the latest trip with its name, a line of text and "View the trip"; nothing
rotates. Then every trip, newest first, as the same unit: name with season, places and
count, a large cover, its places as small covers, and each place's chapters as a line of
links, so trip → place → chapter is learnt by looking. It ends with "All N photos"
(`/all`, the full grid) and the trip index. Covers come from a hand-picked list of home
frames; no photo appears twice on the page.

## Palette

Dark only (`color-scheme: dark`), so photos read against a neutral ground.

| Token | Value | Role |
|---|---|---|
| `--background` | `#09090b` | Page. Near-black so photos, not the page, set the colour |
| `--card` | `#121215` | Raised surfaces; glass panels use it at 75% |
| `--foreground` | `#f4f4f5` | Primary text |
| `--muted` | `#71717a` | Secondary text; components use Tailwind `zinc-300…600` for steps |
| `--fuji-red` | `#d93829` | The signature dot (navbar, footer) and camera icons. Rare by design |
| `--accent-amber` | `#e59866` | Recipe / film-simulation details only |

No new hues without a reason in this file. Never tint photos or frame them in colour.

## Type

- **Playfair Display** (`font-serif`): names of things — hero, place, chapter and trip
  names, photo titles. Tracking tight at display sizes.
- **Geist Mono** (`font-mono`): metadata — dates, counts, EXIF, small uppercase labels.
- **Geist Sans**: everything else, controls included (body, buttons, pills, nav).

Uppercase tracked mono is reserved for metadata, not for a label above every heading.
Titles join context with middle dots ("Funchal · Madeira · Spring 2025") on purpose;
don't spread the device into body copy.

## Controls

The interface stays quiet, but anything you can press must look pressable at rest. Older
visitors on a tablet couldn't spot the controls: on touch there is no hover, so they only
ever saw the dimmest state, and the buttons were set in the metadata mono, so they read
as captions.

- **Sans, `text-sm`**, never the mono. Counts inside a control (a place pill's 63) stay
  mono, as metadata.
- **A visible edge at rest:** unselected pills and buttons get `border-white/20` (the
  header nav group `/15`) and `zinc-200…300` text. Selected is filled white. Text links
  are underlined, or at least underlined on touch (`pointer-coarse:underline`).
- **44 px to hit.** The `tap` utility (`globals.css`) widens the hit area to 44 px
  without changing how the control draws, so header pills stay compact. Where there is
  room, touch also draws them taller (`pointer-coarse:py-2.5`). Tune for touch with
  `pointer-coarse:`, not breakpoints: an iPad mini held upright is under `md`.
- **Say what it does.** Icon buttons get a word next to them from `sm` (Details, Close),
  and a bar that opens a menu carries a "Chapters ⌄" chip, not just a chevron.
- **Over photos,** controls sit on `bg-black/40…45` with a blur and a `white/25` edge.
  The `white/5` ghost fill disappears there.
- **Don't count on gestures.** The lightbox shows arrows from `sm` up, touch included, and
  its first-open hint mentions the swipe.

## Surfaces and texture

- `.film-grain` over the whole page at 2.5% opacity: the one analogue touch. Keep it
  subtle.
- `.glass-panel` / `.glass-pill` for sheets, the chapter bar and pills.
- Radius follows size: `rounded-full` pills, `rounded-lg/xl` cards, `rounded-2xl` sheets.
- Hidden scrollbars on horizontal tracks need an edge fade so they don't look complete.

## Motion

Two showpieces, the rest functional. `prefers-reduced-motion` is honoured everywhere
(CSS in `globals.css`, `MotionConfig reducedMotion="user"`, and the morph, flipper and
intro check it themselves); every new animation must too.

- **Showpiece:** thumbnail-to-lightbox morph (`src/lib/photoMorph.ts`, 420 ms).
- **Showpiece, on arrival:** the photo wall (`src/components/Intro.tsx`). Unbroken rows of
  the best frames run off both screen edges like strips of film, with "Come *wander*"
  over a fade in the middle. Scrolling drives it: rows slide apart in alternating
  directions while the home page's cover rises behind them, out of the dark rather than
  with a hard top edge; "Enter" plays the same thing. The wall leaves out the cover's
  frame, so the cover arrives fresh. Home page
  only, once per session (`?intro` replays it), never under reduced motion, and removed
  once passed. Its own layouts for phones upright and sideways. Fades sit behind the
  text only; the edges stay bright.
- **Card reveal:** photos "develop" from their blurred preview, sweeping left to right by
  column (`.photo-develop`, 700 ms).
- **Hero flipper:** place names only, one pass, settles on the latest trip.
- **Card hover:** 4 px lift and a light bottom overlay. No zoom.
- Sheets and modals: 200–250 ms, ease `[0.16, 1, 0.3, 1]`; lightbox slides on a spring
  (stiffness 350, damping 30–35). Sheets close on X, tap outside, Back and swipe down.

No scroll-triggered fade-ups on sections, no animated gradients, no parallax. The intro
is the one scroll-driven exception, and it is gone once passed.

## Tried and rejected

- Lens spotlight and photo peek effects (replaced by the morph).
- Recipe badge on every thumbnail; "Fujifilm" in the site title.
- A hover arrow or underline on the hero flipper.
- Zoom on card hover.
- A row of collection buttons for navigation (replaced by the trip index and pills).
- An endless grid of every photo as the home page (it lives at `/all` now). Other home
  pages were prototyped side by side and are parked on the `landing/lab` branch (`/lab`):
  a photobook sequence, a typographic index, a "how to wander" walkthrough, contact
  strips and a highlights grid. The highlights grid repeated the wall's frames.
- Intro: frames scattered at random around the welcome (read as disjointed, too small,
  and clumped on phones), and a middle row split around the text (a black box that broke
  the rows). Other intros are parked, not rejected, on the `intro/darkroom`,
  `intro/viewfinder` and `intro/board` branches.

## Quality floor

Responsive from a 375 px phone (portrait and landscape) up; 44 px touch targets; visible keyboard focus;
dialogs behave as dialogs; check changes in the browser pane at phone and desktop sizes
before calling them done.

Decisions behind this live in the Personal Projects vault: "Collections are trips,
Fujifilm is content" and "Trips, places, chapters and tags".
