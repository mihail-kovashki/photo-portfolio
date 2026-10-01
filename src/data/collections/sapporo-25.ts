import type { PlaceCollection } from "./types";

// Approved 2026-10-01. The base for the trip, 28 Sep to 1 Oct. Jozankei and the Hill of the Buddha are
// day trips but within Sapporo, so they're chapters here. The city opens, as people would expect, then the more
// specific places. (The Buddha scored highest on stars, a little high.)
export const sapporo25: PlaceCollection = {
  id: "sapporo-25",
  name: "Sapporo",
  trip: "Hokkaido · Autumn 2025",
  source: "Hokkaido 25",
  chapters: [
    {
      id: "from-the-tower-to-after-dark",
      name: "From the tower to after dark",
      photos: ["DSCF2847", "DSCF2596", "DSCF2597", "DSCF2605", "DSCF2612", "DSCF2618", "DSCF2621", "DSCF2623", "DSCF2632", "DSCF2631", "DSCF2636", "DSCF2639"],
    },
    {
      id: "hill-of-the-buddha",
      name: "Hill of the Buddha",
      photos: ["DSCF3165", "DSCF3172", "DSCF3170", "DSCF3176", "DSCF3182", "DSCF3184", "DSCF3192"],
    },
    {
      id: "hokkaido-jingu",
      name: "Hokkaido Jingu",
      photos: ["DSCF3205", "DSCF3209", "DSCF3211", "DSCF3212", "DSCF3231", "DSCF3233"],
    },
    {
      id: "jozankei",
      name: "Jozankei",
      photos: ["DSCF3133", "DSCF3134", "DSCF3141", "DSCF3143", "DSCF3140"],
    },
    {
      id: "shiroi-koibito-park",
      name: "Shiroi Koibito Park",
      photos: ["DSCF2811", "DSCF2825", "DSCF2829", "DSCF2836", "DSCF2840", "DSCF2816", "DSCF3236", "DSCF3254"],
    },
  ],
  notes: {
    DSCF2847: "My ask: the TV tower as the main subject of the city chapter. Odori at pink dusk, 29 Sep.",
  },
  dropped: [
    { what: "DSCF2592 (Odori, the TV tower over red flowers)", note: "Was on the old page, picked at random; DSCF2847 replaces it as the TV tower frame." },
  ],
};
