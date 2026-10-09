import type { PlaceCollection } from "./types";

// Approved 2026-10-08 (editorial/passes/v2/prague-26.md); revised 2026-10-09 after the blind
// second run (prague-26.run2.md, "After my review"): a merge of both runs. Five days, 2–8 Jul
// (not 4 or 7). By district rather than by day, walking downhill: the Castle and Hradčany,
// Malá Strana and its gardens, the river from day to night, the Old Town, then out east to
// Vinohrady. Chapter ids are kept from the first version so links don't change.
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
        "DSCF6688", "DSCF6659", "DSCF6585", "DSCF6638", "DSCF6654", "DSCF6704", "DSCF6706",
        "DSCF6674", "DSCF6683", "DSCF6598", "DSCF6597", "DSCF6733", "DSCF6568", "DSCF6811",
        "DSCF7669",
      ],
    },
    {
      id: "mala-strana",
      name: "Malá Strana and Kampa",
      photos: [
        "DSCF7199", "DSCF7393", "DSCF6762", "DSCF6836", "DSCF6835", "DSCF6832", "DSCF6849",
        "DSCF6851", "DSCF6853", "DSCF6852", "DSCF6958", "DSCF6962",
      ],
    },
    {
      id: "the-gardens",
      name: "Wallenstein and Vrtba gardens",
      photos: ["DSCF6782", "DSCF6788", "DSCF6791", "DSCF7378", "DSCF7360", "DSCF7361", "DSCF7370"],
    },
    {
      id: "on-the-vltava",
      name: "On the Vltava",
      photos: [
        "DSCF7436", "DSCF7428", "DSCF6844", "DSCF7226", "DSCF6942", "DSCF6927", "DSCF6949",
        "DSCF7258", "DSCF7253",
      ],
    },
    {
      id: "the-old-town",
      name: "The Old Town",
      photos: [
        "DSCF7129", "DSCF7134", "DSCF7156", "DSCF7159", "DSCF6874", "DSCF6885", "DSCF6888",
        "DSCF6868", "DSCF7274", "DSCF7266", "DSCF7283",
      ],
    },
    {
      id: "vinohrady-and-zizkov",
      name: "Vinohrady and Žižkov",
      photos: [
        "DSCF6343", "DSCF6345", "DSCF6422", "DSCF6442", "DSCF6430", "DSCF6502", "DSCF6509",
        "DSCF6528", "DSCF6545",
      ],
    },
  ],
  notes: {
    DSCF6659: "The cover of my castle post (3★): a sight being photographed, which is what the chapter is about.",
    DSCF7669: "Over DSCF7665 (parked): the visitor in white pulls the eye out of 7665's room. One hall is enough.",
    DSCF7199: "My favourite of the Čertovka, lost in both runs' first looks as a twin of the portrait takes. DSCF7392 is its portrait take, parked.",
    DSCF6788: "From the first look's reserve, in place of DSCF6773 (the boy and the peacock, 3★).",
    DSCF6509: "My pick over DSCF6506 (the row of gold facades, parked).",
    DSCF6343: "My pick (3★): the first frame of the walk; the street furniture is playful to me.",
    DSCF6849: "3★ and on the page for the gold strokes of light on the cobbles.",
    DSCF6927: "The one ICM frame of the bridge run (DSCF6921–6945, DSCF7296–7297). A trip page can carry it.",
    DSCF6962: "Over DSCF6964 (the rails, parked): the tram itself, front on. A slight motion streak at 100%; sharp at display size.",
    DSCF7226: "Sensor dust in the sky left of the bridge tower and a 16:9 crop: on the edit queue.",
  },
  parked: [
    { photo: "DSCF7665", note: "Strahov's Philosophical Hall: the visitor in white in the corner; DSCF7669 took the place." },
    { photo: "DSCF7666", note: "Strahov's bark books: a detail, no room beside the hall." },
    { photo: "DSCF6649", note: "St Vitus's north transept and organ: DSCF6638 is the interior as one shape." },
    { photo: "DSCF6682", note: "The Castle's third courtyard straight down from the tower." },
    { photo: "DSCF6906", note: "The Castle lit at blue hour under a pink sky: DSCF6942 took the place." },
    { photo: "DSCF6944", note: "The lit Castle from the bridge, portrait: DSCF6942 is the better take." },
    { photo: "DSCF6925", note: "The lit Castle from the bridge, earlier: repeats DSCF6942." },
    { photo: "DSCF7248", note: "The Castle and the lit bridge, wider: DSCF7253 is the same view at its peak." },
    { photo: "DSCF6908", note: "The Old Town embankment at blue hour; DSCF6949 is it at night." },
    { photo: "DSCF6915", note: "The embankment at blue hour, wider: DSCF6949 is the view at its best; better cropped to 16:9." },
    { photo: "DSCF6846", note: "The penguins on the river: the empty middle half holds it back; DSCF7428 took the place." },
    { photo: "DSCF7392", note: "The Čertovka in portrait: DSCF7199's other-orientation take." },
    { photo: "DSCF7453", note: "Čertovka with the lamps lit: DSCF7199 and DSCF7392 are the better takes." },
    { photo: "DSCF6964", note: "Tram 22 at night with the rails sweeping in: DSCF6962 is the tram frame." },
    { photo: "DSCF7401", note: "The narrowest lane, a family coming down under the lamp: its frame if the lane comes back." },
    { photo: "DSCF6773", note: "The boy and the white peacock in Wallenstein Garden (3★)." },
    { photo: "DSCF7366", note: "Malá Strana's roofs from Vrtba under grey: DSCF7370 closes the gardens." },
    { photo: "DSCF7368", note: "Vrtba's tiled terrace on a diagonal to the city." },
    { photo: "DSCF6871", note: "St Giles's tower at the end of a dark street in the last sun." },
    { photo: "DSCF7133", note: "The Old Town's roofs from the tower: DSCF7129 opens the chapter." },
    { photo: "DSCF7282", note: "A terrace at night, warm lights: DSCF7283 closes the night." },
    { photo: "DSCF6506", note: "The row of turreted facades going amber: DSCF6509 took the place." },
    { photo: "DSCF6511", note: "The sunset walker with the lamp post dead centre, handled well: DSCF6528 and DSCF6545 close the evening." },
    { photo: "DSCF6456", note: "The Žižkov cemetery in black and white: the tarmac strip at the bottom; a tighter crop could bring it back." },
    { photo: "DSCF7353", note: "The hydrangea arch in Vrtba, on the site before: soft throughout at 100%." },
    { photo: "DSCF7233", note: "A tram rounding the National Theatre at dusk." },
    { photo: "DSCF7222", note: "The proposal heart on the embankment, nobody there yet." },
    { photo: "DSCF6823", note: "The Castle steps at 19:40, empty: DSCF6733 at noon took the place." },
  ],
  dropped: [
    { what: "DSCF6897", note: "The tram through the arch in Malá Strana: a failed photo; the blur has no shape." },
    { what: "DSCF7400", note: "The narrowest lane's green man: a fun concept, not a good enough photo." },
    { what: "DSCF6535, DSCF6546, DSCF7179, DSCF7296, DSCF7234, DSCF6453", note: "The reader under the tree, the National Museum behind the magistrála, the Coca-Cola pickup, the olive ICM, the second tram blur, the cemetery in colour." },
    { what: "DSCF6367, DSCF6484, DSCF6500, DSCF6541, DSCF6586, DSCF6595, DSCF6635, DSCF6637, DSCF6670, DSCF6697, DSCF6734, DSCF6741, DSCF6751, DSCF6771, DSCF6801, DSCF6882, DSCF6959, DSCF7154, DSCF7189, DSCF7201, DSCF7208, DSCF7221, DSCF7245, DSCF7268, DSCF7275, DSCF7311, DSCF7324, DSCF7355, DSCF7431, DSCF7661, DSCF7668", note: "On the site before the pass: replaced by a better frame of the same thing, or records rather than photos (prague-26.md, 'Compared with the site'). DSCF6706, DSCF7199 and DSCF7428 from this list came back in the second run; DSCF7133 is parked." },
  ],
};
