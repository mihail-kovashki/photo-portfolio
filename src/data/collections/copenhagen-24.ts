import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/copenhagen-24.md). 4–5 Sep: a harbour boat tour, the Glyptotek, the evening
// walk into Christianshavn, Rosenborg and the Marble Church. Half edited; it will grow. The city opens with the
// harbour; the evening walk closes on the gold spire.
export const copenhagen24: PlaceCollection = {
  id: "copenhagen-24",
  name: "Copenhagen",
  trip: "Copenhagen · Autumn 2024",
  source: "Copenhagen 2024",
  chapters: [
    {
      id: "the-harbour-from-the-water",
      name: "The harbour from the water",
      photos: ["DSCF6537", "DSCF6590", "DSCF6594", "DSCF6597", "DSCF6641", "DSCF6668"],
    },
    {
      id: "towers-and-spires",
      name: "Towers and spires",
      photos: ["DSCF6804", "DSCF6547", "DSCF6784", "DSCF6897", "DSCF6933", "DSCF6789"],
    },
    {
      id: "the-glyptotek-in-black-and-white",
      name: "The Glyptotek, in black and white",
      photos: ["DSCF6779", "DSCF6776", "DSCF6771", "DSCF6772", "DSCF6775"],
    },
    {
      id: "evening-into-christianshavn",
      name: "Evening into Christianshavn",
      photos: ["DSCF6794", "DSCF6800", "DSCF6803", "DSCF6813", "DSCF6816", "DSCF6818"],
    },
  ],
  notes: {
    DSCF6789: "My pick: the BESA and Starbucks banners are a blemish, but it was in the Looking up post. Last in its chapter.",
    DSCF6641: "Toss-up with 6638 (Copenhill smoking behind Nyholm); 6641 for the speedboat.",
  },
  parked: [
    { photo: "DSCF6638", note: "Copenhill smoking behind Nyholm: the toss-up with 6641." },
    { photo: "DSCF6692", note: "Our Saviour's spiral from the water, grey, under tram wires; 6818 has the light." },
    { photo: "DSCF6811", note: "Christianshavn canal with the restaurant boat; 6816 is the canal frame." },
    { photo: "DSCF6783", note: "City Hall, wide; 6784 is tighter." },
  ],
  dropped: [
    { what: "DSCF6728", note: "Christiansborg tower behind a beige canopy." },
    { what: "DSCF6576", note: "The Playhouse small between water and sky." },
  ],
};
