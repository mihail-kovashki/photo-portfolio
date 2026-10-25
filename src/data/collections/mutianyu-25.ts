import type { PlaceCollection } from "./types";

// Approved 2026-10-25 (editorial/passes/v2/beijing-25.md, "After my review"). The Great
// Wall at Mutianyu on 31 Oct 2025, one clear afternoon with haze in the valleys: up by
// chairlift, along the ridges, down by gondola. The scenes repeat along the walk, so the
// chapters go by what they show, the strongest first; the gondola down closes the page.
export const mutianyu25: PlaceCollection = {
  id: "mutianyu-25",
  name: "Mutianyu",
  trip: "Beijing · Autumn 2025",
  source: "Beijing 25",
  chapters: [
    {
      id: "ridges-in-the-haze",
      name: "Ridges in the haze",
      photos: [
        "DSCF4002", "DSCF4085", "DSCF3980", "DSCF3986", "DSCF3992", "DSCF3982", "DSCF4108",
      ],
    },
    {
      id: "the-curve-round-the-hill",
      name: "The curve round the hill",
      photos: [
        "DSCF3970", "DSCF4066", "DSCF4038", "DSCF4059", "DSCF4070",
      ],
    },
    {
      id: "the-first-towers",
      name: "The first towers",
      photos: [
        "DSCF3941", "DSCF3946", "DSCF3914", "DSCF3926", "DSCF3910",
      ],
    },
    {
      id: "along-the-walkway",
      name: "Along the walkway and in the towers",
      photos: [
        "DSCF4076", "DSCF4095", "DSCF4091", "DSCF4003", "DSCF4094", "DSCF4025", "DSCF4093",
        "DSCF3952-2", "DSCF3945", "DSCF4049", "DSCF4107",
      ],
    },
    {
      id: "rays-and-the-way-down",
      name: "Rays over the ranges, and down",
      photos: [
        "DSCF4057", "DSCF4098", "DSCF4102", "DSCF4101", "DSCF4114",
      ],
    },
  ],
  notes: {
    DSCF4002: "The trip's 5★: the wall in a long S from two near towers up the ridge, five layers of haze behind.",
    DSCF3910: "3★, closes the first towers: the chairlift towards the wall on the ridge, how we got there.",
    DSCF4107: "3★ on role: the No Climbing Over sign framing the peak in a crenel, the chapter's wink.",
    DSCF4093: "A boy looking into the lens from inside a tower: a stranger's child, to check before it goes live.",
    DSCF4098: "A toss-up with DSCF4099, the same rays in portrait (parked).",
  },
  parked: [
    { photo: "DSCF4099", note: "The rays in portrait: a toss-up with DSCF4098." },
    { photo: "DSCF3940", note: "The view from the first towers in landscape: DSCF3941's other orientation." },
    { photo: "DSCF3999", note: "The long S in portrait: DSCF4002's other orientation." },
    { photo: "DSCF4061", note: "The curve round the hill in landscape, warm, with the crowd on the near wall." },
    { photo: "DSCF3936", note: "The sunlit parapet before the ridge: soft on the parapet at 100% (focus on the far slope)." },
    { photo: "DSCF4052", note: "The jagged peaks in side light over the autumn ridge: the clearest frame of the peaks." },
    { photo: "DSCF3996", note: "The valley in landscape with the helicopter: DSCF3992's partner." },
    { photo: "DSCF4054", note: "Along the parapet's coping to the far climb under clouds." },
    { photo: "DSCF4060", note: "The crowd climbing the curve: the day as it was." },
    { photo: "DSCF4080", note: "A stranger in blue posing on the walkway, arms up: her face is the subject." },
    { photo: "DSCF4097", note: "A tower window framing the ranges: DSCF4094 took the place." },
  ],
  dropped: [
    { what: "DSCF3917", note: "The cat asleep on the step: the subject carries it, the frame doesn't (2★ in the cull too)." },
    { what: "DSCF3976, DSCF4092, DSCF4100", note: "3★ in the cull, 2★ at size: wide views whose near half has nothing in it." },
  ],
};
