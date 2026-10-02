import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/vietnam-24.md). One afternoon, 29 Nov: the boat ride, then the pier
// at dusk. Two chapters, under the usual three: fine for now; may fold into a larger Ninh Bình place if I
// edit the rest of that trip (Tràng An and more).
export const tamCoc24: PlaceCollection = {
  id: "tam-coc-24",
  name: "Tam Cốc",
  trip: "Vietnam · Autumn 2024",
  source: "Vietnam 2024",
  chapters: [
    {
      id: "on-the-river",
      name: "On the river",
      photos: ["DSCF8330", "DSCF8334", "DSCF8359", "DSCF8420", "DSCF8444", "DSCF8439", "DSCF8441"],
    },
    {
      id: "the-pier-at-dusk",
      name: "The pier at dusk",
      photos: ["DSCF8505", "DSCF8510", "DSCF8523", "DSCF8524", "DSCF8549", "DSCF8572"],
    },
  ],
  parked: [
    { photo: "DSCF8306", note: "Rower by the stupa, golden side light." },
    { photo: "DSCF8340", note: "Two egrets behind lotus buds; slightly soft." },
    { photo: "DSCF8565", note: "Magenta sky over the pier, but the resort's neon sign dominates." },
  ],
  dropped: [
    { what: "DSCF8432", note: "Motion blur across the boat." },
  ],
};
