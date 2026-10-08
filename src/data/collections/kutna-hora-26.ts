import type { PlaceCollection } from "./types";

// Approved 2026-10-08 (editorial/passes/v2/kutna-hora-26.md). One day, 4 Jul, a day trip
// from Prague under bright overcast. In the order of the day: St Barbara's outside and in,
// the old town and the Italian Court as one walk, and Sedlec's cathedral from inside.
export const kutnaHora26: PlaceCollection = {
  id: "kutna-hora-26",
  name: "Kutná Hora",
  trip: "Czechia · Summer 2026",
  source: "Czechia 26/selects/Kutna Hora",
  chapters: [
    {
      id: "st-barbaras",
      name: "St Barbara's",
      photos: ["DSCF6977", "DSCF7034", "DSCF6987", "DSCF6985", "DSCF6995", "DSCF7031", "DSCF7026"],
    },
    {
      id: "inside-st-barbaras",
      name: "Inside St Barbara's",
      photos: ["DSCF7009", "DSCF7016", "DSCF7005", "DSCF7014", "DSCF7015", "DSCF7017", "DSCF7018", "DSCF7019"],
    },
    {
      id: "the-old-town",
      name: "The old town",
      photos: ["DSCF6997", "DSCF7051", "DSCF7062", "DSCF7079", "DSCF7068", "DSCF7081", "DSCF7085", "DSCF7090", "DSCF7076"],
    },
    {
      id: "sedlec",
      name: "Sedlec",
      photos: ["DSCF7116", "DSCF7124", "DSCF7118", "DSCF7122", "DSCF7126"],
    },
  ],
  notes: {
    DSCF7034: "Posted, and lost to DSCF6992 in the cull; copied back from raw/ and the better frame.",
    DSCF6997: "My pick over DSCF7045 (the same view of St James, parked).",
    DSCF7076: "Out of time order: St Barbara through the gate closes the walk, looking back to where the day began.",
    DSCF7118: "A toss-up with DSCF7120, its black-and-white (parked); colour, because the yellow is Sedlec.",
    DSCF7017: "A toss-up with DSCF7000, the apse vault square-on (parked).",
  },
  parked: [
    { photo: "DSCF7000", note: "The apse vault square-on with the glass (4★): the toss-up with DSCF7017." },
    { photo: "DSCF7120", note: "Sedlec's arches in black-and-white (4★): the toss-up with DSCF7118." },
    { photo: "DSCF7110", note: "Sedlec from the side, red roofs on a diagonal: the better exterior; the chapter stays inside." },
    { photo: "DSCF7045", note: "St James over the vineyard; DSCF6997 has the same subject, framed by trees." },
    { photo: "DSCF7012", note: "The buttress edge over the green valley, from the gallery." },
    { photo: "DSCF7094", note: "The open valley view to St Barbara and the college, blue sky." },
    { photo: "DSCF6967", note: "The St Wenceslas house with a lamp in silhouette; a traffic mirror in the middle." },
    { photo: "DSCF7105", note: "St James's tower against cirrus." },
    { photo: "DSCF7125", note: "Sedlec's fresco in its ribbed frame." },
  ],
  dropped: [
    { what: "DSCF7002, DSCF7004", note: "Posted, but DSCF7018 (the organ, wider, no hanging lamp) and DSCF7005 (the window throwing its colour) are better." },
    { what: "DSCF6984, DSCF6990, DSCF6992", note: "Twins: DSCF6985 is the black-and-white of 6984; DSCF7034 beats both west fronts." },
    { what: "DSCF6973", note: "The morning lane: too much dead space without a tighter crop." },
    { what: "DSCF7054", note: "The Stone Fountain: a documentary shot, 2★." },
    { what: "DSCF7101, DSCF7102", note: "The heraldic windows: 7101 is crooked, and the concept sits apart from the set." },
    { what: "DSCF7112", note: "Sedlec's west front: not an opener, and DSCF7110 is the better exterior." },
    { what: "DSCF7050, DSCF7086, DSCF7099", note: "On the site before: a lane with cars, a plain courtyard corner, the hydrangeas without the bench." },
  ],
};
