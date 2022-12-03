export const listPossibleVariables = [
  "bike_barsresaurants",
  "bike_health",
  "bike_posts",
  "bike_schools",
  "bike_transit",
  "transit_barsresaurants",
  "transit_health",
  "transit_posts",
  "transit_schools",
  "transit_transit",
  "walk_barsresaurants",
  "walk_health",
  "walk_posts",
  "walk_schools",
  "walk_transit",
];

export const tilesUrls = [
  {
    name: "Hexagons h3",
    url: "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2022-11-29/h3/{z}/{x}/{y}.pbf",
  },
  {
    name: "Polygons agglomération",
    url: "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2022-11-29/trafic/{z}/{x}/{y}.pbf",
  },
];

export function cleanVariableString(name: string) {
  const str = name.replace(/(-|_|\.)/g, " ").trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
}
