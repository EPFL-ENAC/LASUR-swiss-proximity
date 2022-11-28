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
        <div class="variables-selector">
          <div
            v-for="variable in listVariables"
            class="checkbox-variable"
            :key="variable"
          >
            <input
              type="checkbox"
              :value="variable"
              v-model="selectedVariables"
            />
            <label :for="variable">{{ cleanVariableString(variable) }}</label>
          </div>
        </div>

        <v-divider></v-divider>
      </div>
      <v-divider vertical></v-divider>

      <div class="flex-grow-1 d-flex flex-column">
        <v-divider></v-divider>
        <MapboxMap :variables="selectedVariables"></MapboxMap>
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
import { ref } from "vue";
import { listPossibleVariables, cleanVariableString } from "@/utils/variables";

const listVariables = ref(listPossibleVariables);

const selectedVariables = ref(["bike_health", "bike_transit"]);
</script>

<style scoped>
.checkbox-variable >>> input {
  margin-right: 12px;
}

.variables-selector {
  margin: 20px;
}
</style>
