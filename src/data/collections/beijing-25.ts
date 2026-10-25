import type { PlaceCollection } from "./types";

// Approved 2026-10-25 (editorial/passes/v2/beijing-25.md, "After my review"). Two of three
// days so far: St Joseph's at night (29 Oct, parked) and 30 Oct, a hazy, busy day from
// Tiananmen through the Forbidden City to Beihai. The third day (the Temple of Heaven, the
// night from Jingshan) arrives as beijing-25-additions. Chapters run roughly by time but the
// stronger come first, so Tiananmen, all 3★, closes; photos in a chapter go strongest first.
export const beijing25: PlaceCollection = {
  id: "beijing-25",
  name: "Beijing",
  trip: "Beijing · Autumn 2025",
  source: "Beijing 25",
  chapters: [
    {
      id: "lanes-garden-and-moat",
      name: "The Forbidden City: lanes, garden and moat",
      photos: [
        "DSCF3780", "DSCF3812", "DSCF3786", "DSCF3774", "DSCF3767", "DSCF3791", "DSCF3833",
        "DSCF3832", "DSCF3802", "DSCF3816", "DSCF3778",
      ],
    },
    {
      id: "gates-and-halls",
      name: "The Forbidden City: gates and halls",
      photos: [
        "DSCF3726", "DSCF3713", "DSCF3737", "DSCF3700", "DSCF3747", "DSCF3759", "DSCF3735",
        "DSCF3742", "DSCF3705", "DSCF3717", "DSCF3721",
      ],
    },
    {
      id: "beihai",
      name: "Beihai in the haze",
      photos: [
        "DSCF3900", "DSCF3899", "DSCF3851", "DSCF3873", "DSCF3871", "DSCF3845", "DSCF3852",
        "DSCF3858", "DSCF3885", "DSCF3888",
      ],
    },
    {
      id: "tiananmen",
      name: "Tiananmen and the Meridian Gate",
      photos: [
        "DSCF3662", "DSCF3688", "DSCF3683", "DSCF3687", "DSCF3678", "DSCF3669", "DSCF3691",
      ],
    },
  ],
  notes: {
    DSCF3774: "3★ in the close look, 4★ at review: one of my favourites of the palace. The separate groups along the bridge are the point.",
    DSCF3780: "The nearest to a 5★ of the city: a few degrees off the axis; straightening it is on the edit queue.",
    DSCF3888: "The man with the cat on his lap and his camera at his side: the moment carries a heavy trunk at the left.",
    DSCF3662: "3★, opens Tiananmen: the flagpole gives the square its scale.",
  },
  parked: [
    { photo: "DSCF3646", note: "St Joseph's at night through the arch gate: with 3641 and 3644, for a night chapter once Jingshan arrives." },
    { photo: "DSCF3641", note: "St Joseph's frontal at night." },
    { photo: "DSCF3644", note: "St Joseph's at an angle behind blurred red flowers." },
    { photo: "DSCF3801", note: "The same ceiling as DSCF3812, keeping the lit windows." },
    { photo: "DSCF3734", note: "The hall with the robed pair in landscape: a toss-up with DSCF3735." },
    { photo: "DSCF3797", note: "The garden gallery behind a tree: DSCF3802 took the place; the trunk splits the frame." },
    { photo: "DSCF3766", note: "The side halls' roofs over carved marble posts." },
    { photo: "DSCF3752", note: "The Hall of Supreme Harmony's eave in a long diagonal." },
    { photo: "DSCF3763", note: "The double eave against blue: DSCF3747 is the idea done better." },
    { photo: "DSCF3842", note: "The dagoba doubled in the lake, with the fruit pedal boat: DSCF3871 took the place." },
    { photo: "DSCF3902", note: "Jade Islet as one band between grey water and sky, 16:9: the minimal take, beside DSCF3899." },
    { photo: "DSCF3901", note: "The islet small across the lake past a willow and a railing." },
    { photo: "DSCF3657", note: "A girl in red posing for her family at Tiananmen: a stranger's child as the subject." },
    { photo: "DSCF3710", note: "The yellow emperor's robe against the red wall: four figures in a flat row." },
  ],
  dropped: [
    { what: "DSCF3652, DSCF3666, DSCF3674, DSCF3675, DSCF3741, DSCF3810", note: "Tiananmen and palace records at 2★ in the close look: nothing organises the frame (beijing-25.md, Drops)." },
  ],
};
