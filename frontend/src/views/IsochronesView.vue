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
          <v-divider></v-divider>

          <v-select
            v-model="selectedTransportMode"
            :items="listTransportModes"
            item-text="name"
            return-object
            label="Transport mode"
          ></v-select>

          <v-divider></v-divider>
        </v-responsive-content>
      </v-reponsive>

      <v-divider vertical></v-divider>

      <div class="flex-grow-1 d-flex flex-column">
        <v-divider></v-divider>
        <IsochronesMap
          :selected-transport-mode="selectedTransportMode.profile"
        ></IsochronesMap>
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
import IsochronesMap from "@/components/IsochronesMap.vue";
import { ref } from "vue";

import { listTransportModes } from "@/utils/isochrone";

const selectedTransportMode = ref(
  listTransportModes.find((t) => t.name === "Public transport") ||
    listTransportModes[0]
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
