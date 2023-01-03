<template>
  <div ref="container" class="full-height map">
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, watch, onUnmounted } from "vue";
import { Map, Popup, LngLatLike, MapLayerEventType, Marker } from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import {
  mapColors,
  stepsColors,
  expressionMean,
  geocoderAPI,
} from "@/utils/map";

import { cleanVariableString, TileParams } from "@/utils/variables";

const loading = ref(true);

const container = ref<HTMLDivElement>();

const popup = ref<Popup>(
  new Popup({
    closeButton: false,
  })
);

const center: LngLatLike = [7.95, 46.74];

const props = defineProps<{
  variables: { name: string; weight: number; selected: boolean }[];
  listTilesParams: TileParams[];
  selectedTilesName: string;
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
          "<div>" +
            cleanVariableString(key.name) +
            " : " +
            properties[key.name] || null + "</div>"
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
    // Change the paint property using new variables and weights

    const expression = [
      "interpolate",
      ["linear"],
      expressionMean(newVariables),
      // Right now steps colors don't change, I will create a static value for them once the data are normalized
      ...stepsColors(0, 2000, mapColors),
    ];

    props.listTilesParams.forEach(({ name }) => {
      if (map === null) return;

      map.setPaintProperty(
        "layer-" + secureTilesName(name),
        "fill-color",
        expression
      );
    });
  }
);

// This was a try to use the new API of maplibre-gl, I used it to change the source of layers, now we have both layers and trigger visibility
// type SourceNewAPI = {
//   setTiles: (tiles: string[]) => void;
//   setSourceProperty: (callback: any) => void;
// };

watch(
  () => props.selectedTilesName,
  (newSelectedTileName) => {
    props.listTilesParams.forEach(({ name }) => {
      if (map === null) return;

      // Change the visibility of the layers, only one is visible at a time
      map.setLayoutProperty(
        "layer-" + secureTilesName(name),
        "visibility",
        name === newSelectedTileName ? "visible" : "none"
      );
    });
  }
);

function secureTilesName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
}

onMounted(() => {
  map = new Map({
    container: container.value as HTMLDivElement,
    style:
      "https://api.maptiler.com/maps/basic-v2-light/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
    zoom: 7,
    center,
  }) as InstanceType<typeof Map>;

  map.on("load", function () {
    loading.value = false;

    if (map == null) return;

    // We add all the vector tiles sources to the map (polygons & h3)
    props.listTilesParams.forEach((tile) => {
      if (map == null) return;

      map.addSource(secureTilesName(tile.name), {
        type: "vector",
        tiles: [tile.url],
        minzoom: tile.minzoom,
        maxzoom: tile.maxzoom,
      });

      map.addLayer({
        id: "layer-" + secureTilesName(tile.name),
        type: "fill",
        source: secureTilesName(tile.name),
        "source-layer": "units",
        layout: {
          visibility:
            props.selectedTilesName === tile.name ? "visible" : "none",
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
    });

    map.on("mousemove", "units", onMove).on("mouseleave", "units", onLeave);

    // This control is used to search for a location
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
