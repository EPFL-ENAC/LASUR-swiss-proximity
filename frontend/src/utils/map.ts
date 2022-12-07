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
  attributes: { name: string; weight: number }[]
): ExpressionSpecification | number {
  if (attributes.length == 0) return 0;
  const sumWeight = attributes.reduce(
    (partialSum, attribute) => partialSum + attribute.weight,
    0
  );
  if (attributes.length == 1)
    return [
      "to-number",
      ["get", attributes[0].name],
    ] as ExpressionSpecification;

  const values = attributes.map(({ name, weight }) => [
    "*",
    ["to-number", ["get", name]],
    weight,
  ]);
  const total = values.reduce(
    (acc, curr) => ["+", acc, curr] as (string | string[])[]
  );
  return ["/", total, sumWeight] as ExpressionSpecification;
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

const switzerlandGeocoordinatesLimits = [
  [45.8, 5.9],
  [47.9, 10.6],
];

export const geocoderAPI = {
  forwardGeocode: async (config: { query: string }) => {
    const features = [];
    try {
      const [[y1, x1], [y2, x2]] = switzerlandGeocoordinatesLimits;
      const request =
        "https://nominatim.openstreetmap.org/search?q=" +
        config.query +
        `&format=geojson&polygon_geojson=1&addressdetails=1&viewbox=${x1},${y1},${x2},${y2}&bounded=1`;
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
