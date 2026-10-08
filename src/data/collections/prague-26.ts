import type { PlaceCollection } from "./types";

// Approved 2026-10-08 (editorial/passes/v2/prague-26.md). Five days, 2–8 Jul (not 4 or 7).
// By district rather than by day, walking downhill: the Castle and Hradčany, Malá Strana and
// its gardens, the river from day to night, the Old Town, then out east to Vinohrady.
export const prague26: PlaceCollection = {
  id: "prague-26",
  name: "Prague",
  trip: "Czechia · Summer 2026",
  source: "Czechia 26/selects/Prague",
  chapters: [
    {
      id: "the-castle-and-hradcany",
      name: "The Castle and Hradčany",
      photos: [
        "DSCF6688", "DSCF6659", "DSCF6585", "DSCF6654", "DSCF6649", "DSCF6704", "DSCF6674",
        "DSCF6683", "DSCF6598", "DSCF6733", "DSCF6568", "DSCF6811", "DSCF7665", "DSCF7666",
      ],
    },
    {
      id: "mala-strana",
      name: "Malá Strana",
      photos: ["DSCF7393", "DSCF7392", "DSCF6853", "DSCF6851", "DSCF6832", "DSCF6962"],
    },
    {
      id: "the-gardens",
      name: "Wallenstein and Vrtba gardens",
      photos: ["DSCF6782", "DSCF6788", "DSCF6791", "DSCF7360", "DSCF7361", "DSCF7370", "DSCF7366"],
    },
    {
      id: "on-the-vltava",
      name: "On the Vltava",
      photos: [
        "DSCF7436", "DSCF6844", "DSCF6846", "DSCF7226", "DSCF6942", "DSCF6927", "DSCF6949",
        "DSCF7258", "DSCF7253",
      ],
    },
    {
      id: "the-old-town",
      name: "The Old Town",
      photos: [
        "DSCF7129", "DSCF7134", "DSCF7156", "DSCF7159", "DSCF6874", "DSCF6885", "DSCF6888",
        "DSCF7266", "DSCF7283",
      ],
    },
    {
      id: "vinohrady-and-zizkov",
      name: "Vinohrady and Žižkov",
      photos: [
        "DSCF6343", "DSCF6345", "DSCF6430", "DSCF6422", "DSCF6442", "DSCF6456", "DSCF6509",
        "DSCF6528", "DSCF6545",
      ],
    },
  ],
  notes: {
    DSCF7665: "My pick over DSCF7669 (the Theological Hall, parked): two halls is too much in a packed chapter.",
    DSCF7392: "My pick over DSCF7453 (the lamps lit, parked).",
    DSCF6788: "From the first look's reserve, in place of DSCF6773 (the boy and the peacock, 3★).",
    DSCF6509: "My pick over DSCF6506 (the row of gold facades, parked).",
    DSCF6343: "My pick (3★): the first frame of the walk; the vans and street furniture are the cost.",
    DSCF6927: "The one ICM frame of the bridge run (DSCF6921–6945, DSCF7296–7297).",
    DSCF6962: "A slight motion streak at 100%; sharp at display size.",
    DSCF7226: "Sensor dust in the sky left of the bridge tower: on the edit queue.",
  },
  parked: [
    { photo: "DSCF7669", note: "Strahov's Theological Hall: the toss-up with DSCF7665." },
    { photo: "DSCF6682", note: "The Castle's third courtyard straight down from the tower." },
    { photo: "DSCF6906", note: "The Castle lit at blue hour under a pink sky: DSCF6942 took the place." },
    { photo: "DSCF7248", note: "The Castle and the lit bridge, wider: DSCF7253 is the same view at its peak." },
    { photo: "DSCF6908", note: "The Old Town embankment at blue hour; DSCF6949 is it at night." },
    { photo: "DSCF7453", note: "Čertovka with the lamps lit: DSCF7392 is the better take." },
    { photo: "DSCF7401", note: "The narrowest lane, a family coming down under the lamp: its frame if the lane comes back." },
    { photo: "DSCF6773", note: "The boy and the white peacock in Wallenstein Garden (3★)." },
    { photo: "DSCF6506", note: "The row of turreted facades going amber: DSCF6509 took the place." },
    { photo: "DSCF7353", note: "The hydrangea arch in Vrtba, on the site before: soft throughout at 100%." },
    { photo: "DSCF7233", note: "A tram rounding the National Theatre at dusk." },
    { photo: "DSCF7222", note: "The proposal heart on the embankment, nobody there yet." },
    { photo: "DSCF6823", note: "The Castle steps at 19:40, empty: DSCF6733 at noon took the place." },
  ],
  dropped: [
    { what: "DSCF6897", note: "The tram through the arch in Malá Strana: a failed photo; the blur has no shape." },
    { what: "DSCF7400", note: "The narrowest lane's green man: a fun concept, not a good enough photo." },
    { what: "DSCF6535, DSCF6546, DSCF7179, DSCF7296, DSCF7234, DSCF6453", note: "The reader under the tree, the National Museum behind the magistrála, the Coca-Cola pickup, the olive ICM, the second tram blur, the cemetery in colour." },
    { what: "DSCF6367, DSCF6484, DSCF6500, DSCF6541, DSCF6586, DSCF6595, DSCF6635, DSCF6637, DSCF6670, DSCF6697, DSCF6706, DSCF6734, DSCF6741, DSCF6751, DSCF6771, DSCF6801, DSCF6882, DSCF6959, DSCF7133, DSCF7154, DSCF7189, DSCF7199, DSCF7201, DSCF7208, DSCF7221, DSCF7245, DSCF7268, DSCF7275, DSCF7311, DSCF7324, DSCF7355, DSCF7428, DSCF7431, DSCF7661, DSCF7668", note: "On the site before the pass: replaced by a better frame of the same thing, or records rather than photos (prague-26.md, 'Compared with the site')." },
  ],
};
