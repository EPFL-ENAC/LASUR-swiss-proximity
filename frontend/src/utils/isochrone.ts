import axios, { AxiosError } from "axios";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { ExtendedFeatureCollection } from "d3";

// List of transport mode, with ORS or TravelTime corresponding terminology
export const listTransportModes = [
  { name: "Driving", profile: "driving-car" },
  { name: "Cycling", profile: "cycling-regular" },
  { name: "Walking", profile: "foot-walking" },
  { name: "Wheelchair", profile: "wheelchair" },
  { name: "Public transport", profile: "public_transport" },
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

const getIsochroneORS = (
  location: [number, number],
  mode: string,
  times: number[]
) => {
  // Axios post request to ORS API
  return axios
    .post<ExtendedFeatureCollection>(`/orsapi/v2/isochrones/${mode}`, {
      locations: [location],
      // ORS API expects times in minutes
      range: times,
      range_type: "time",
    })
    .then((res) => res.data.features as Feature<Geometry, GeoJsonProperties>[])
    .catch((error: AxiosError<ErrorORS>) => {
      if (axios.isAxiosError(error)) {
        // Access to config, request, and response
        throw Object.assign(error, {
          error_description: error.response?.data.error.message,
        });
      } else throw error;
    });
};

const getIsochroneTravelTime = (
  location: [number, number],
  mode: string,
  times: number[]
) => {
  const [lng, lat] = location;

  // Axios post request to TravelTime API
  return axios
    .post<ExtendedFeatureCollection>(
      `/traveltimeapi/v4/time-map`,
      {
        departure_searches: times.map((time) => ({
          id: `Isochrone transport Switzerland ${Math.round(time / 60)}min}`,
          departure_time: new Date().toISOString(),
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
        }) as Feature<Geometry, GeoJsonProperties>[]
    )
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
