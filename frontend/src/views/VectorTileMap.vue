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
          <v-radio-group v-model="selectedTilesUrl">
            <v-radio
              v-for="tilesUrl in tilesUrls"
              class="variable"
              :key="tilesUrl.name"
              :label="tilesUrl.name"
              :value="tilesUrl"
            >
            </v-radio>
          </v-radio-group>

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
          :tilesUrl="selectedTilesUrl"
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
import { ref, watch, computed } from "vue";
import {
  listPossibleVariables,
  tilesUrls,
  cleanVariableString,
} from "@/utils/variables";

const listVariables = listPossibleVariables;

const variables = ref(
  listVariables.map((v) => ({
    name: v,
    weight: 1,
    selected: v === "bike_health" || v === "bike_transit",
  }))
);

const selectedVariables = computed(() => {
  return variables.value.filter(({ weight, selected }) => selected);
});

const selectedTilesUrl = ref(tilesUrls[0]);
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
