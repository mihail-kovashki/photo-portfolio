import type { PlaceCollection } from "./types";

// Approved 2026-09-30: the first place through the editorial pass. Chapter names are
// working names; rename freely.
export const seoul25: PlaceCollection = {
  id: "seoul-25",
  name: "Seoul",
  trip: "Seoul · Autumn 2025",
  source: "Seoul 25",
  chapters: [
    {
      id: "along-the-han",
      name: "Along the Han",
      photos: ["DSCF2267", "DSCF2062", "DSCF2063", "DSCF2071", "DSCF2278", "DSCF2283", "DSCF2294"],
    },
    {
      id: "the-palaces",
      name: "The palaces",
      photos: ["DSCF2161", "DSCF2164", "DSCF2149", "DSCF2148", "DSCF2209", "DSCF2200", "DSCF2212"],
    },
    {
      id: "gwanghwamun-and-the-wall",
      name: "Gwanghwamun and the Wall",
      photos: ["DSCF2177", "DSCF2181", "DSCF2188", "DSCF2190", "DSCF2195", "DSCF2213"],
    },
    {
      id: "an-evening-in-anguk",
      name: "An evening in Anguk",
      photos: ["DSCF2216", "DSCF2224", "DSCF2232", "DSCF2236", "DSCF2243", "DSCF2244", "DSCF2246", "DSCF2248"],
    },
    {
      id: "sunset-from-achasan",
      name: "Sunset from Achasan",
      photos: ["DSCF2299", "DSCF2306", "DSCF2307", "DSCF2314", "DSCF2330", "DSCF2334", "DSCF2369", "DSCF2347", "DSCF2392"],
    },
  ],
  notes: {
    DSCF2161: "My pick: the cover of my \"People of the palace\" post. 2★ as a frame; in because I like it.",
    DSCF2190: "From my \"Today I give you the Wall\" post; the stepping stones pair with DSCF2188.",
    DSCF2294: "My quiet favourite: a lone tree at deep twilight. 4★ as a frame; closes the Han chapter.",
  },
  parked: [
    { photo: "DSCF2098", note: "Sculptural building at blue hour: great, but not on the Han. For an \"Around Seoul\" set." },
  ],
  dropped: [
    { what: "Children's Grand Park (6 Sep)", note: "My nearest park; never found how to bring out its best." },
    { what: "DSCF2123, the moon", note: "The eclipse night: clouds rolled in minutes before. A memory, not a photo." },
  ],
};
