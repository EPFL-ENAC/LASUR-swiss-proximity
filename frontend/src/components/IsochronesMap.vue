<template>
  <v-container class="pa-0 fill-height" fluid>
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>

    <div ref="container" class="map fill-height" />
    <v-snackbar
      elevation="0"
      color="transparent"
      variant="flat"
      v-model="error"
      :timeout="15000"
    >
      <v-alert
        title="Error"
        border="start"
        v-model="error"
        variant="flat"
        type="error"
        closable
      >
        {{ errorMessage }}
      </v-alert>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch } from "vue";
import { Map, Popup, Marker, LngLat } from "maplibre-gl";
import type { LngLatLike, Source } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

import {
  isochroneColors,
  stepsColors,
  geocoderAPI,
  mapBounds,
} from "@/utils/map";

import { getIsochrone } from "@/utils/isochrone";

import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Polygon,
} from "geojson";
import type { AxiosError } from "axios";

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
    [15, 20, 25, 30].map((minutes) => minutes * 60)
  )
    .then((data: Feature<Polygon, GeoJsonProperties>[]) => {
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
    style:
      "https://api.maptiler.com/maps/basic-v2-light/style.json?key=1RYHB5HXhtpj8qlO8hFi",
    zoom: 7,
    center,
    maxBounds: mapBounds,
  }) as InstanceType<typeof Map>;

  map.on("load", function () {
    loading.value = false;

    if (map == null) return;

    map.addSource("isochrone", {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "Polygon", coordinates: [] } },
    });

    //Add layer for isochrone feature
    map.addLayer({
      id: "isochrone",
      type: "fill",
      source: "isochrone",
      //This is the solution I found to reverse the order of the features (smaller isochrone on top)
      layout: { "fill-sort-key": ["*", ["to-number", ["get", "value"]], -1] },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          ...stepsColors(15 * 60, 30 * 60, isochroneColors),
        ],
        "fill-opacity": 0.5,
        "fill-outline-color": "rgba(0,0,0,0.1)",
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
  width: 100%;
  position: relative;
}
</style>
