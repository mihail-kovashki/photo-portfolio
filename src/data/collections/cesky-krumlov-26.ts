import type { PlaceCollection } from "./types";

// Approved 2026-10-08 (editorial/passes/v2/cesky-krumlov-26.md). One day, 7 Jul, broken
// cloud most of it. By place rather than by hour, since the views and the castle were each
// shot at several times of day: the town from above, the streets, the castle, the river.
export const ceskyKrumlov26: PlaceCollection = {
  id: "cesky-krumlov-26",
  name: "Český Krumlov",
  trip: "Czechia · Summer 2026",
  source: "Czechia 26/selects/Cesky Krumlov",
  chapters: [
    {
      id: "over-the-river-bend",
      name: "Over the river bend",
      photos: ["DSCF7542", "DSCF7605", "DSCF7498", "DSCF7533", "DSCF7523", "DSCF7528", "DSCF7603"],
    },
    {
      id: "the-old-town",
      name: "The old town",
      photos: ["DSCF7469", "DSCF7473", "DSCF7490", "DSCF7584", "DSCF7586", "DSCF7587", "DSCF7567", "DSCF7562"],
    },
    {
      id: "the-castle",
      name: "The castle",
      photos: ["DSCF7526", "DSCF7579", "DSCF7609", "DSCF7537", "DSCF7511"],
    },
    {
      id: "on-the-vltava",
      name: "On the Vltava",
      photos: ["DSCF7595", "DSCF7578", "DSCF7576", "DSCF7589", "DSCF7593", "DSCF7598", "DSCF7602"],
    },
  ],
  notes: {
    DSCF7605: "My pick over DSCF7549 (the same view with more of the river bend, parked).",
    DSCF7579: "My pick: the cloak bridge in its street, over DSCF7554 from below (parked). Both 3★.",
    DSCF7584: "Rated 2★ from the sheet for the cloud shadow; at 1000px the better square, over DSCF7476.",
  },
  parked: [
    { photo: "DSCF7465", note: "The classic view from the viewpoint, on the site before; a lamp post runs through the town." },
    { photo: "DSCF7549", note: "The castle tower over the river bend and the town: the toss-up with DSCF7605." },
    { photo: "DSCF7554", note: "The cloak bridge's three tiers from below (3★): DSCF7579 took the place." },
    { photo: "DSCF7564", note: "The yellow lane to the tower: one tower lane too many next to DSCF7473." },
    { photo: "DSCF7613", note: "The courtyard fountain under the tower." },
    { photo: "DSCF7566", note: "St Jošt and the castle under storm cloud: DSCF7469 in other weather." },
    { photo: "DSCF7467", note: "The Hotel Mlýn's layers under the tower; the hotel's lettering across the middle." },
    { photo: "DSCF7604", note: "Roofs packed under St Vitus at 17:11, on the site before; DSCF7542 and DSCF7605 say more." },
    { photo: "DSCF7555", note: "The castle over the river with a green raft; DSCF7602 is the same view, warmer." },
    { photo: "DSCF7535", note: "The castle chapel, red carpet to the altar." },
    { photo: "DSCF7503", note: "The castle garden's avenue, a couple walking away." },
  ],
  dropped: [
    { what: "DSCF7476", note: "The square: documentary; DSCF7584 does it better." },
    { what: "DSCF7516, DSCF7514, DSCF7519, DSCF7540", note: "The theatre box, the stage machinery, the rock-cut passage, the golden carriage: interesting things, weak photos." },
    { what: "DSCF7492, DSCF7611, DSCF7529, DSCF7591, DSCF7468, DSCF7481, DSCF7488", note: "On the site before: the views repeat (DSCF7542, DSCF7605, DSCF7533 replace them), the canoeists aren't interesting, the street views are ordinary." },
    { what: "DSCF7568, DSCF7483", note: "Workshop Alley as a row of A-boards; the Coca-Cola umbrellas." },
  ],
};
