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
- **Geist Sans**: everything else (body, buttons).

Uppercase tracked mono is reserved for metadata, not for a label above every heading.
Titles join context with middle dots ("Funchal · Madeira · Spring 2025") on purpose;
don't spread the device into body copy.

## Surfaces and texture

- `.film-grain` over the whole page at 2.5% opacity: the one analogue touch. Keep it
  subtle.
- `.glass-panel` / `.glass-pill` for sheets, the chapter bar and pills.
- Radius follows size: `rounded-full` pills, `rounded-lg/xl` cards, `rounded-2xl` sheets.
- Hidden scrollbars on horizontal tracks need an edge fade so they don't look complete.

## Motion

One showpiece, the rest functional. `prefers-reduced-motion` is honoured everywhere
(CSS in `globals.css`, `MotionConfig reducedMotion="user"`, and the morph and flipper
check it themselves); every new animation must too.

- **Showpiece:** thumbnail-to-lightbox morph (`src/lib/photoMorph.ts`, 420 ms).
- **Card reveal:** photos "develop" from their blurred preview, sweeping left to right by
  column (`.photo-develop`, 700 ms).
- **Hero flipper:** place names only, one pass, settles on the latest trip.
- **Card hover:** 4 px lift and a light bottom overlay. No zoom.
- Sheets and modals: 200–250 ms, ease `[0.16, 1, 0.3, 1]`; lightbox slides on a spring
  (stiffness 350, damping 30–35). Sheets close on X, tap outside, Back and swipe down.

No scroll-triggered fade-ups on sections, no animated gradients, no parallax.

## Tried and rejected

- Lens spotlight and photo peek effects (replaced by the morph).
- Recipe badge on every thumbnail; "Fujifilm" in the site title.
- A hover arrow or underline on the hero flipper.
- Zoom on card hover.
- A row of collection buttons for navigation (replaced by the trip index and pills).

## Quality floor

Responsive from a 375 px phone (portrait and landscape) up; visible keyboard focus;
dialogs behave as dialogs; check changes in the browser pane at phone and desktop sizes
before calling them done.

Decisions behind this live in the Personal Projects vault: "Collections are trips,
Fujifilm is content" and "Trips, places, chapters and tags".
