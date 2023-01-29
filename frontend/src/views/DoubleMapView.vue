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
    <v-row>
      <v-col cols="2">
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
      </v-col>
      <v-col cols="5">
        <VectorsMap
          class="left-map"
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :showLog="true"
          @created:map="leftMap = $event"
        ></VectorsMap>
      </v-col>
      <v-col cols="5">
        <VectorsMap
          class="right-map"
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :showLog="false"
          @created:map="rightMap = $event"
        ></VectorsMap>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import VectorsMap from "@/components/VectorsMap.vue";
import { ref, computed, watch } from "vue";
import {
  listPossibleVariables,
  listTilesParams,
  cleanVariableString,
} from "@/utils/variables";
import { Map } from "maplibre-gl";
import { syncMaps } from "@/utils/syncmap";

const listVariables = listPossibleVariables;

const variables = ref(
  listVariables.map((v) => ({
    name: v,
    weight: 1,
    selected: v === "bike_health" || v === "bike_transit",
  }))
);

const selectedVariables = computed(() => {
  //I added weight so it update props when weight change
  return variables.value.filter(
    ({ selected, weight }) => selected && weight > 0
  );
});

const leftMap = ref<Map>();
const rightMap = ref<Map>();

const selectedTilesSource = ref(listTilesParams[0]);

watch(
  () => ({ leftMap: leftMap.value, rightMap: rightMap.value }),
  ({ leftMap, rightMap }) => {
    if (leftMap !== undefined && rightMap !== undefined) {
      syncMaps([leftMap, rightMap]);
    }
  }
);
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
