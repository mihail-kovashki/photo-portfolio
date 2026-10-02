import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/vietnam-24.md). 24–25 Nov. The lake by day opens, as posted;
// the days run in order and both evenings at the lake are one chapter.
export const hanoi24: PlaceCollection = {
  id: "hanoi-24",
  name: "Hanoi",
  trip: "Vietnam · Autumn 2024",
  source: "Vietnam 2024",
  chapters: [
    {
      id: "hoan-kiem-lake-by-day",
      name: "Hoàn Kiếm Lake by day",
      photos: ["DSCF7496", "DSCF7486", "DSCF7487", "DSCF7489", "DSCF7498", "DSCF7492", "DSCF7508"],
    },
    {
      id: "train-street",
      name: "Train Street",
      photos: ["DSCF7610", "DSCF7588", "DSCF7595", "DSCF7592", "DSCF7596", "DSCF7603"],
    },
    {
      id: "temple-of-literature",
      name: "Temple of Literature",
      photos: ["DSCF7644", "DSCF7658", "DSCF7660", "DSCF7669", "DSCF7673", "DSCF7682"],
    },
    {
      id: "hoan-kiem-after-dark",
      name: "Hoàn Kiếm after dark",
      photos: ["DSCF7570", "DSCF7729", "DSCF7730", "DSCF7735", "DSCF7764", "DSCF7765", "DSCF7782", "DSCF7785"],
    },
  ],
  notes: {
    DSCF7489: "The Enhanced-NR edit is the one keyworded; the original of the same number stays out.",
    DSCF7765: "Soft on the couple at 100%, sharp on the tower. In for the story, rated 4 rather than 5.",
  },
  parked: [
    { photo: "DSCF7554", note: "The cat on the tiles, 4★, and my favourite too. Proposed \"Around Hanoi\" set for later, with DSCF7469 (the Old Quarter fruit vendor) and DSCF7777 (the roundabout at night)." },
    { photo: "DSCF7469", note: "Old Quarter street with the fruit vendor; for \"Around Hanoi\"." },
    { photo: "DSCF7777", note: "The roundabout at night, motorbike blur; for \"Around Hanoi\"." },
  ],
  dropped: [
    { what: "DSCF7507", note: "Twin of 7508 (St Joseph's in B&W); 7508 has the cross's headroom." },
    { what: "DSCF7567, DSCF7572, DSCF7746, DSCF7747", note: "Lit trees over the lake at night; the night chapter already has the lake from closer." },
    { what: "DSCF7470, DSCF7558", note: "Records, not photos." },
  ],
};
