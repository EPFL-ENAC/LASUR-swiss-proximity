<template>
  <v-container
    class="d-flex fill-height align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row class="shrink no-gutters">
      <v-col cols="12">
        <h1>Maplibre prototype</h1>
        <span class="text-subtitle-1"> Using MaplibreGL and vector tiles</span>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="grow no-gutters ma-0">
      <v-col cols="3">
        <v-select
          v-model="selectedTransportMode"
          :items="listTransportModes"
          item-text="name"
          return-object
          label="Transport mode"
        ></v-select>
      </v-col>
      <v-divider vertical></v-divider>

      <v-col cols="9" class="pa-0">
        <IsochronesMap
          :selected-transport-mode="selectedTransportMode.profile"
        ></IsochronesMap>
      </v-col>
    </v-row>
  </v-container>
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
