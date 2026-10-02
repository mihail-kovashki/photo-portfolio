import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/copenhagen-24.md). One day, 6 Sep, a day trip from Copenhagen. The old
// town opens; the parks and the Torso chapters lead with their strongest frames, since a few hours apart
// tell no story.
export const malmo24: PlaceCollection = {
  id: "malmo-24",
  name: "Malmö",
  trip: "Copenhagen · Autumn 2024",
  source: "Copenhagen 2024",
  chapters: [
    {
      id: "the-old-town",
      name: "The old town",
      photos: ["DSCF6979", "DSCF6995", "DSCF7011", "DSCF7016", "DSCF7028", "DSCF7031", "DSCF7036", "DSCF7123"],
    },
    {
      id: "the-city-library",
      name: "The City Library",
      photos: ["DSCF7051", "DSCF7062", "DSCF7055", "DSCF7053", "DSCF7058"],
    },
    {
      id: "kungsparken",
      name: "Kungsparken",
      photos: ["DSCF7115", "DSCF7073", "DSCF7043", "DSCF7090", "DSCF7045", "DSCF7046"],
    },
    {
      id: "slottsparken-and-the-torso",
      name: "Slottsparken and the Torso",
      photos: ["DSCF7098", "DSCF7099", "DSCF7067", "DSCF7097", "DSCF7110"],
    },
  ],
  notes: {
    DSCF7115: "My pick: raised to 4★ and opens Kungsparken, though the people are at a distance.",
    DSCF7123: "The orange house at five, over 7029 at noon (both were posted).",
  },
  parked: [
    { photo: "DSCF7029", note: "The orange house at noon: the toss-up with 7123." },
    { photo: "DSCF7080", note: "The Kungsparken fountain through branches; third fountain frame." },
  ],
  dropped: [
    { what: "DSCF7033", note: "The window with the red cat: posted, but a filler on its own." },
    { what: "DSCF6976", note: "St Johannes under scaffolding; 6979 has none." },
    { what: "DSCF7052", note: "The library hall behind shelf signs." },
  ],
};
