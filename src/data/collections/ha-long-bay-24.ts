import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/vietnam-24.md). One morning from the deck, 28 Nov 06:00–08:40,
// after the evening of the 27th, so the story wins: pink before sunrise, the sun, then the rowing boats.
export const haLongBay24: PlaceCollection = {
  id: "ha-long-bay-24",
  name: "Ha Long Bay",
  trip: "Vietnam · Autumn 2024",
  source: "Vietnam 2024",
  chapters: [
    {
      id: "before-sunrise",
      name: "Before sunrise",
      photos: ["DSCF7935", "DSCF8016", "DSCF8029", "DSCF8038", "DSCF8044", "DSCF8084", "DSCF8086"],
    },
    {
      id: "sunrise",
      name: "Sunrise",
      photos: ["DSCF8055", "DSCF8059", "DSCF8076", "DSCF8097", "DSCF8106", "DSCF8111", "DSCF8115"],
    },
    {
      id: "rowing-boats-and-the-arch",
      name: "Rowing boats and the arch",
      photos: ["DSCF8171", "DSCF8193", "DSCF8202", "DSCF8211", "DSCF8214", "DSCF8234", "DSCF8255"],
    },
  ],
  notes: {
    DSCF7935: "The evening before (27 Nov); opens the dawn chapter.",
    DSCF8211: "A real toss-up with 8214 (wide with the cliff, or under the arch): each has something the other misses. Both stay for now.",
  },
  parked: [
    { photo: "DSCF8046", note: "The soju bottle on deck, karst behind." },
    { photo: "DSCF8128", note: "The dragon prow facing the karsts." },
    { photo: "DSCF8157", note: "The tender's guide standing against the light." },
    { photo: "DSCF8263", note: "The junk with red sails; railing in frame." },
  ],
  dropped: [
    { what: "DSCF8010, DSCF8015, DSCF8031, DSCF8049", note: "Near-twins of 8038 in the dawn silhouette run." },
    { what: "DSCF8098, DSCF8103, DSCF8116", note: "The sun run collapses to 8111, plus 8106 for the cliff." },
    { what: "DSCF8172, DSCF8173", note: "Twins of 8171 with a railing or beam in frame." },
    { what: "DSCF8174, DSCF8229", note: "The dog on deck and the boat sign: memories, not photos." },
  ],
};
