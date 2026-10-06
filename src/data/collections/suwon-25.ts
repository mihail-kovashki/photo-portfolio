import type { PlaceCollection } from "./types";

// Approved 2026-10-06 (editorial/passes/v2/seoul-25-additions.md). One day, 22 Sep, a day
// trip from Seoul under a flat white sky. The fortress walk in order, closing on the silver
// grass; then the palace's roofs and the town.
export const suwon25: PlaceCollection = {
  id: "suwon-25",
  name: "Suwon",
  trip: "Seoul · Autumn 2025",
  source: "Seoul 25",
  chapters: [
    {
      id: "hwaseong-fortress",
      name: "Hwaseong Fortress",
      photos: ["DSCF2401", "DSCF2419", "DSCF2430", "DSCF2431", "DSCF2435", "DSCF2436", "DSCF2434"],
    },
    {
      id: "haenggung-and-the-old-town",
      name: "Haenggung and the old town",
      photos: ["DSCF2450", "DSCF2454", "DSCF2458", "DSCF2445", "DSCF2463"],
    },
  ],
  notes: {
    DSCF2434: "Out of time order: the silver grass under the watchtower closes the walk; DSCF2436 was a weak closer.",
    DSCF2430: "A toss-up with DSCF2427 (the pavilion over the pond, parked).",
  },
  parked: [
    { photo: "DSCF2397", note: "The Starfield library (4★): a mall, not the fortress. Could open the town chapter." },
    { photo: "DSCF2427", note: "Banghwasuryujeong over Yongyeon pond: the toss-up with DSCF2430." },
    { photo: "DSCF2422", note: "The pond's island with the town and the hills behind." },
  ],
  dropped: [
    { what: "DSCF2418, DSCF2420", note: "Hwahongmun near-twins; DSCF2419 has the pavilion on the hill." },
    { what: "DSCF2453", note: "The Haenggung rooflines; DSCF2450 is the cleaner eave." },
  ],
};
