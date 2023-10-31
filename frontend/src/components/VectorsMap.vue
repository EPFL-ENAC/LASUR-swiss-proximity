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
import {
  ref,
  onMounted,
  withDefaults,
  defineEmits,
  watch,
  onUnmounted,
  computed,
} from "vue";
import { Map, Popup, Marker } from "maplibre-gl";
import type {
  ExpressionSpecification,
  LngLatLike,
  MapDataEvent,
  MapEventType,
  MapLayerEventType,
  MapSourceDataEvent,
} from "maplibre-gl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import {
  stepsColors,
  expressionSum,
  geocoderAPI,
  mapBounds,
  expressionMax,
} from "@/utils/map";

import { cleanVariableString } from "@/utils/variables";
import type {
  DemandVariable,
  SupplyVariable,
  TileParams,
} from "@/utils/variables";
import LoadingCircle from "./LoadingCircle.vue";

const loading = ref(true);
const loadingTilesIDs = ref<Set<number>>(new Set());
const container = ref<HTMLDivElement>();

const popup = ref<Popup>(
  new Popup({
    closeButton: false,
    maxWidth: "800px",
  }),
);

const error = ref(false);
const errorMessage = ref<string | null>(null);

const center: LngLatLike = [7.95, 46.74];

const props = withDefaults(
  defineProps<{
    demandVariables: DemandVariable[];
    supplyVariables: SupplyVariable[];
    listTilesParams: TileParams[];
    colors: { color: string; label: string }[];
    selectedTilesName: string;
    hasGeocoderSearch?: boolean;
    year: number;
    distance: number;
  }>(),
  { hasGeocoderSearch: true },
);

const isDemand = computed(() => props.selectedTilesName.includes("demand"));

const mapColors = computed(() => props.colors.map((d) => d.color));

const emit = defineEmits<{
  (event: "created:map", value: Map): void;
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

  if (isDemand.value) {
    const variables: DemandVariable[] = props.demandVariables;

    const proxyYearDistance = isDemand.value
      ? "_" + props.distance + "_" + props.year
      : "";

    const sumVariables = variables.reduce(
      (partialSum, attribute) =>
        partialSum + (properties[attribute.id + proxyYearDistance] || 0),
      0,
    );
    // POPUP DEMANDE
    popup.value
      .setLngLat(e.lngLat)
      .setHTML(
        `<h3>${properties["Agglo" + proxyYearDistance]}</h3>
      </br>
      <div>
        Part des déplacements < ${props.distance} mètres : <strong>${~~(
          100 * sumVariables
        )}%</strong> (mode.s: ${variables.map(({ name }) => name).join(", ")})

      </div>
     `,
      )
      .addTo(map);
  } else {
    const variables: SupplyVariable[] = props.supplyVariables;
    // POPUP OFFRE
    popup.value
      .setLngLat(e.lngLat)
      .setHTML(
        `<h3>${properties["agglo_All"]}</h3>
      </br>
      ${variables
        .map(
          ({ diversity, name, id, weight }) =>
            "<div>" +
            diversity +
            (diversity > 1 ? " lieux où " : " lieu où ") +
            cleanVariableString(name) +
            " à moins de <strong>" +
            properties[diversity + "_" + id] +
            "</strong> mètres " +
            ` (poids= ${weight})` +
            "</div>",
        )
        .join("\n")}`,
      )
      .addTo(map);
  }
}

function onLeave() {
  if (map == null) return;
  map.getCanvas().style.cursor = "";
  popup.value.remove();
}

const currentExpression = computed(
  () =>
    [
      "step",
      isDemand.value
        ? expressionSum(props.demandVariables, props.year, props.distance)
        : expressionMax(props.supplyVariables),
      // Right now steps colors don't change, I will create a static value for them once the data are normalized
      ...stepsColors(0, isDemand.value ? 1 : 7000, mapColors.value),
    ] as [
      "step",
      number | ExpressionSpecification,
      string,
      ...ExpressionSpecification[],
    ],
);

watch(
  () => [
    props.demandVariables,
    props.supplyVariables,
    props.year,
    props.distance,
    props.selectedTilesName,
  ],
  () => {
    // Change the paint property using new variables and weights

    props.listTilesParams.forEach(({ name }) => {
      if (map === null) return;

      map.setPaintProperty(
        "layer-" + secureTilesName(name),
        "fill-color",
        currentExpression.value,
      );
    });
  },
);

watch(
  () => props.selectedTilesName,
  (newSelectedTileName) => {
    props.listTilesParams.forEach(({ name }) => {
      if (map === null) return;

      // Change the visibility of the layers, only one is visible at a time
      map.setLayoutProperty(
        "layer-" + secureTilesName(name),
        "visibility",
        name === newSelectedTileName ? "visible" : "none",
      );
    });
  },
);

function secureTilesName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
}

function onGeocodingSearchResult(e: { result: { center: LngLatLike } }) {
  if (map === null) return;

  map.flyTo({
    center: e.result.center,
    zoom: 12,
  });
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

    // We add all the vector tiles sources to the map (polygons & h3)
    props.listTilesParams.forEach((tile) => {
      if (map == null) return;

      map.addSource(secureTilesName(tile.name), {
        type: "vector",
        url: tile.url,
      });

      map.on("sourcedata", (e: MapSourceDataEvent) => {
        if (e.isSourceLoaded) loading.value = false;
      });

      map.on("sourcedataloading", (e) => {
        loading.value = true;
      });

      map.addLayer({
        id: "layer-" + secureTilesName(tile.name),
        type: "fill",
        source: secureTilesName(tile.name),
        "source-layer": secureTilesName(tile.name),
        layout: {
          visibility:
            props.selectedTilesName === tile.name ? "visible" : "none",
        },
        paint: {
          "fill-color": currentExpression.value,
          "fill-opacity": 0.6,
        },
      });

      map
        .on("mousemove", "layer-" + secureTilesName(tile.name), onMove)
        .on("mouseleave", "layer-" + secureTilesName(tile.name), onLeave);
    });
  });

  if (props.hasGeocoderSearch) {
    // This control is used to search for a location
    map.addControl(
      new MaplibreGeocoder(geocoderAPI, {
        showResultsWhileTyping: true,
        showResultMarkers: false,
        marker: true,
        maplibregl: { Marker, Popup },
      }).on("result", onGeocodingSearchResult),
    );
  }
  map.on("error", (e) => {
    // Hide those annoying 404/403 errors
    if (e && e.error.message !== "Failed to fetch") console.error(e);
  });

  emit("created:map", map);
});

onUnmounted(() => {
  if (map === null) return;
  props.listTilesParams.map((tile) => {
    map
      ?.off("mousemove", "layer-" + secureTilesName(tile.name), onMove)
      .off("mouseleave", "layer-" + secureTilesName(tile.name), onLeave);
  });
});
</script>

<style scoped>
.map {
  width: 100%;
  position: relative;
}
</style>
