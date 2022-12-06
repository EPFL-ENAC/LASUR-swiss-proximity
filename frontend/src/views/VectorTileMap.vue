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
      <div class="d-flex flex-column">
        <div class="selector">
          <div
            v-for="variable in variables"
            class="variable"
            :key="variable.name"
          >
            <input type="checkbox" v-model="variable.selected" />

            <label :for="variable.name">{{
              cleanVariableString(variable.name)
            }}</label
            ><input type="number" v-model.number="variable.weight" />
          </div>
        </div>

        <v-divider></v-divider>
        <div class="selector">
          <div
            v-for="tilesUrl in tilesUrls"
            class="variable"
            :key="tilesUrl.name"
          >
            <input type="radio" :value="tilesUrl" v-model="selectedTilesUrl" />
            <label :for="tilesUrl.name">{{ tilesUrl.name }}</label>
          </div>
        </div>
      </div>

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
  return variables.value.filter((v) => v.selected);
});

const selectedTilesUrl = ref(tilesUrls[0]);

watch(selectedVariables, (newVal) => {
  console.log(newVal);
});
</script>

<style scoped>
.variable >>> input {
  margin-right: 12px;
}

.selector {
  margin: 20px;
}
</style>
