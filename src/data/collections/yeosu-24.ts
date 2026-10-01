import type { PlaceCollection } from "./types";

// Approved 2026-10-01: two days, 21–22 May 2024. All three chapters sit at or under
// "about five photos"; the chapter names leave room for more Yeosu edits later.
export const yeosu24: PlaceCollection = {
  id: "yeosu-24",
  name: "Yeosu",
  trip: "Korea · Spring 2024",
  source: "Korea 2024",
  chapters: [
    {
      id: "yeosu-by-dusk",
      name: "Yeosu by dusk",
      photos: ["DSCF4890", "DSCF4893", "DSCF4927", "DSCF4953", "DSCF4964"],
    },
    {
      id: "yeosu-by-day",
      name: "Yeosu by day",
      photos: ["DSCF4969", "DSCF4993", "DSCF5000", "DSCF4987", "DSCF5002"],
    },
    {
      id: "hyangiram",
      name: "Hyangiram",
      photos: ["DSCF5017", "DSCF5027", "DSCF5014", "DSCF5032", "DSCF5034"],
    },
  ],
  notes: {
    DSCF4890: "Out of focus on the sign, but creatively so; the YEOSU sign is the welcome.",
    DSCF5014: "Blurred leaves at the corners are a blemish, noted; the frame stays for its mood.",
    DSCF5017: "Sensor dust in the sky: clone it out and re-export (edit queue).",
    DSCF5034: "Sensor dust in the sky: clone it out and re-export (edit queue).",
  },
  dropped: [
    { what: "DSCF4871", note: "Second pass: shot through the cable car glass, reflections and blur across the frame." },
    { what: "The swimmer (DSCF5048, five edits)", note: "Busan, 24 May. I was having fun with edits; not for the site for now." },
  ],
};
