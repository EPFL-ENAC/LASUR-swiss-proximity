<template>
  <div class="d-flex flex-column full-height text-justify">
    <div class="d-flex flex-row align-center ma-3">
      <div class="flex-grow-1">
        <h1>Maplibre prototype</h1>
        <span class="text-subtitle-1"> Using MaplibreGL and vector tiles</span>
      </div>
      <a href="https://epfl.ch" target="_blank">
        <v-img
          contain
          src="/logo/EPFL_Logo_184X53.svg"
          height="50px"
          width="100px"
        ></v-img>
      </a>
    </div>
    <v-divider></v-divider>
    <div class="flex-grow-1 d-flex flex-row">
      <v-reponsive class="d-flex flex-column selector-column">
        <v-responsive-content>
          <v-radio-group v-model="selectedTilesSource">
            <v-radio
              v-for="tilesParams in listTilesParams"
              class="variable"
              :key="tilesParams.name"
              :label="tilesParams.name"
              :value="tilesParams"
            >
            </v-radio>
          </v-radio-group>

          <v-divider></v-divider>

          <v-select
            v-model="selectedTransportMode"
            :items="listTransportModes"
            item-text="name"
            return-object
            label="Transport mode"
          ></v-select>

          <v-divider></v-divider>

          <v-input
            v-for="variable in variables"
            class="variable"
            :key="variable.name"
          >
            <v-checkbox
              v-model="variable.selected"
              :label="cleanVariableString(variable.name)"
            ></v-checkbox>

            <v-slider
              dense
              min="0"
              max="2"
              step="0.1"
              v-model="variable.weight"
              thumb-label
              :thumb-size="26"
            ></v-slider>
          </v-input>
        </v-responsive-content>
      </v-reponsive>

      <v-divider vertical></v-divider>

      <div class="flex-grow-1 d-flex flex-column">
        <v-divider></v-divider>
        <MapboxMap
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :selected-transport-mode="selectedTransportMode.profile"
        ></MapboxMap>
        <div class="d-flex flex-row">
          <div class="flex-even legend"></div>
          <v-divider vertical></v-divider>
          <div class="flex-even legend"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MapboxMap from "@/components/MapboxMap.vue";
import { ref, computed } from "vue";
import {
  listPossibleVariables,
  listTilesParams,
  cleanVariableString,
} from "@/utils/variables";

import { listTransportModes } from "@/utils/isochrone";
const listVariables = listPossibleVariables;

const variables = ref(
  listVariables.map((v) => ({
    name: v,
    weight: 1,
    selected: v === "bike_health" || v === "bike_transit",
  }))
);

const selectedVariables = computed(() => {
  return variables.value.filter(({ selected }) => selected);
});

const selectedTransportMode = ref(
  listTransportModes.find((t) => t.name === "Public transport") ||
    listTransportModes[0]
);

const selectedTilesSource = ref(listTilesParams[0]);
</script>

<style scoped>
.variable :deep(input) {
  margin-right: 12px;
  text-align: right;
}

.selector-column {
  width: 400px;
}
</style>
