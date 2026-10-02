---
name: editorial-pass
description: "Run the editorial pass for one photo album of the portfolio: map it to trip and places, first look, close look, chapters, and after approval keywords, ingest, commit and vault update. Use when asked to start, continue or finish an editorial pass, review an album for the site, or with an album name such as 'Madeira 2025'. One album per session."
argument-hint: "<album folder name>, e.g. Madeira 2025"
user-invocable: true
---

# Editorial pass

The procedure and every rule live in `editorial/README.md`. This skill only says where
to start, what to read, and where to stop. If the two ever disagree, the README wins:
fix this file.

## Before anything else

1. Read `editorial/README.md` in full: the judging and chapter rules matter as much as
   "Running a pass".
2. Read the album's section of the vault note
   `/Users/mihail/Documents/Personal Projects/Projects/Portfolio editorial system.md`
   (a heading with the album's name). It holds what's agreed and the handoff from the last
   session. The edit queue and "to get better at" lists are in the same note.
3. Read the most recent log in `editorial/passes/v2/` for the format, and only that one.
   Don't open other albums' logs, ratings or images: finished albums stay out of this
   session.
4. Source: `~/Pictures/portfolio-source/<album>/`. Count the files.

## Which session this is

Decide from what exists, say which it is in one line, and start:

| What exists for the album | This session |
| --- | --- |
| Nothing yet | **A**: steps 1–3. If the album is small (about 150 photos or fewer, one or two places), carry on into B. |
| `<album>.firstlook.json`, no log | **B**: steps 4–6, from the first-look file. No new contact sheets. |
| A log without "After my review" | Waiting on Mihail. Ask for the review, or apply it if he's given it. |
| A log with "After my review", no collection files | **Step 7.** |

The `<album>` file stem is the album's name in the same form as the earlier logs
(`vietnam-24`, `hokkaido-25`).

## Stops

- **Mapping (step 2):** ask about anything he'd know and the files don't, before the
  first look.
- **End of session A:** the first-look file is saved, and the album's vault section has a
  short handoff: what's agreed, open questions, "close look next".
- **End of step 6:** stop for review. Send the chapter sheets (`review.mjs chapters`).
  Nothing goes into the photo files or `src/` before approval.
- **Step 7:** show the `keyword.mjs` preview (the tags) and wait for a yes before
  `--write`. After ingest, commit in the style of the earlier pass commits, push
  `develop`, then update the vault (the `sidequest` skill: daily log, the project note's
  State, and the album's section).

## Housekeeping

- Work images go to the session's scratchpad, never the repo.
- Write each frame's notes while it's in view (README, "Write as you look").
- Instagram: the method for matching posts to files is in the vault note
  `Learning/Perceptual hashes match Instagram posts only with careful downscaling.md`.
- If something in the procedure didn't work, fix the README in the same commit and say so.
