import { ExpressionSpecification } from "maplibre-gl";

export const mapColors = [
  "#1a9850",
  "#66bd63",
  "#a6d96a",
  "#d9ef8b",
  "#ffffbf",
  "#fee08b",
  "#fdae61",
  "#f46d43",
  "#d73027",
];

export const hexagonsResolutions = [6, 7, 8];

export const center = [-837, 9380];
export const scale = 61878;

export function expressionMean(
  attributes: string[]
): ExpressionSpecification | number {
  if (attributes.length == 0) return 0;
  const n = attributes.length;
  const values = attributes.map((attr: string) => ["to-number", ["get", attr]]);
  if (values.length == 1) return values[0] as ExpressionSpecification;
  const total = values.reduce(
    (acc, curr) => ["+", acc, curr] as (string | string[])[]
  );
  return ["/", total, n] as ExpressionSpecification;
}

export function stepsColors(min: number, max: number, colors: string[]) {
  const diff = max - min,
    n = colors.length - 1,
    step = ~~(diff / n);
  const returnVal = [];
  for (let i = 1; i < n; i++) {
    returnVal.push(i * step);
    returnVal.push(colors[i]);
  }
  return returnVal;
}

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

export const geocoderAPI = {
  forwardGeocode: async (config: { query: string }) => {
    const features = [];
    try {
      const request =
        "https://nominatim.openstreetmap.org/search?q=" +
        config.query +
        "&format=geojson&polygon_geojson=1&addressdetails=1";
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];
        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
          center: center,
        };
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      features: features,
    };
  },
};