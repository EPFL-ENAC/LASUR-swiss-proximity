<template>
  <div ref="container" class="full-height map">
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch, onUnmounted } from "vue";
import {
  Map,
  Popup,
  LngLatLike,
  MapLayerEventType,
  Source,
  Marker,
} from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import {
  mapColors,
  stepsColors,
  expressionMean,
  geocoderAPI,
} from "@/utils/map";

import { cleanVariableString } from "@/utils/variables";

const loading = ref(true);

const container = ref<HTMLDivElement>();

const popup = ref<Popup>(
  new Popup({
    closeButton: false,
  })
);

const center: LngLatLike = [7.95, 46.74];

const props = defineProps<{
  variables: string[];
  tilesUrl: { name: string; url: string };
}>();

var map: Map | null = null;

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
      `<h3>${
        properties.municipality_name ||
        properties.agglomeration_name + "-" + properties.id
      }</h3>
</br>${props.variables.map(
        (key) =>
          "<div>" + cleanVariableString(key) + " : " + properties[key] ||
          null + "</div>"
      )}`
    )
    .addTo(map);
}

function onLeave() {
  if (map == null) return;
  map.getCanvas().style.cursor = "";
  popup.value.remove();
}

watch(
  () => props.variables,
  (newVariables) => {
    if (map === null) return;
    map.setPaintProperty("units", "fill-color", [
      "interpolate",
      ["linear"],
      expressionMean(newVariables.length > 0 ? newVariables : ["bike_health"]),
      ...stepsColors(0, 2000, mapColors),
    ]);
  }
);

type SourceNewAPI = {
  setTiles: (tiles: string[]) => void;
};

watch(
  () => props.tilesUrl,
  (newTilesUrl) => {
    if (map === null) return;
    const source = map.getSource("tiles") as Source & SourceNewAPI;
    if (source && source.setTiles) source.setTiles([newTilesUrl.url]);
  }
);

onMounted(() => {
  map = new Map({
    container: container.value as HTMLDivElement,
    style:
      "https://api.maptiler.com/maps/ch-swisstopo-lbm-grey/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    zoom: 7,
    center,
  }) as InstanceType<typeof Map>;

  map.on("load", function () {
    loading.value = false;

    if (map == null) return;

    // Add Mapillary sequence layer.
    // https://www.mapillary.com/developer/tiles-documentation/#sequence-layer
    map.addSource("tiles", {
      type: "vector",
      tiles: [props.tilesUrl.url],
      minzoom: 1,
      maxzoom: 13,
    });

    map.addLayer({
      id: "units",
      type: "fill",
      source: "tiles",
      "source-layer": "units",
      minzoom: 0,
      maxzoom: 22,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          expressionMean(props.variables),
          ...stepsColors(0, 2000, mapColors),
        ],
        "fill-opacity": 0.4,
        "fill-outline-color": "rgba(105, 101, 141, 1)",
      },
    });

    map.on("mousemove", "units", onMove).on("mouseleave", "units", onLeave);

    map.addControl(
      new MaplibreGeocoder(geocoderAPI, {
        showResultsWhileTyping: true,
        showResultMarkers: true,
        maplibregl: { Marker },
      })
    );
  });
});

onUnmounted(() => {
  if (map === null) return;
  map.off("mousemove", "units", onMove).off("mouseleave", "units", onLeave);
});
</script>

<style scoped>
.map {
  min-height: 1000px;
  width: 100%;
  position: relative;
}
</style>
