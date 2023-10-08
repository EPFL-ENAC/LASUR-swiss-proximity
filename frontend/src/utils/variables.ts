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

export const listPossibleVariablesDemand = [
  { id: "Fuss", name: "A pied" },
  { id: "Velo", name: "A vélo" },
  { id: "Auto", name: "En voiture" },
  { id: "OeV", name: "En transport publics" },
  { id: "All_modes", name: "Tous" },
];

export const listYears: number[] = [2017, 2050];

export const listDistances: number[] = [1300, 3800, 7000];

export type ProximityVariable = {
  id: string;
  name: string;
  weight: number;
  selected: boolean;
};
export type TileParams = {
  name: string;
  url: string;
  minzoom?: number;
  maxzoom?: number;
};

export const listTilesParams: TileParams[] = [
  // {
  //   name: "demand_h3",
  //   url: "https://enacit4r-tiles.epfl.ch/demand_h3",
  // },
  // {
  //   name: "demand_polygon",
  //   url: "https://enacit4r-tiles.epfl.ch/demand_polygon",
  // },
  {
    name: "demand_h3_2",
    url: "https://enacit4r-tiles.epfl.ch/demand_h3_2",
  },
  {
    name: "demand_polygon_2",
    url: "https://enacit4r-tiles.epfl.ch/demand_polygon_2",
  },
  // {
  //   name: "supply_h3",
  //   url: "https://enacit4r-tiles.epfl.ch/supply_h3",
  // },
  {
    name: "supply_h3_2",
    url: "https://enacit4r-tiles.epfl.ch/supply_h3_2",
  },
  // {
  //   name: "supply_polygon",
  //   url: "https://enacit4r-tiles.epfl.ch/supply_polygon",
  // },
  {
    name: "supply_polygon_2",
    url: "https://enacit4r-tiles.epfl.ch/supply_polygon_2",
  },
];

export const demandColors = [
  { label: "15’ (walk)", distance: "1200m", color: "#005A32", category: "A" },
  { label: "20’ (walk)", distance: "1600m", color: "#238443", category: "B" },
  { label: "30’ (walk)", distance: "2400m", color: "#41AB5D", category: "C" },
  {
    label: "15’ (bicycle)",
    distance: "3700m",
    color: "#78C679",
    category: "D",
  },
  {
    label: "20’ (bicycle)",
    distance: "5000m",
    color: "#ADDD8E",
    category: "E",
  },
  {
    label: "30’ (bicycle)",
    distance: "7000m",
    color: "#D9F0A3",
    category: "F",
  },
  {
    label: "> 30’ (bicycle)",
    distance: "> 7000m",
    color: "#FFFFCC",
    category: "G",
  },
];

export const proximityTripColors = [
  { label: "0 (No fill)", color: "#FFFFCC", category: "G" },
  { label: "Quantile 1/6", color: "#D9F0A3", category: "F" },
  { label: "Quantile 2/6", color: "#ADDD8E", category: "E" },
  { label: "Quantile 3/6", color: "#78C679", category: "D" },
  { label: "Quantile 4/6", color: "#41AB5D", category: "C" },
  { label: "Quantile 5/6", color: "#238443", category: "B" },
  { label: "Quantile 6/6", color: "#005A32", category: "A" },
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
