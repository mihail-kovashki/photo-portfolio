import type { PlaceCollection } from "./types";

// Approved 2026-10-01: one sunset on the Han, 3 June 2024, so no chapters yet. It may
// grow chapters if I edit more of that visit. A return to Seoul is its own place; see
// seoul-25.
export const seoul24: PlaceCollection = {
  id: "seoul-24",
  name: "Seoul",
  trip: "Korea · Spring 2024",
  source: "Korea 2024",
  photos: [
    "DSCF6343", "DSCF6341", "DSCF6363", "DSCF6380", "DSCF6381", "DSCF6390", "DSCF6392",
    "DSCF6416", "DSCF6430", "DSCF6442", "DSCF6449",
  ],
  notes: {
    DSCF6416: "My pick: the sun just above the arch, beside DSCF6430's sun under it.",
    DSCF6381: "Kept over Claude's second-pass objection: busy, but the sun plays beautifully with the clouds and the park has small human moments.",
  },
  dropped: [
    { what: "DSCF6358", note: "Second pass: a third tower silhouette, with a white floating box in the middle." },
    { what: "DSCF6387", note: "Second pass: I like it, but 6390 tells the same story better." },
  ],
};
