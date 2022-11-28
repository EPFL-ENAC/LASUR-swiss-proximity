<template>
  <div ref="container" class="full-height map">
    <link
      href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  Ref,
  defineProps,
  defineEmits,
  computed,
  watch,
  onUnmounted,
} from "vue";
import {
  Map,
  Popup,
  LngLatLike,
  ExpressionSpecification,
  ExpressionInputType,
  MapEventType,
  MapLayerEventType,
} from "maplibre-gl";

import { mapColors, stepsColors, expressionMean } from "@/utils/map";

const loading = ref(true);

const width = ref(0);
const height = ref(0);

const container = ref<HTMLDivElement>();

const popup = ref<Popup>(
  new Popup({
    closeButton: false,
  })
);

const center: LngLatLike = [7.95, 46.74];

const props = defineProps<{
  variables: string[];
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
        (key) => "<div>" + key + " : " + properties[key] || null + "</div>"
      )}`
    )
    .addTo(map);
}

function onLeave() {
  if (map == null) return;
  map.getCanvas().style.cursor = "";
  popup.value.remove();
}

onMounted(() => {
  if (container.value) {
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight;
  }
  // width.value = container.value["clientWidth"] | 0;
  // height.value = container.value["clientHeight"] | 0;

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
    map.addSource("lh018p56r", {
      type: "vector",
      tiles: [
        "https://enacit4r-cdn.epfl.ch/lasur-swiss-proximity/2022-11-24/{z}/{x}/{y}.pbf",
      ],
      minzoom: 1,
      maxzoom: 13,
    });

    map.addLayer({
      id: "units",
      type: "fill",
      source: "lh018p56r",
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
