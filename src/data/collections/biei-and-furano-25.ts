import type { PlaceCollection } from "./types";

// Approved 2026-10-01. One day, 30 Sep: the Blue Pond and Shikisai-no-oka in Biei, then Farm Tomita in
// Furano. Neighbouring towns, one page. Shikisai-no-oka opens as the strongest.
export const bieiAndFurano25: PlaceCollection = {
  id: "biei-and-furano-25",
  name: "Biei and Furano",
  trip: "Hokkaido · Autumn 2025",
  source: "Hokkaido 25",
  chapters: [
    {
      id: "shikisai-no-oka",
      name: "Shikisai-no-oka",
      photos: ["DSCF2931", "DSCF2938", "DSCF2991", "DSCF3000", "DSCF3005", "DSCF3010", "DSCF2972", "DSCF2940", "DSCF3035"],
    },
    {
      id: "the-blue-pond",
      name: "The Blue Pond",
      photos: ["DSCF2859", "DSCF2909", "DSCF2856", "DSCF2900", "DSCF2918"],
    },
    {
      id: "farm-tomita",
      name: "Farm Tomita",
      photos: ["DSCF3087", "DSCF3048", "DSCF3051", "DSCF3092", "DSCF3093", "DSCF3101", "DSCF3117", "DSCF3044"],
    },
  ],
  notes: {
    DSCF3044: "The lavender ice cream: shot at Farm Tomita, not Shikisai-no-oka.",
  },
};
