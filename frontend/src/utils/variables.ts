// List of variables available in data, this is not supposed to be modified
export const listVariables = [
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

export const listVariablesDemand = [
  { id: "Fuss", name: "A pied" },
  { id: "Velo", name: "A vélo" },
  { id: "Auto", name: "En voiture" },
  { id: "OeV", name: "En transport publics" },
  { id: "All_modes", name: "Tous" },
];

export const listYears: number[] = [2017, 2050];

export const listDistances: number[] = [1300, 3800, 7000];

export type DemandVariable = {
  id: string;
  name: string;
  selected: boolean;
};

export type SupplyVariable = {
  id: string;
  name: string;
  weight: number;
  diversity: number;
  selected: boolean;
};

export type TileParams = {
  name: string;
  url: string;
  minzoom?: number;
  maxzoom?: number;
};

export const listTilesParams: TileParams[] = [
  {
    name: "demand_h3_2",
    url: "https://enacit4r-tiles.epfl.ch/demand_h3_2",
  },
  {
    name: "demand_polygon_2",
    url: "https://enacit4r-tiles.epfl.ch/demand_polygon_2",
  },

  {
    name: "supply_h3_2",
    url: "https://enacit4r-tiles.epfl.ch/supply_h3_2",
  },
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

export const listVariablesSupply = [
  {
    name: "Guichets",
    id: "Public",
    tags: ["community_centre", "police", "post_box", "post_office", "bank"],
    infos: ["Postes", "banques", "police", "…"],
  },
  {
    name: "Se soigner",
    id: "Care",
    tags: [
      "nursing_home",
      "pharmacy",
      "hospital",
      "clinic",
      "doctors",
      "dentist",
      "optician",
      "hairdresser",
      "beauty",
    ],
    infos: [
      "Pharmacies",
      "hôpitaux",
      "dentistes",
      "opticiens",
      "coiffeurs",
      "beauté",
      "…",
    ],
  },
  {
    name: "Se cultiver",
    id: "Culture",
    tags: [
      "arts_centre",
      "library",
      "theatre",
      "nightclub",
      "cinema",
      "museum",
      "events_venue",
      "religion",
    ],
    infos: ["Bibliothèques", "théâtres", "cinémas", "lieux de culte", "…"],
  },
  {
    name: "S’aérer",
    id: "Outdoor",
    tags: [
      "park",
      "playground",
      "square",
      "landuse_recreation_ground",
      "water",
      "fountain",
      "riverbank",
      "river",
    ],
    infos: ["Parcs", "places", "fontaines", "rives", "…"],
  },
  {
    name: "Bien manger",
    id: "Catering",
    tags: [
      "restaurant",
      "fast_food",
      "cafe",
      "pub",
      "bar",
      "food_court",
      "biergarten",
    ],
    infos: ["Restaurants", "cafés", "pubs", "…"],
  },
  {
    name: "Faire du sport",
    id: "Sport",
    tags: [
      "sports_centre",
      "pitch",
      "swimming_pool",
      "swimming",
      "water_park",
      "fitness_centre",
      "ice_rink",
      "tennis",
      "golf_course",
      "stadium",
    ],
    infos: ["Piscines", "fitness", "stades", "patinoires", "tennis", "…"],
  },
  {
    name: "Faire ses courses",
    id: "Provision",
    tags: [
      "marketplace",
      "supermarket",
      "bakery",
      "general",
      "butcher",
      "greengrocery",
    ],
    infos: ["Super-marchés", "boulangeries", "marchés", "…"],
  },
  {
    name: "Faire les magasins",
    id: "Shopping",
    tags: [
      "kiosk",
      "mall",
      "department_store",
      "convenience",
      "clothes",
      "florist",
      "chemist",
      "books",
      "shoes",
      "furniture",
    ],
    infos: ["Kiosks", "fleuristes", "librairies", "bricolage", "…"],
  },
  {
    name: "Apprendre",
    id: "Education",
    tags: ["university", "school", "college", "kindergarten"],
    infos: ["Ecoles primaires", "secondaires", "universités", "garderies", "…"],
  },
  {
    name: "Transports publics",
    id: "Transport",
    tags: ["bus_station", "taxi", "railway", "tram_stop", "bus_stop"],
    infos: ["Gares", "arrêts de bus et tram", "zone taxi", "…"],
  },
];

export type MapType = "demand" | "supply";
export type TilingType = "h3" | "polygon";

// Transforms underscores "_" and dashes "-" to spaces and capitalizes the first letter
export function cleanVariableString(name: string) {
  const str = name.replace(/(-|_|\.)/g, " ").trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// export const getVariableGroup = (variable: ProximityVariable) =>
//   variable.name.split("_")[0];

// export const getVariableNameWithoutGroup = (variable: ProximityVariable) =>
//   variable.name.split("_").slice(1).join(" ");
