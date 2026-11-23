import type { PlaceCollection } from "./types";

// Approved 2026-11-23 (editorial/passes/v2/kiyomizu-dera-25.md, "After my review"). The first
// hour in Kyoto, 12 Nov, 16:19–17:16: up through the gates to the pagoda in the last daylight,
// the stage seen across its valley of maples as the sky turned, then dusk and the lanterns. The
// stage view opens, since it's what the place is; the gates chapter scores a little higher and
// comes second. Photos in a chapter go strongest first. More of Kyoto comes later as kyoto-25.
export const kiyomizuDera25: PlaceCollection = {
  id: "kiyomizu-dera-25",
  name: "Kiyomizu-dera",
  trip: "Japan · Autumn 2025",
  source: "Japan 25",
  chapters: [
    {
      id: "stage-over-the-maples",
      name: "The stage over the maples",
      photos: ["DSCF5587", "DSCF5558", "DSCF5549", "DSCF5598", "DSCF5528", "DSCF5588", "DSCF5563"],
    },
    {
      id: "gates-and-pagoda",
      name: "Gates and the pagoda in the last daylight",
      photos: ["DSCF5515", "DSCF5524", "DSCF5510", "DSCF5594", "DSCF5566", "DSCF5568"],
    },
    {
      id: "dusk-and-lanterns",
      name: "The stage at dusk, lanterns in the halls",
      photos: [
        "DSCF5613", "DSCF5607", "DSCF5609", "DSCF5601", "DSCF5617", "DSCF5618", "DSCF5600",
        "DSCF5611", "DSCF5616",
      ],
    },
  ],
  notes: {
    DSCF5528: "3★, the hillside's colours with the Koyasu pagoda small in them: rests the run of stage views.",
    DSCF5563: "3★, the walk up under the red maples: closes the chapter on the way in.",
    DSCF5600: "Pulled from the held pile: the floorboards lead to the eave and the tower, cleaner than DSCF5599.",
  },
  parked: [
    { photo: "DSCF5513", note: "Gate within gate, lower and cleaner, without the gilded ceiling: a toss-up with DSCF5510." },
    { photo: "DSCF5514", note: "The west gate's eave in landscape, a phone and hand at the corner: DSCF5515's other orientation." },
    { photo: "DSCF5586", note: "The cedar window, brighter and with the city; a railing across the bottom. Cropped, it could take DSCF5549's place." },
    { photo: "DSCF5599", note: "From the stage at dusk with the crowd: DSCF5600 is cleaner." },
    { photo: "DSCF5608", note: "The amulet counter lit at night: a toss-up with DSCF5611." },
    { photo: "DSCF5565", note: "The long stair under the trees, schoolchildren at the top: for an \"Around Kiyomizu-dera\" set." },
    { photo: "DSCF5557", note: "The Koyasu pagoda close, a fence across its base: for an \"Around Kiyomizu-dera\" set." },
    { photo: "DSCF5541", note: "The classic view as a square crop in daylight: the dusk frames do it better." },
    { photo: "DSCF5520", note: "The city and Kyoto Tower over a red maple, flat sky and a lamp post." },
    { photo: "DSCF5604", note: "One lantern in the dark: DSCF5607 has the lantern with a person under it." },
  ],
  dropped: [
    { what: "DSCF5533", note: "The roofs down to the pagoda in daylight, my 4★: 3★ here, as DSCF5613 is the same view at dusk." },
    { what: "DSCF5544", note: "The classic view with the bare tree across the hall, my 4★: 3★ here, beaten by DSCF5587 and DSCF5588." },
  ],
};
