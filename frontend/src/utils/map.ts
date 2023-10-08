import type { ExpressionSpecification } from "maplibre-gl";
import { LngLat, LngLatBounds } from "maplibre-gl";
// export const mapColors = [
//   "#1a9850",
//   "#66bd63",
//   "#a6d96a",
//   "#d9ef8b",
//   "#ffffbf",
//   "#fee08b",
//   "#fdae61",
//   "#f46d43",
//   "#d73027",
// ];

export const publicStopsColors = [
  "match",
  ["get", "description"],
  // BUS
  [
    "Bus Service",
    "Bus Service,Night Bus Service",
    "Night Bus Service,Bus Service",
  ],
  "#ccc",

  //METRO
  [
    "Metro Service",
    "Metro Service,Bus Service",
    "Metro Service,Night Bus Service",
    "Metro Service,Bus Service,Night Bus Service",
    "Metro Service,Night Bus Service,Bus Service",
    "Funicular Service",
  ],
  "#fbb03b",

  //TRAM
  ["Tram Service", "Tram Service,Bus Service"],
  "green",

  //RAILWAY
  [
    "Long Distance Trains",
    "Regional Rail Service",
    "Suburban Railway",
    "Suburban Railway,Additional Rail Service",
    "Suburban Railway,Regional Rail Service,Additional Rail Service",
    "Suburban Railway,Regional Rail Service",
    "Suburban Railway,Bus Service",
    "Regional Rail Service,Bus Service",
  ],
  "#C60018",

  //BOAT
  "Water Transport Service",
  "#3bb2d0",
  /* other */ "black",
];

export const isochroneColors = ["#ffffe5", "#bbe395", "#389d55"];

export const hexagonsResolutions = [6, 7, 8];

const sw = new LngLat(4, 44),
  ne = new LngLat(13, 49.5);

export const mapBounds = new LngLatBounds(sw, ne);

export const center = [-837, 9380];
export const scale = 61878;

// This function calculates the weighted mean of a set of attributes in an object. It takes an array of objects with name and weight properties, and returns either a number or an expression specification.
// If the input array is empty, the function returns 0. If the array has only one element, it returns an expression specification for the attribute specified in the element.
// Otherwise, it returns an expression specification that calculates the mean of the attributes.

// Thanks ChatGPT ;)

// I'm actually using this function to create the "maplibre" expression https://maplibre.org/maplibre-gl-js-docs/style-spec/expressions/#math to calculate the weighted mean of the variables in the map

export function expressionMean(
  attributes: { id: string; weight: number }[],
  year?: number,
  distance?: number
): ExpressionSpecification | number {
  if (attributes.length == 0) return 0;

  const yearProxString =
    year !== undefined && distance !== undefined
      ? "_" + distance.toString() + "_" + year.toString()
      : "";
  // Calculate the sum of the weights
  const sumWeight = attributes.reduce(
    (partialSum, attribute) => partialSum + attribute.weight,
    0
  );

  // If there is only one attribute, return an expression that gets the value of the attribute
  if (attributes.length == 1)
    return [
      "to-number",
      ["get", attributes[0].id + yearProxString],
    ] as ExpressionSpecification;

  // Otherwise, calculate the weighted mean of the attributes
  const values = attributes.map(({ id, weight }) => [
    "*",
    ["to-number", ["get", id + yearProxString]],
    weight,
  ]);

  // Create an expression that calculates the sum of the weighted values
  const total = values.reduce(
    (acc, curr) => ["+", acc, curr] as (string | string[])[]
  );

  // Use the total and the sum of the weights to calculate the weighted mean
  return ["/", total, sumWeight] as ExpressionSpecification;
}

// This function returns an array of colors and values to be used in the map legend. It takes the minimum and maximum values of the variable, and an array of colors.
// It returns an array of values and colors, where the values are the values of the variable that correspond to the colors in the legend.
export function stepsColors(min: number, max: number, colors: string[]) {
  const diff = max - min,
    n = colors.length,
    step = diff / (n - 1);
  const returnVal: (string | number)[] = [colors[0]];
  for (let i = 1; i < n; i++) {
    returnVal.push(i * step + min);
    returnVal.push(colors[i]);
  }
  return returnVal as [string, ...ExpressionSpecification[]];
}

// Thoses coordinates create a bounding box around Switzerland, I use them to limit the search to Switzerland
// I choose them by hand with a little margin around the country
const switzerlandGeocoordinatesLimits = [
  [45.8, 5.9],
  [47.9, 10.6],
];

// This function is used to forward geocode the search input. It takes a query string and returns a list of features.
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
