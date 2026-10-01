import type { PlaceCollection } from "./types";

// Approved 2026-09-30: the first place through the editorial pass. Chapter names are
// working names; rename freely. Achasan opens as the strongest chapter (and the city
// from above); the rest runs river, palaces, square, evening walk. Second pass
// 2026-10-01: see editorial/passes/v2/seoul-25.md.
export const seoul25: PlaceCollection = {
  id: "seoul-25",
  name: "Seoul",
  trip: "Seoul · Autumn 2025",
  source: "Seoul 25",
  chapters: [
    {
      id: "sunset-from-achasan",
      name: "Sunset from Achasan",
      photos: ["DSCF2307", "DSCF2299", "DSCF2314", "DSCF2330", "DSCF2334", "DSCF2369", "DSCF2347", "DSCF2392"],
    },
    {
      id: "along-the-han",
      name: "Along the Han",
      photos: ["DSCF2267", "DSCF2062", "DSCF2063", "DSCF2071", "DSCF2269", "DSCF2278", "DSCF2283", "DSCF2294"],
    },
    {
      id: "the-palaces",
      name: "The palaces",
      photos: ["DSCF2161", "DSCF2164", "DSCF2150", "DSCF2149", "DSCF2148", "DSCF2209", "DSCF2200", "DSCF2212"],
    },
    {
      id: "gwanghwamun-and-the-wall",
      name: "Gwanghwamun and the Wall",
      photos: ["DSCF2190", "DSCF2181", "DSCF2177", "DSCF2188", "DSCF2195", "DSCF2194", "DSCF2213"],
    },
    {
      id: "an-evening-in-anguk",
      name: "An evening in Anguk",
      photos: ["DSCF2217", "DSCF2224", "DSCF2232", "DSCF2236", "DSCF2243", "DSCF2245", "DSCF2246", "DSCF2248", "DSCF2250"],
    },
  ],
  notes: {
    DSCF2161: "My pick: the cover of my \"People of the palace\" post. 2★ as a frame; in because I like it.",
    DSCF2190: "From my \"Today I give you the Wall\" post; the stepping stones pair with DSCF2188.",
    DSCF2294: "My quiet favourite: a lone tree at deep twilight. 4★ as a frame; closes the Han chapter.",
    DSCF2299: "Kept on the second pass: the power lines don't bother me, they're kind of interesting. A wide shot that places us on Achasan; second, not the opener.",
    DSCF2071: "Kept beside DSCF2269: a similar style, but a different place, time and vibe.",
    DSCF2164: "A toss-up with DSCF2150; both stay until I've lived with the page for a few days.",
    DSCF2148: "Clone or crop the red fire extinguisher, bottom left (edit queue).",
  },
  parked: [
    { photo: "DSCF2098", note: "Sculptural building at blue hour: great, but not on the Han. For an \"Around Seoul\" set." },
  ],
  dropped: [
    { what: "DSCF2306", note: "Second pass: a golf driving-range net in the middle of a flat view." },
    { what: "DSCF2216", note: "Second pass: construction hoarding across the middle; DSCF2217 is the same field, cleaner, and was posted." },
    { what: "DSCF2244", note: "Second pass: near-twin of DSCF2245, the posted one." },
    { what: "Children's Grand Park (6 Sep)", note: "My nearest park; never found how to bring out its best." },
    { what: "DSCF2123, the moon", note: "The eclipse night: clouds rolled in minutes before. A memory, not a photo." },
  ],
};
