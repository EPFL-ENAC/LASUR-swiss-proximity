<template>
  <v-container
    class="d-flex fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row no-gutters class="flex-grow-0">
      <v-col>
        <v-card flat>
          <v-card-title>Comparaison de l'offre et de la demande</v-card-title>
          <v-card-text>
            A gauche une carte explorant l'offre selon les variables, et leur
            poids, choisies dans la colonne de gauche. A droite une carte de la
            demande.
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1" no-gutters>
      <v-col cols="2" height="100%">
        <v-card flat>
          <v-card-title>Parameters</v-card-title>
          <v-card-text>
            <v-card-title class="text-subtitle-1 px-0 pt-4 pb-0"
              >Source</v-card-title
            >

            <v-radio-group hide-details v-model="selectedTilesSource">
              <v-radio
                v-for="tilesParams in listTilesParams"
                class="variable"
                :key="tilesParams.name"
                :label="tilesParams.name"
                :value="tilesParams"
                density="compact"
              >
              </v-radio>
            </v-radio-group>

            <template
              v-for="[category, variables] in groupedVariables.entries()"
            >
              <v-card-title class="text-subtitle-1 px-0 pt-4 p">
                {{ cleanVariableString(category) + " weights" }}
              </v-card-title>

              <template v-for="variable in variables">
                <v-row align="center" class="my-1" no-gutters>
                  <v-col class="d-flex" cols="7">
                    <v-checkbox-btn
                      v-model="variable.selected"
                      hide-details
                      density="compact"
                      class="text-body-2"
                    >
                    </v-checkbox-btn>
                    <v-label>
                      {{
                        cleanVariableString(
                          getVariableNameWithoutGroup(variable)
                        )
                      }}
                    </v-label>
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
              </template>
            </template>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn @click="resetSessionStorage" variant="flat">
              Reset parameters
            </v-btn>
          </v-card-actions>
        </v-card>
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
  getVariableGroup,
  getVariableNameWithoutGroup,
} from "@/utils/variables";
import type { TileParams, ProximityVariable } from "@/utils/variables";
import type { Map as MaplibreMap } from "maplibre-gl";
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

const groupedVariables = computed(() =>
  variables.value.reduce((group, variable) => {
    const category = getVariableGroup(variable);
    if (group.has(category)) group.get(category).push(variable);
    else group.set(category, [variable]);

    return group;
  }, new Map())
);

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

const leftMap = ref<MaplibreMap>();
const rightMap = ref<MaplibreMap>();

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
