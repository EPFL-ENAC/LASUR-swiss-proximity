import axios from "axios";
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

const getIsochroneORS = (
  location: [number, number],
  mode: string,
  time: number
) => {
  // Axios post request to ORS API
  return axios
    .post<ExtendedFeatureCollection>(`/orsapi/v2/isochrones/${mode}`, {
      locations: [location],
      // ORS API expects time in minutes
      range: [time],
      range_type: "time",
    })
    .then(
      (res) => res.data.features[0] as Feature<Geometry, GeoJsonProperties>
    );
};

const getIsochroneTravelTime = (
  location: [number, number],
  mode: string,
  time: number
) => {
  const [lng, lat] = location;

  // Axios post request to TravelTime API
  return axios
    .post<ExtendedFeatureCollection>(
      `/traveltimeapi/v4/time-map`,
      {
        departure_searches: [
          {
            id: "Isochrone transport Switzerland",
            departure_time: new Date().toISOString(),
            travel_time: time,
            coords: { lat, lng },
            transportation: { type: mode },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/geo+json",
        },
      }
    )
    .then(
      (res) => res.data.features[0] as Feature<Geometry, GeoJsonProperties>
    ); // TravelTime API returns a FeatureCollection, we only want the first feature (the isochron
};

export const getIsochrone = (
  location: [number, number],
  mode: string,
  time: number
) => {
  return mode === "public_transport"
    ? getIsochroneTravelTime(location, mode, time)
    : getIsochroneORS(location, mode, time);
};
