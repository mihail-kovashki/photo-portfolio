import type { PlaceCollection } from "./types";

// Approved 2026-10-25 (editorial/passes/v2/beijing-25.md, "After my review") and extended
// 2026-11-05 with the third day (beijing-25-additions.md): St Joseph's at night (29 Oct), 30 Oct,
// a hazy, busy day from Tiananmen through the Forbidden City to Beihai, and 1 Nov, the Temple
// of Heaven in hard sun and Jingshan at dusk into the night at the palace walls. The Summer
// Palace, the same afternoon, is its own place (summer-palace-25). Chapters run roughly by time
// but the stronger come first: the night opens, as it shows the palace and the city at once, and
// Tiananmen, all 3★, closes. Photos in a chapter go strongest first, except the night, which
// keeps time order because the light going is its subject.
export const beijing25: PlaceCollection = {
  id: "beijing-25",
  name: "Beijing",
  trip: "Beijing · Autumn 2025",
  source: "Beijing 25",
  chapters: [
    {
      id: "jingshan-and-the-night",
      name: "Jingshan at dusk, the palace walls by night",
      photos: [
        "DSCF4470", "DSCF4465", "DSCF4485", "DSCF4496", "DSCF4499", "DSCF4507", "DSCF4515",
        "DSCF4522", "DSCF4531", "DSCF4536-2", "DSCF4545", "DSCF4556", "DSCF3646",
      ],
    },
    {
      id: "lanes-garden-and-moat",
      name: "The Forbidden City: lanes, garden and moat",
      photos: [
        "DSCF3780", "DSCF3812", "DSCF3786", "DSCF3774", "DSCF3767", "DSCF3791", "DSCF3833",
        "DSCF3832", "DSCF3802", "DSCF3816", "DSCF3778",
      ],
    },
    {
      id: "temple-of-heaven",
      name: "The Temple of Heaven",
      photos: [
        "DSCF4209", "DSCF4177", "DSCF4155", "DSCF4175", "DSCF4167", "DSCF4169", "DSCF4143",
        "DSCF4136", "DSCF4133", "DSCF4141",
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
    DSCF4470: "5★: the Forbidden City from Jingshan at dusk, the Shenwu Gate lit on the axis and the roofs darkening to the city's lights.",
    "DSCF4536-2": "The second edit: a clean deep blue where the first has a grey-green cast and grain.",
    DSCF3646: "St Joseph's, from 29 Oct, closes the night: four frames were too few for a chapter of their own.",
    DSCF4522: "3★, the Shenwu Gate over its crowd of raised phones: the pillar at the right edge is on the edit queue.",
  },
  parked: [
    { photo: "DSCF3641", note: "St Joseph's frontal at night: DSCF3646 took the night chapter's place." },
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
    { photo: "DSCF4471", note: "A second after DSCF4470 and as good: the backup." },
    { photo: "DSCF4557", note: "The corner tower's reflection in landscape: a toss-up with DSCF4556." },
    { photo: "DSCF4500", note: "Jingshan's lit pavilion with its glazed base: a third pavilion beside DSCF4499 and DSCF4507." },
    { photo: "DSCF4524", note: "The Shenwu Gate across the empty road: DSCF4522, over its crowd, took the place." },
    { photo: "DSCF4511", note: "The White Dagoba under the branch, over the crowd's phones: DSCF4515 without the crowd took the place." },
    { photo: "DSCF4200", note: "A woman in cream hanfu posing for her photographer at the Temple of Heaven: a stranger's face as the subject." },
    { photo: "DSCF4208", note: "The four robed women closer, the Hall squeezed between trees: DSCF4209 took the place." },
    { photo: "DSCF4182", note: "The sun bursting over the Hall's tiers: flare blobs on the frieze, on the edit queue." },
  ],
  dropped: [
    { what: "DSCF4132, DSCF4489, DSCF4508", note: "1 Nov frames at 2★ in the close look (beijing-25-additions.md, Drops)." },
    { what: "DSCF4548", note: "The robed women walking by the moat at night: soft and noisy at 100%." },
    { what: "DSCF3652, DSCF3666, DSCF3674, DSCF3675, DSCF3741, DSCF3810", note: "Tiananmen and palace records at 2★ in the close look: nothing organises the frame (beijing-25.md, Drops)." },
  ],
};
