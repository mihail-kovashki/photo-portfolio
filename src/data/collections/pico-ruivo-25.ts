import type { PlaceCollection } from "./types";

// Approved 2026-10-02 (editorial/passes/v2/madeira-25.md). One evening, 27 Apr, as the light changes: the
// story wins. The white trees open with a white tree. Two 5★: 0033 and 0049.
export const picoRuivo25: PlaceCollection = {
  id: "pico-ruivo-25",
  name: "Pico Ruivo",
  trip: "Madeira · Spring 2025",
  source: "Madeira 2025",
  chapters: [
    {
      id: "the-white-trees",
      name: "The white trees",
      photos: ["DSCF9968", "DSCF9963", "DSCF9921", "DSCF9979", "DSCF9976"],
    },
    {
      id: "above-the-clouds",
      name: "Above the clouds",
      photos: ["DSCF9998", "DSCF9987", "DSCF0024", "DSCF0008", "DSCF0009"],
    },
    {
      id: "sunset-over-the-cloud-sea",
      name: "Sunset over the cloud sea",
      photos: ["DSCF0023", "DSCF0031", "DSCF0033", "DSCF0045", "DSCF0047", "DSCF0049"],
    },
    {
      id: "the-walk-down",
      name: "The walk down",
      photos: ["DSCF0059", "DSCF0065", "DSCF0067", "DSCF0076", "DSCF0082"],
    },
  ],
  parked: [
    { photo: "DSCF0037", note: "The third of the dusk cloud-island frames; 0047 and 0049 carry it." },
    { photo: "DSCF9980", note: "Posted, but the purple flare reads as a flaw on the page." },
    { photo: "DSCF9994", note: "Tents on the summit col over the cloud sea." },
    { photo: "DSCF0001", note: "Light rays over the ridges; a green flare blob." },
  ],
  dropped: [
    { what: "DSCF0071", note: "Soft in the low light." },
  ],
};
