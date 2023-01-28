<template>
  <div ref="container" class="full-height map">
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
    <v-alert class="centered-alert" v-model="error" type="error" dismissible>{{
      errorMessage
    }}</v-alert>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch } from "vue";
import { Map, Popup, LngLatLike, Marker, Source, LngLat } from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import { mapColors, stepsColors, geocoderAPI } from "@/utils/map";

import { getIsochrone } from "@/utils/isochrone";

import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { AxiosError } from "axios";

const loading = ref(true);

const container = ref<HTMLDivElement>();

const error = ref(false);
const errorMessage = ref<string | null>(null);

const geocoder = new MaplibreGeocoder(geocoderAPI, {
  showResultsWhileTyping: true,
  showResultMarkers: false,
  marker: false,
  maplibregl: { Marker, Popup },
});

const center: LngLatLike = [7.95, 46.74];

const props = defineProps<{
  selectedTransportMode: string;
}>();

var map: Map | null = null;
const isochroneMarker: Marker = new Marker({ draggable: true, color: "grey" });

watch(
  () => props.selectedTransportMode,
  () => {
    fetchIsochrone(isochroneMarker.getLngLat());
  }
);

type SourceNewAPI = {
  setData: (data: FeatureCollection) => void;
};

type ApiError = {
  error_description: string;
};

function fetchIsochrone(location: LngLatLike) {
  // Use getIsochrone to fetch isochrone at the given location, for [1, 5, 10, 15] times
  //Then set the geojson data to the source "isochrone" using the setData method

  getIsochrone(
    LngLat.convert(location).toArray() as [number, number],
    props.selectedTransportMode,
    [5, 10, 15].map((minutes) => minutes * 60)
  )
    .then((data: Feature<Geometry, GeoJsonProperties>[]) => {
      if (map === null) return;
      const source = map?.getSource("isochrone") as Source & SourceNewAPI;
      source.setData({ type: "FeatureCollection", features: data });
    })
    .catch((err: AxiosError & ApiError) => {
      error.value = true;
      errorMessage.value = err.message + " : " + err.error_description;
    });
}

function onGeocodingSearchResult(e: { result: { center: LngLatLike } }) {
  if (map === null) return;
  isochroneMarker.setLngLat(e.result.center).addTo(map);
  map.flyTo({
    center: e.result.center,
    zoom: 12,
  });

  fetchIsochrone(e.result.center);
}

onMounted(() => {
  map = new Map({
    container: container.value as HTMLDivElement,
    // nginx will redirect to the correct maptiler url adding the API key
    style: "/maptiler/maps/basic-v2-light/style.json",
    zoom: 7,
    center,
  }) as InstanceType<typeof Map>;

  map.on("load", function () {
    loading.value = false;

    if (map == null) return;

    map.addSource("isochrone", {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "Polygon", coordinates: [] } },
    });
    // Add a new layer to visualize the isochrone.
    map.addLayer({
      id: "isochrone-fill",
      type: "fill",
      source: "isochrone", // reference the data source
      layout: {},
      paint: {
        "fill-color": "#0080ff", // blue color fill
        "fill-opacity": 0.5,
      },
    });

    //Add layer for isochrone feature
    map.addLayer({
      id: "isochrone",
      type: "fill",
      source: "isochrone",
      layout: {},
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          ...stepsColors(300, 900, mapColors),
        ],
        "fill-opacity": 0.5,
      },
    });

    // This control is used to search for a location
    map.addControl(geocoder.on("result", onGeocodingSearchResult));

    geocoder.query("EPFL Lausanne");

    isochroneMarker.on("dragend", () => {
      const { lng, lat } = isochroneMarker.getLngLat();
      fetchIsochrone([lng, lat]);
    });
  });
});
</script>

<style scoped>
.map {
  min-height: 1000px;
  width: 100%;
  position: relative;
}
.centered-alert {
  position: fixed;
  left: 50%;
  bottom: 50px;
  z-index: 100;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
</style>
