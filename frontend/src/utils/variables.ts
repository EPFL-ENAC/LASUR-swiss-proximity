// List of variables available in data, this is not supposed to be modified
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

export type ProximityVariable = {
  name: string;
  weight: number;
  selected: boolean;
};
export type TileParams = {
  name: string;
  url: string;
  minzoom: number;
  maxzoom: number;
};

export const listTilesParams: TileParams[] = [
  {
    name: "Hexagons h3",
    url: "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2022-11-29/h3/{z}/{x}/{y}.pbf",
    minzoom: 0,
    maxzoom: 11,
  },
  {
    name: "Polygons agglomération",
    url: "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2022-11-29/trafic/{z}/{x}/{y}.pbf",
    minzoom: 0,
    maxzoom: 9,
  },
];

// Transforms underscores "_" and dashes "-" to spaces and capitalizes the first letter
export function cleanVariableString(name: string) {
  const str = name.replace(/(-|_|\.)/g, " ").trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getVariableGroup = (variable: ProximityVariable) =>
  variable.name.split("_")[0];

export const getVariableNameWithoutGroup = (variable: ProximityVariable) =>
  variable.name.split("_").slice(1).join(" ");
