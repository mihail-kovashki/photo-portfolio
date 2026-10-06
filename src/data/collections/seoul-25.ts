import type { PlaceCollection } from "./types";

// Approved 2026-09-30: the first place through the editorial pass. Chapter names are
// working names; rename freely. Achasan opens as the strongest chapter (and the city
// from above); the rest runs river, palaces, square, evening walk. Second pass
// 2026-10-01: see editorial/passes/v2/seoul-25.md. Additions 2026-10-06
// (editorial/passes/v2/seoul-25-additions.md): the fireworks after the Han, Olympic Park
// and Naksan last, so the page ends at night. Eight chapters: a month's stay, not a trip.
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
      id: "fireworks-over-the-han",
      name: "Fireworks over the Han",
      photos: ["DSCF2589", "DSCF2501", "DSCF2546", "DSCF2557", "DSCF2566", "DSCF2508", "DSCF2529"],
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
    {
      id: "olympic-park",
      name: "Olympic Park",
      photos: ["DSCF3271", "DSCF3292", "DSCF3309", "DSCF3322", "DSCF3317"],
    },
    {
      id: "evening-on-naksan",
      name: "Evening on Naksan",
      photos: ["DSCF3329", "DSCF3335", "DSCF3339", "DSCF3340", "DSCF3350", "DSCF3351", "DSCF3355", "DSCF3358"],
    },
  ],
  notes: {
    DSCF2161: "My pick: the cover of my \"People of the palace\" post. 2★ as a frame; in because I like it.",
    DSCF2190: "From my \"Today I give you the Wall\" post; the stepping stones pair with DSCF2188.",
    DSCF2294: "My quiet favourite: a lone tree at deep twilight. 4★ as a frame; closes the Han chapter.",
    DSCF2299: "Kept on the second pass: the power lines don't bother me, they're kind of interesting. A wide shot that places us on Achasan; second, not the opener.",
    DSCF2071: "Kept beside DSCF2269: a similar style, but a different place, time and vibe.",
    DSCF2164: "A toss-up with DSCF2150; both stay until I've lived with the page for a few days.",
    DSCF2589: "The finale, my posted cover and one of my favourites: opens the fireworks, which were minutes apart, so the order is free.",
    DSCF3322: "Raised to 4★ on my call: the earthen wall's path with the city behind.",
    DSCF3292: "Added for movement: the family on bikes, over the lone tree's landscape (DSCF3313) and the chestnut avenue (DSCF3301).",
    DSCF3358: "My pick: the ivy 7-Eleven at night. Busy, but full of small things; closes Naksan.",
    DSCF2148: "Clone or crop the red fire extinguisher, bottom left (edit queue).",
  },
  parked: [
    { photo: "DSCF2098", note: "Sculptural building at blue hour: great, but not on the Han. For an \"Around Seoul\" set." },
    { photo: "DSCF3344", note: "Bukhansan under pink clouds: the same minute as DSCF3340, facing the other way." },
    { photo: "DSCF2550", note: "White peonies falling through the arch; the toss-up with DSCF2546." },
    { photo: "DSCF3274", note: "The kochia with the apartment blocks: Olympic Park in its city." },
    { photo: "DSCF3354", note: "Lit wooden stairs through the pines on Naksan." },
  ],
  dropped: [
    { what: "DSCF2306", note: "Second pass: a golf driving-range net in the middle of a flat view." },
    { what: "DSCF2216", note: "Second pass: construction hoarding across the middle; DSCF2217 is the same field, cleaner, and was posted." },
    { what: "DSCF2244", note: "Second pass: near-twin of DSCF2245, the posted one." },
    { what: "DSCF2475", note: "Additions: the crowd waiting before the fireworks. The finale opens instead." },
    { what: "DSCF2509", note: "Additions: posted (as a vertical crop), but a near-twin of DSCF2508 in red." },
    { what: "DSCF3313", note: "Additions: the lone tree on its own; DSCF3317 has it with the couple." },
    { what: "DSCF3301", note: "Additions: the chestnut avenue, 3★ on my call; out for the cyclists (DSCF3292)." },
    { what: "Children's Grand Park (6 Sep)", note: "My nearest park; never found how to bring out its best." },
    { what: "DSCF2123, the moon", note: "The eclipse night: clouds rolled in minutes before. A memory, not a photo." },
  ],
};
