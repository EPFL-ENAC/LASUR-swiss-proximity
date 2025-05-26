export const listVariablesDemand = [
  { id: "Fuss", name: "À pied" },
  { id: "Velo", name: "À vélo" },
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
  infos: string[];
};

export type TileParams = {
  name: string;
  url: string;
  minzoom?: number;
  maxzoom?: number;
};

export const listTilesParams: TileParams[] = [
  {
    name: "demand_h3",
    url: "pmtiles://https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/output/demand_h3.pmtiles",
  },
  {
    name: "demand_polygon",
    url: "pmtiles://https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/output/demand_polygon.pmtiles",
  },

  {
    name: "supply_h3",
    url: "pmtiles://https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/output/supply_h3.pmtiles",
  },
  {
    name: "supply_polygon",
    url: "pmtiles://https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/output/supply_polygon.pmtiles",
  },
];

export const supplyColors = [
  { label: "15’ (marche)", distance: "1200m", color: "#005A32", category: "A" },
  { label: "20’ (marche)", distance: "1600m", color: "#238443", category: "B" },
  { label: "30’ (marche)", distance: "2400m", color: "#41AB5D", category: "C" },
  {
    label: "15’ (vélo)",
    distance: "3700m",
    color: "#78C679",
    category: "D",
  },
  {
    label: "20’ (vélo)",
    distance: "5000m",
    color: "#ADDD8E",
    category: "E",
  },
  {
    label: "30’ (vélo)",
    distance: "7000m",
    color: "#D9F0A3",
    category: "F",
  },
  {
    label: "> 30’ (vélo)",
    distance: "> 7000m",
    color: "#FFFFCC",
    category: "G",
  },
];

export const demandColors = [
  { label: "0 (No fill)", color: "#FFFFFF", category: "G" },
  { label: "Quantile 1/6", color: "#D9F0A3", category: "F" },
  { label: "Quantile 2/6", color: "#ADDD8E", category: "E" },
  { label: "Quantile 3/6", color: "#78C679", category: "D" },
  { label: "Quantile 4/6", color: "#41AB5D", category: "C" },
  { label: "Quantile 5/6", color: "#238443", category: "B" },
  { label: "Quantile 6/6", color: "#005A32", category: "A" },
];

export const listVariablesSupply = [
  {
    name: "Tout",
    id: "All",
    tags: [],
    infos: [],
  },
  {
    name: "Apprendre",
    id: "Education",
    tags: ["university", "school", "college", "kindergarten"],
    infos: ["Ecoles primaires", "secondaires", "universités", "garderies", "…"],
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
    name: "Guichets",
    id: "Public",
    tags: ["community_centre", "police", "post_box", "post_office", "bank"],
    infos: ["Postes", "banques", "police", "…"],
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
