<template>
  <v-container
    class="d-flex fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row class="flex-grow-0 no-gutters">
      <v-col cols="12">
        <v-container fluid>
          <h1>Comparaison de l'offre et de la demande</h1>
          <span class="text-subtitle-1">
            A gauche une carte explorant l'offre selon les variables, et leur
            poids, choisies dans la colonne de gauche. A droite une carte de la
            demande.
          </span>
        </v-container>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1 no-gutters ma-0">
      <v-col cols="2">
        <v-container>
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
        </v-container>

        <v-divider></v-divider>
        <v-container>
          <v-input
            v-for="variable in variables"
            class="my-2"
            :key="variable.name"
            hide-details
          >
            <v-row>
              <v-col cols="7">
                <v-checkbox
                  v-model="variable.selected"
                  :label="cleanVariableString(variable.name)"
                  hide-details
                  class="ma-auto"
                  density="compact"
                ></v-checkbox>
              </v-col>

              <v-col cols="5">
                <v-slider
                  hide-details
                  density="compact"
                  track-size="1"
                  thumb-size="10"
                  :color="variable.selected ? 'black' : 'grey'"
                  min="0"
                  max="1"
                  step="0.25"
                  v-model="variable.weight"
                  thumb-label
                ></v-slider>
              </v-col>
            </v-row>
          </v-input>
        </v-container>
        <v-divider></v-divider>
        <v-container>
          <v-btn @click="resetSessionStorage" variant="flat">
            Reset parameters
          </v-btn>
        </v-container>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="5" class="pa-0">
        <VectorsMap
          class="left-map"
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :has-geocoder-search="false"
          @created:map="leftMap = $event"
        ></VectorsMap>
      </v-col>
      <v-divider vertical></v-divider>

      <v-col cols="5" class="pa-0">
        <VectorsMap
          class="right-map"
          :variables="[selectedControlVariable]"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          @created:map="rightMap = $event"
        ></VectorsMap>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import VectorsMap from "@/components/VectorsMap.vue";
import { ref, computed, watch } from "vue";
import {
  listPossibleVariables,
  listTilesParams,
  cleanVariableString,
} from "@/utils/variables";
import type { TileParams, ProximityVariable } from "@/utils/variables";
import type { Map } from "maplibre-gl";
import { syncMaps } from "@/utils/syncmap";

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

//For the time being, arbitrarily choose last variable as control variable
const selectedControlVariable = {
  name: listVariables[listVariables.length - 1],
  weight: 1,
  selected: true,
};

const leftMap = ref<Map>();
const rightMap = ref<Map>();

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

watch(
  () => ({ leftMap: leftMap.value, rightMap: rightMap.value }),
  ({ leftMap, rightMap }) => {
    if (leftMap !== undefined && rightMap !== undefined) {
      syncMaps([leftMap, rightMap]);
    }
  }
);
</script>
