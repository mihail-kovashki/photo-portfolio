// The site's tag vocabulary: small and controlled, so a tag means the same thing on
// every trip. Each tag becomes a Themes page; the editorial pass applies them as
// Lightroom/XMP keywords `site/tag/<id>` (see editorial/README.md for the rules and
// for candidate tags that aren't in the list yet).

export type TagFacet = "subject" | "light";

export interface Tag {
  /** Stable id, also the keyword: site/tag/<id>. Renaming means a bulk keyword rewrite. */
  id: string;
  facet: TagFacet;
  /** Display name on the site. */
  name: string;
  /** One line for the tag's Themes page. */
  description: string;
  /** When to apply it. Written for whoever (or whatever) does the tagging. */
  appliesWhen: string;
  /** Where the 2026-09-30 survey saw it; a reference point, not a rule. */
  examples: string[];
}

export const tags: Tag[] = [
  // Subject: what's in the frame
  {
    id: "looking-up",
    facet: "subject",
    name: "Looking up",
    description: "Spires, towers, vaults and eaves, seen from below.",
    appliesWhen: "The camera points steeply upward and the view from below is the point of the frame.",
    examples: ["Prague vaults", "Kutná Hora", "Copenhagen spires", "Sapporo clock tower", "Seoul palace eaves"],
  },
  {
    id: "city-from-above",
    facet: "subject",
    name: "City from above",
    description: "Cities seen from towers, hills and mountains.",
    appliesWhen: "A city is seen from a height, looking down or across its rooftops.",
    examples: ["Prague rooftops", "Sapporo from the JR Tower", "Seoul from the mountain lookout", "Funchal"],
  },
  {
    id: "skyline",
    facet: "subject",
    name: "Skyline",
    description: "The outline of a city, usually across water.",
    appliesWhen: "A city's silhouette or outline at distance, roughly at eye level. Not every view from above is a skyline.",
    examples: ["Han River skyline", "Yeouido at sunset", "Sapporo", "Hanoi across Hoan Kiem"],
  },
  {
    id: "streets",
    facet: "subject",
    name: "Streets",
    description: "Lanes, old towns and street life at eye level.",
    appliesWhen: "A street, lane or square at eye level is the subject, with or without people.",
    examples: ["Malmö", "Funchal old town", "Prague", "Otaru", "Hanoi Old Quarter", "Seoul hanok lanes"],
  },
  {
    id: "interiors",
    facet: "subject",
    name: "Interiors",
    description: "Inside churches, libraries and temples.",
    appliesWhen: "The frame is taken inside a building and the interior is the subject.",
    examples: ["Prague churches", "Kutná Hora", "Malmö library", "Temple of Literature", "Hill of the Buddha"],
  },
  {
    id: "temples-and-shrines",
    facet: "subject",
    name: "Temples and shrines",
    description: "Buddhist temples, Shinto shrines and Confucian halls.",
    appliesWhen: "East Asian religious architecture is the subject, inside or out.",
    examples: ["Seoraksan temples", "Yeosu", "Hokkaido Jingu", "Temple of Literature"],
  },
  {
    id: "churches",
    facet: "subject",
    name: "Churches",
    description: "Churches and cathedrals, inside and out.",
    appliesWhen: "A church or cathedral is the subject, inside or out.",
    examples: ["Prague", "Kutná Hora", "Copenhagen", "St. Joseph's, Hanoi", "Funchal"],
  },
  {
    id: "palaces-and-castles",
    facet: "subject",
    name: "Palaces and castles",
    description: "Royal palaces and castles.",
    appliesWhen: "Palace or castle architecture is the subject.",
    examples: ["Gyeongbokgung and Deoksugung", "Prague Castle", "Český Krumlov", "Rosenborg"],
  },
  {
    id: "new-architecture",
    facet: "subject",
    name: "New architecture",
    description: "Modern buildings as the subject.",
    appliesWhen: "A modern building is the point of the frame, judged on form and light rather than fame.",
    examples: ["Malmö library and Turning Torso", "Copenhagen harbour", "Seoul museums", "Hill of the Buddha"],
  },
  {
    id: "waterfront",
    facet: "subject",
    name: "Waterfront",
    description: "Where a city meets its canals, rivers and lakes.",
    appliesWhen: "A city and water together: canals, riverbanks, lakeshores.",
    examples: ["Copenhagen canals", "Otaru canal", "Han River", "Hoan Kiem Lake", "Vltava"],
  },
  {
    id: "coast",
    facet: "subject",
    name: "Coast",
    description: "Sea, cliffs, beaches and islands.",
    appliesWhen: "The sea or the coastline is the subject.",
    examples: ["Madeira cliffs", "Shakotan", "Sokcho beach", "Yeosu", "Ha Long Bay"],
  },
  {
    id: "mountains",
    facet: "subject",
    name: "Mountains",
    description: "Peaks, ridges and karsts.",
    appliesWhen: "Mountains, ridges or karst formations are the subject, not just a backdrop.",
    examples: ["Seoraksan", "Pico do Arieiro", "Tokachi range", "Ninh Binh", "Ha Long Bay"],
  },
  {
    id: "flowers",
    facet: "subject",
    name: "Flowers",
    description: "Flowers as subject or foreground.",
    appliesWhen: "Flowers are the subject or a strong foreground layer.",
    examples: ["Biei and Furano fields", "Seoul zinnias", "Funchal jacaranda", "Hydrangeas", "Roses"],
  },
  {
    id: "forests-and-trees",
    facet: "subject",
    name: "Forests and trees",
    description: "Forest paths, lone trees and light through trees.",
    appliesWhen: "Woodland, a lone tree or light through trees is the subject. Grown, not designed (see parks-and-gardens).",
    examples: ["Fanal laurels", "Biei lone trees", "Hokkaido Jingu cedars"],
  },
  {
    id: "parks-and-gardens",
    facet: "subject",
    name: "Parks and gardens",
    description: "Designed green spaces in and around cities.",
    appliesWhen: "A designed green space is the subject: lawns, fountains, paths, formal beds. Designed, not grown.",
    examples: ["Slottsparken, Malmö", "Funchal gardens", "Deoksugung", "Odori Park", "Temple of Literature courtyards"],
  },
  {
    id: "people",
    facet: "subject",
    name: "People",
    description: "People as scale and story.",
    appliesWhen: "People give the frame its scale or story. Not portraits, and not people who just happen to be there.",
    examples: ["Madeira hikers", "Han River couples", "Pico sunrise silhouettes", "Ha Long rowers"],
  },

  // Light and weather
  {
    id: "golden-hour",
    facet: "light",
    name: "Golden hour",
    description: "Low, warm sun, including sunrises and sunsets.",
    appliesWhen: "Low warm sunlight shapes the frame, including the sun itself in frame.",
    examples: ["Han River", "Yeosu", "Ha Long Bay", "Pico do Arieiro", "Týn Church"],
  },
  {
    id: "blue-hour",
    facet: "light",
    name: "Blue hour",
    description: "Twilight, before sunrise and after sunset.",
    appliesWhen: "The twilight sky sets the mood: after sunset or before sunrise, before it's fully dark.",
    examples: ["Seoul flower field", "Yeosu bridge", "Charles Bridge", "Ninh Binh"],
  },
  {
    id: "night",
    facet: "light",
    name: "Night",
    description: "After dark: city lights, lanterns, lit streets.",
    appliesWhen: "Taken after dark; artificial light carries the frame.",
    examples: ["Hanoi", "Susukino, Sapporo", "Seoul hanok lanes", "Prague lanterns"],
  },
  {
    id: "mist-and-fog",
    facet: "light",
    name: "Mist and fog",
    description: "Cloud, fog and haze shaping the view.",
    appliesWhen: "Cloud, fog or haze is part of the picture, not just a grey sky.",
    examples: ["Sea of clouds at Pico do Arieiro", "Seoraksan", "Fanal", "Ha Long Bay"],
  },
  {
    id: "overcast",
    facet: "light",
    name: "Overcast",
    description: "Soft, flat light as a character of its own.",
    appliesWhen: "Flat, soft light is the character of the frame rather than a flaw.",
    examples: ["Otaru", "Hill of the Buddha in the rain", "Sokcho beach"],
  },
  {
    id: "autumn",
    facet: "light",
    name: "Autumn",
    description: "Autumn colour.",
    appliesWhen: "Seasonal colour is the point of the frame.",
    examples: ["Seoraksan maples", "Jozankei"],
  },
];

export function findTag(id: string): Tag | undefined {
  return tags.find((t) => t.id === id);
}
