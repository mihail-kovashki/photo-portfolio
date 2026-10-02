import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/madeira-25.md). The base: the 26 Apr afternoon and evening, and
// the 28 Apr morning at Seixal. Two chapters for now; more of this album is still to be edited.
export const saoVicente25: PlaceCollection = {
  id: "sao-vicente-25",
  name: "São Vicente",
  trip: "Madeira · Spring 2025",
  source: "Madeira 2025",
  chapters: [
    {
      id: "the-serra-de-agua-valley",
      name: "The Serra de Água valley",
      photos: ["DSCF9742", "DSCF9739", "DSCF9757", "DSCF9763", "DSCF9752", "DSCF9758"],
    },
    {
      id: "the-coast-sao-vicente-to-seixal",
      name: "The coast, São Vicente to Seixal",
      photos: ["DSCF9776", "DSCF9773", "DSCF9771", "DSCF0102", "DSCF0083", "DSCF0096"],
    },
  ],
  notes: {
    DSCF9771: "My pick: the cat under the fence, taken in São Vicente that evening. Fits no chapter's theme; in because I love it.",
  },
  parked: [
    { photo: "DSCF9767", note: "Two agapanthus heads against the dark forest." },
  ],
};
