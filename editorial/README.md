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

- **Per-photo facts are keywords** in the photo files (Lightroom keywords, or written
  with ExifTool for back-catalogue JPEGs that never went through Lightroom):
  `site/place/<place>`, `site/chapter/<chapter>`, `site/tag/<tag-id>`. Keywords are a
  portable standard (XMP/IPTC), so they survive leaving Lightroom.
- **Words and order live in this repo** as plain text: chapter names, trip and place
  notes, captions, sequence.
- The site's input is a folder of finished JPEGs with those keywords, plus the text here.
  Lightroom exports and Google Photos downloads both produce it.

## Tags

The vocabulary is [`src/data/tags.ts`](../src/data/tags.ts): 22 tags, 16 for subject and
6 for light and weather, with a description and an "applies when" for each.

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
| `black-and-white` | Vietnam 2024 (St. Joseph's), Korea 2024 (Yeosu swimmer) | Two frames so far |
| `sun-in-frame` | Many sunsets and sunrises | Currently part of `golden-hour`; useful mainly for filtering |
| `markets` | Madeira (Funchal market), Vietnam (Hanoi Old Quarter), Hokkaido (Otaru glass shops) | Close to three trips, but mostly a frame or two each |
| `boats` | Vietnam (Ha Long, Ninh Binh), Copenhagen, Hokkaido (Otaru) | Might be a chapter rather than a tag |

### Log

- 2026-09-30: v1, 22 tags, from a survey of 8 albums (1,368 photos, 2024–2026).
  `parks-and-gardens` added after review.
