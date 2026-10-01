import type { PlaceCollection } from "./types";

// Approved 2026-09-30: nearly all one long day in the park, 23 Oct, 08:45 to 16:25.
// Ulsanbawi opens as the strongest chapter; the rest runs the morning cable car, the
// maples on the way down, the cloud after lunch, the rivers and falls, and the coast last
// as an epilogue (second pass, 2026-10-01: see editorial/passes/v2/seoraksan-25.md).
// Sokcho coast is a deliberate exception to "about five photos per chapter" (and makes
// six chapters): it's my arrival and either gets its own chapter or goes.
export const seoraksan25: PlaceCollection = {
  id: "seoraksan-25",
  name: "Seoraksan",
  trip: "Sokcho · Autumn 2025",
  source: "Sokcho 25",
  chapters: [
    {
      id: "ulsanbawi",
      name: "Ulsanbawi",
      photos: ["DSCF3425", "DSCF3444", "DSCF3454", "DSCF3466", "DSCF3468", "DSCF3469", "DSCF3477", "DSCF3481", "DSCF3449", "DSCF3482"],
    },
    {
      id: "up-to-gwongeumseong",
      name: "Up to Gwongeumseong",
      photos: ["DSCF3385", "DSCF3391", "DSCF3397", "DSCF3401", "DSCF3408", "DSCF3400", "DSCF3407"],
    },
    {
      id: "maple-season",
      name: "Maple season",
      photos: ["DSCF3422", "DSCF3430", "DSCF3487", "DSCF3494", "DSCF3499", "DSCF3431", "DSCF3502", "DSCF3503", "DSCF3520"],
    },
    {
      id: "into-the-cloud",
      name: "Into the cloud",
      photos: ["DSCF3541", "DSCF3545", "DSCF3559", "DSCF3555", "DSCF3564", "DSCF3581", "DSCF3587", "DSCF3588"],
    },
    {
      id: "rivers-and-falls",
      name: "Rivers and falls",
      photos: ["DSCF3532", "DSCF3591", "DSCF3612", "DSCF3618", "DSCF3627", "DSCF3631"],
    },
    {
      id: "sokcho-coast",
      name: "Sokcho coast",
      photos: ["DSCF3359", "DSCF3361", "DSCF3362", "DSCF3370"],
    },
  ],
  notes: {
    DSCF3391: "My pick: my reflection in the cable car window. 2★ as a frame; in because I like it.",
    DSCF3449: "My pick over its near-twin DSCF3448.",
    DSCF3466: "My pick over its near-twin DSCF3465.",
    DSCF3564: "My pick over DSCF3566, the same spire in landscape.",
    DSCF3631: "My pick over DSCF3639, Towangseong falls with a pine frame.",
    DSCF3397: "Kept on the second pass: I shot these through the glass on purpose, for the reflections of the people. Not the best version, but the view of mountain, city and coast makes up for the sloppy reflection work.",
    DSCF3425: "Moved from the falls: Ulsanbawi in morning sun from the valley floor opens the climb.",
    DSCF3520: "The only temple frame: Sinheungsa ends the walk down, so it closes the maples.",
  },
  dropped: [
    { what: "Sinheungsa and the Buddha", note: "No temple chapter; only DSCF3520 stays. Includes DSCF3519, the eaves from below (4★)." },
    { what: "DSCF3603, DSCF3546, DSCF3497", note: "Second pass: near-twins of DSCF3422, DSCF3545 and DSCF3499/3503. Of the last pair I kept 3499 over 3497." },
    { what: "The other coast frames (DSCF3360, 3363, 3369)", note: "The coast chapter keeps four." },
  ],
};
