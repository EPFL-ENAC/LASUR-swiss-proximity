import axios, { AxiosError } from "axios";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Polygon,
} from "geojson";

import difference from "@turf/difference";
export type TransportMode = { name: string; profile: string };
// List of transport mode, with ORS or TravelTime corresponding terminology
export const listTransportModes = [
  { name: "Voiture", profile: "driving-car" },
  { name: "Vélo", profile: "cycling-regular" },
  { name: "Marche", profile: "foot-walking" },

  // { name: "Public transport", profile: "public_transport" },
];

type ErrorTravelTime = {
  description: string;
  documentation_link: string;
  error_code: number;
  http_status: number;
};

type ErrorORS = {
  error: { code: number; message: string };
  info: { engine: { version: string; build_date: string }; timestamp: number };
};

const differenceIsochrones = (
  features: Feature<Polygon, GeoJsonProperties>[]
) => {
  const featuresSorted = features.sort(
    (a, b) => a?.properties?.value - b?.properties?.value
  );

  return featuresSorted.map((d, i) => {
    if (i == 0) return d;
    else {
      const isochroneDiff = difference(d, featuresSorted[i - 1]);
      return isochroneDiff !== null
        ? (isochroneDiff as Feature<Polygon, GeoJsonProperties>)
        : d;
    }
  });
};

const getIsochroneORS = (
  location: [number, number],
  mode: string,
  times: number[]
) => {
  // Axios post request to ORS API
  return axios
    .post<FeatureCollection>(`/orsapi/v2/isochrones/${mode}`, {
      locations: [location],
      // ORS API expects times in minutes
      range: times,
      range_type: "time",
    })
    .then((res) => res.data.features as Feature<Polygon, GeoJsonProperties>[])
    .then(differenceIsochrones)
    .catch((error: AxiosError<ErrorORS>) => {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        throw Object.assign(error, {
          error_description: error.response?.data.error.message,
        });
      } else throw error;
    });
};

const getLastMonday = (date: Date) =>
  new Date(date.setDate(date.getDate() - ((date.getDay() + 6) % 7)));

const getIsochroneTravelTime = (
  location: [number, number],
  mode: string,
  times: number[]
) => {
  const [lng, lat] = location;

  //Because Travel time only has data for last two weeks we ask them for a departure in the morning on most recent Monday
  const departure_time = new Date(getLastMonday(new Date()).setHours(9));

  // Axios post request to TravelTime API
  return axios
    .post<FeatureCollection>(
      `/traveltimeapi/v4/time-map`,
      {
        departure_searches: times.map((time) => ({
          id: `Isochrone transport Switzerland ${Math.round(time / 60)}min}`,
          departure_time: departure_time.toISOString(),
          travel_time: time,
          coords: { lat, lng },
          transportation: { type: mode },
        })),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/geo+json",
        },
      }
    )
    .then(
      (res) =>
        res.data.features.map((feat, index) => {
          feat.properties = { value: times[index] };
          return feat;
        }) as Feature<Polygon, GeoJsonProperties>[]
    )
    .then(differenceIsochrones)
    .catch((error: AxiosError<ErrorTravelTime>) => {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        throw Object.assign(error, {
          error_description: error.response?.data.description,
        });
      } else throw error;
    });
};

export const getIsochrone = (
  location: [number, number],
  mode: string,
  times: number[]
) => {
  return mode === "public_transport"
    ? getIsochroneTravelTime(location, mode, times)
    : getIsochroneORS(location, mode, times);
};
