import type { PlaceCollection } from "./types";

// Approved 2026-11-05 (editorial/passes/v2/beijing-25-additions.md, "After my review"). One
// clear afternoon, 1 Nov: the Long Corridor and the gardens, up Longevity Hill to the Tower of
// Buddhist Incense, down to the lakeshore and the Marble Boat, then the late sun on the
// Seventeen-Arch Bridge. The hill opens, since the Tower is where the place is; the gardens,
// first by time and the weakest, close. Photos in a chapter go strongest first.
export const summerPalace25: PlaceCollection = {
  id: "summer-palace-25",
  name: "Summer Palace",
  trip: "Beijing · Autumn 2025",
  source: "Beijing 25",
  chapters: [
    {
      id: "longevity-hill",
      name: "Longevity Hill and the Tower",
      photos: [
        "DSCF4334", "DSCF4320", "DSCF4307", "DSCF4304", "DSCF4315", "DSCF4276", "DSCF4318",
        "DSCF4321", "DSCF4313", "DSCF4274", "DSCF4309", "DSCF4329",
      ],
    },
    {
      id: "seventeen-arch-bridge",
      name: "Late sun and the Seventeen-Arch Bridge",
      photos: [
        "DSCF4444", "DSCF4416", "DSCF4432", "DSCF4420", "DSCF4450", "DSCF4454", "DSCF4414",
      ],
    },
    {
      id: "lakeshore-and-marble-boat",
      name: "The lakeshore and the Marble Boat",
      photos: [
        "DSCF4370", "DSCF4399", "DSCF4397", "DSCF4386", "DSCF4345", "DSCF4378", "DSCF4349",
        "DSCF4367", "DSCF4405",
      ],
    },
    {
      id: "long-corridor-and-gardens",
      name: "The Long Corridor and the gardens",
      photos: [
        "DSCF4280", "DSCF4236", "DSCF4261", "DSCF4245", "DSCF4233", "DSCF4254", "DSCF4257",
        "DSCF4248",
      ],
    },
  ],
  notes: {
    DSCF4274: "2★ in the close look, on the page as my pick: the Tower small above the trees and the sunlit lawn. It took DSCF4277's place.",
    DSCF4378: "4★ in the close look, 3★ at review.",
    DSCF4315: "Pulled from the held pile: the view west without the heads at the bottom of DSCF4314.",
    DSCF4313: "3★, the lone cloud over the lake: a quiet frame that rests the hill's sequence.",
  },
  parked: [
    { photo: "DSCF4336", note: "The Tower between the eave and the gable in portrait: a toss-up with DSCF4334." },
    { photo: "DSCF4441", note: "The bridge's gold arches in portrait: a toss-up with DSCF4444." },
    { photo: "DSCF4369", note: "The Marble Boat facing a dragon boat across the water: its own idea, a repeat beside DSCF4370." },
    { photo: "DSCF4277", note: "The Tower between two cypresses over the red wall: DSCF4274 took its place." },
    { photo: "DSCF4314", note: "The view west in portrait, heads at the bottom: DSCF4315 took the place." },
    { photo: "DSCF4262", note: "The yellow chrysanthemum against red lacquer: soft at 100%." },
    { photo: "DSCF4361", note: "The Marble Boat behind the carved finial: the finial, the frame's near subject, is soft." },
    { photo: "DSCF4265", note: "A woman posing by the chrysanthemums: a stranger's face as the subject." },
    { photo: "DSCF4458", note: "The orange maple over the lake, a crowd's heads below and a stranger posing." },
    { photo: "DSCF4281", note: "The corridor's ceiling in portrait: the other orientation of DSCF4280." },
    { photo: "DSCF4310", note: "The lake through the window grille, sharp bars: a variation of DSCF4309." },
  ],
  dropped: [
    { what: "DSCF4226", note: "The Wenchang tower behind moored boats and their grey canopy: 2★ in the close look." },
  ],
};
