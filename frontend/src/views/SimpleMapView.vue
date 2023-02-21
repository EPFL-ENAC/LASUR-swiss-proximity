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
    <v-row class="flex-grow-1">
      <v-col cols="3">
        <v-card flat>
          <v-card-title>Source</v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedTilesSource">
              <v-radio
                v-for="tilesParams in listTilesParams"
                class="variable"
                :key="tilesParams.name"
                :label="tilesParams.name"
                :value="tilesParams"
              >
              </v-radio> </v-radio-group
          ></v-card-text>
        </v-card>

        <v-divider></v-divider>
        <v-card flat>
          <v-card-title>Parameters</v-card-title>
          <template v-for="[category, variables] in groupedVariables.entries()">
            <v-card-subtitle>{{
              cleanVariableString(category)
            }}</v-card-subtitle>
            <v-card-text>
              <v-input
                v-for="variable in variables"
                :key="variable.name"
                hide-details
              >
                <v-row>
                  <v-col cols="7">
                    <v-checkbox
                      v-model="variable.selected"
                      :label="
                        cleanVariableString(
                          getVariableNameWithoutGroup(variable)
                        )
                      "
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
            </v-card-text>
          </template>

          <v-divider></v-divider>
          <v-card-actions>
            <v-btn @click="resetSessionStorage" variant="flat">
              Reset parameters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="9" class="pa-0">
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
import { ref, computed, watch } from "vue";
import {
  listPossibleVariables,
  listTilesParams,
  cleanVariableString,
  getVariableGroup,
  getVariableNameWithoutGroup,
} from "@/utils/variables";
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
