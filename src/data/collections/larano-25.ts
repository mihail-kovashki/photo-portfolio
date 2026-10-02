import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/madeira-25.md). One walk, 27 Apr morning, ending at Porto da
// Cruz. The strongest frame (9817, the post's cover) leads rather than the first.
export const larano25: PlaceCollection = {
  id: "larano-25",
  name: "Vereda do Larano",
  trip: "Madeira · Spring 2025",
  source: "Madeira 2025",
  chapters: [
    {
      id: "on-the-vereda-do-larano",
      name: "On the Vereda do Larano",
      photos: ["DSCF9817", "DSCF9797", "DSCF9806", "DSCF9857", "DSCF9838", "DSCF9800", "DSCF9830", "DSCF9868"],
    },
    {
      id: "down-to-porto-da-cruz",
      name: "Down to Porto da Cruz",
      photos: ["DSCF9888", "DSCF9897", "DSCF9909", "DSCF9912", "DSCF9785", "DSCF9915"],
    },
  ],
  parked: [
    { photo: "DSCF9866", note: "The companion sitting above the coast; soft on her, focus went to the coast." },
    { photo: "DSCF9858", note: "Profile on the cliff edge; skipped for now." },
    { photo: "DSCF9825", note: "The companion photographing the cliff, from behind." },
  ],
};
