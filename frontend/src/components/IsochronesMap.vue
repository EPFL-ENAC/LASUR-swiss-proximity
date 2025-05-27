<template>
  <v-container class="pa-0 fill-height" fluid>
    <div ref="container" class="map fill-height">
      <loading-circle :loading="loading" />
    </div>
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
import { ref, onMounted, defineProps, watch, onUnmounted } from "vue";
import {
  Map,
  Popup,
  Marker,
  LngLat,
  type MapLayerEventType,
  type ExpressionInputType,
  type ExpressionSpecification,
  type DataDrivenPropertyValueSpecification,
} from "maplibre-gl";
import type { LngLatLike, Source } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

import {
  isochroneColors,
  stepsColors,
  geocoderAPI,
  mapBounds,
  publicStopsColors,
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
import LoadingCircle from "./LoadingCircle.vue";

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

const popup = ref<Popup>(
  new Popup({
    closeButton: false,
  }),
);

const center: LngLatLike = [7.95, 46.74];

const props = defineProps<{
  selectedTransportMode: string;
}>();

var map: Map | null = null;
const isochroneMarker: Marker = new Marker({ draggable: true, color: "grey" });

function onMove(e: MapLayerEventType["mousemove"]) {
  if (map === null) return;
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = "pointer";

  // Use the first found feature.
  if (e.features === undefined || e.features === null) return;

  const feature = e.features[0],
    properties = feature.properties || {};

  // Display a popup with the name of the county.
  popup.value
    .setLngLat(e.lngLat)
    .setHTML(
      `<h3>${properties.stop_name}</h3>
      <p>${properties.description}</p>
      </br>`,
    )
    .addTo(map);
}

function onLeave() {
  if (map == null) return;
  map.getCanvas().style.cursor = "";
  popup.value.remove();
}

watch(
  () => props.selectedTransportMode,
  () => {
    fetchIsochrone(isochroneMarker.getLngLat());
  },
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
    [15, 20, 25].map((minutes) => minutes * 60),
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
    style: "/style.json",

    zoom: 7,
    center,
    maxBounds: mapBounds,
  }) as InstanceType<typeof Map>;

  map.on("load", function () {
    loading.value = false;

    if (map == null) return;

    map.addSource("isochrone", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [] },
        properties: {},
      },
    });

    // Add layer for isochrone feature
    map.addLayer({
      id: "isochrone",
      type: "fill",
      source: "isochrone",
      //This is the solution I found to reverse the order of the features (smaller isochrone on top)
      layout: { "fill-sort-key": ["*", ["to-number", ["get", "value"]], -1] },
      paint: {
        "fill-color": [
          "step",
          ["get", "value"],
          ...stepsColors(
            15 * 60,
            25 * 60,
            isochroneColors.map((d) => d.color),
          ),
        ],
        "fill-opacity": 0.5,
        "fill-outline-color": "rgba(0,0,0,0.1)",
      },
    });

    map.addSource("stops", {
      type: "vector",
      tiles: [
        "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2023-02-06/public-transport-stops/{z}/{x}/{y}.pbf",
      ],
      minzoom: 11,
    });

    //Add layer for public transport stops
    map.addLayer({
      id: "stops_layer",
      "source-layer": "public_transport_stops",
      type: "circle",
      source: "stops",
      paint: {
        "circle-color": publicStopsColors as
          | DataDrivenPropertyValueSpecification<string>
          | undefined,
        "circle-radius": 5,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    map
      .on("mousemove", "stops_layer", onMove)
      .on("mouseleave", "stops_layer", onLeave);

    // This control is used to search for a location
    map.addControl(geocoder.on("result", onGeocodingSearchResult));

    geocoder.query("EPFL Lausanne");

    isochroneMarker.on("dragend", () => {
      const { lng, lat } = isochroneMarker.getLngLat();
      fetchIsochrone([lng, lat]);
    });
  });
});

onUnmounted(() => {
  if (map === null) return;
  map
    ?.off("mousemove", "stops_layer", onMove)
    .off("mouseleave", "stops_layer", onLeave);
});
</script>

<style scoped>
.map {
  width: 100%;
  position: relative;
}
</style>
