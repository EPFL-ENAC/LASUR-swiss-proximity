<template>
  <v-container
    class="d-flex fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row dense class="flex-grow-0 no-gutters">
      <v-col>
        <v-card flat>
          <v-card-title>Valeurs de l'étude </v-card-title>
          <v-card-text> </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1" no-gutters>
      <v-col cols="2">
        <ProximityConfigColumn
          v-model:variables="variables"
          :tiles-sources="listTilesParams"
          v-model:selected-tiles-source="selectedTilesSource"
          :on-reset-session-storage="resetSessionStorage"
        >
        </ProximityConfigColumn>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="10" class="pa-0">
        <VectorsMap
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :has-geocoder-search="true"
        ></VectorsMap>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import VectorsMap from "@/components/VectorsMap.vue";
import ProximityConfigColumn from "@/components/ProximityConfigColumn.vue";
import { ref, computed, watch } from "vue";
import { listPossibleVariables, listTilesParams } from "@/utils/variables";
import type { TileParams, ProximityVariable } from "@/utils/variables";

const listVariables = listPossibleVariables;

const defaultVariables: ProximityVariable[] = listVariables
  .slice(0, listVariables.length - 1)
  .map((v) => ({
    name: v,
    weight: 1,
    selected: v === "bike_health" || v === "bike_transit",
  }));

const storageKeyVariables = "selectedVariables",
  storageItemVariables = sessionStorage.getItem(storageKeyVariables),
  savedVariables = storageItemVariables
    ? (JSON.parse(storageItemVariables) as ProximityVariable[])
    : JSON.parse(JSON.stringify(defaultVariables));

const variables = ref<ProximityVariable[]>(savedVariables);

const selectedVariables = computed(() => {
  //I added weight so it update props when weight change
  return variables.value.filter(
    ({ selected, weight }) => selected && weight > 0
  );
});

const storageKeyTilesSource = "selectedTilesSource",
  storageItemTilesSource = sessionStorage.getItem(storageKeyTilesSource),
  savedTilesSource = storageItemTilesSource
    ? (JSON.parse(storageItemTilesSource) as TileParams)
    : listTilesParams[0];

const selectedTilesSource = ref(savedTilesSource);

watch(selectedTilesSource, (newTilesSource) =>
  sessionStorage.setItem(storageKeyTilesSource, JSON.stringify(newTilesSource))
);

watch(selectedVariables, () =>
  sessionStorage.setItem(storageKeyVariables, JSON.stringify(variables.value))
);

function resetSessionStorage() {
  variables.value = JSON.parse(JSON.stringify(defaultVariables));
  selectedTilesSource.value = listTilesParams[0];
}
</script>
