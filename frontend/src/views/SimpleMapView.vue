<template>
  <v-container
    class="d-flex fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row class="flex-grow-0 no-gutters">
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1" no-gutters>
      <v-col cols="2">
        <ProximityConfigColumn
          v-if="!isDemand"
          v-model:variables="variables"
          :tiles-sources="listTilesParams"
          v-model:selected-tiles-source="selectedTilesSource"
          :on-reset-session-storage="resetSessionStorage"
        >
        </ProximityConfigColumn>
        <DemandConfigColumn
          v-else
          v-model:variables="variables"
          :tiles-sources="listTilesParams"
          v-model:year-selected="selectedYear"
          v-model:distance-selected="selectedDistance"
          :on-reset-session-storage="resetSessionStorage"
        >
        </DemandConfigColumn>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="10" class="pa-0">
        <VectorsMap
          :variables="selectedVariables"
          :list-tiles-params="listTilesParams"
          :selected-tiles-name="selectedTilesSource.name"
          :colors="isDemand ? demandColors : proximityTripColors"
          :year="selectedYear"
          :distance="selectedDistance"
          :has-geocoder-search="true"
        ></VectorsMap>

        <v-switch
          v-model="isDemand"
          class="overmap-switch"
          hide-details
          inset
          :label="`${isDemand ? 'Demande' : 'Offre'}`"
        ></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import VectorsMap from "@/components/VectorsMap.vue";
import ProximityConfigColumn from "@/components/ProximityConfigColumn.vue";
import { ref, computed, watch } from "vue";
import {
  demandColors,
  listDistances,
  listPossibleVariablesDemand,
  listTilesParams,
  listYears,
  proximityTripColors,
} from "@/utils/variables";
import type { TileParams, ProximityVariable, MapType } from "@/utils/variables";
import DemandConfigColumn from "@/components/DemandConfigColumn.vue";

const storageMapTypeSource = "selectedMapType",
  storageItemMapType = sessionStorage.getItem(storageMapTypeSource),
  savedMapType: MapType = storageItemMapType
    ? (storageItemMapType as MapType)
    : "demand";

const selectedMapType = ref(savedMapType);
const isDemand = computed({
  get() {
    return selectedMapType.value === "demand";
  },
  set(value) {
    selectedMapType.value = value ? "demand" : "supply";
  },
});

const listVariables = listPossibleVariablesDemand;

const defaultVariables: ProximityVariable[] = listVariables.map(
  ({ id, name }) =>
    isDemand
      ? {
          id,
          name,
          weight: 1,
          selected: id == "All_modes",
        }
      : {
          id,
          name,
          weight: 1,
          selected: true,
        }
);

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

const storageYearSource = "selectedYear",
  storageItemYear = sessionStorage.getItem(storageYearSource),
  savedYear = storageItemYear ? Number(storageItemYear) : listYears[0];

const selectedYear = ref(savedYear);

const storageDistanceSource = "selectedDistance",
  storageItemDistance = sessionStorage.getItem(storageDistanceSource),
  savedDistance = storageItemDistance
    ? Number(storageItemDistance)
    : listDistances[0];

const selectedDistance = ref(savedDistance);

watch(selectedTilesSource, (newTilesSource) =>
  sessionStorage.setItem(storageKeyTilesSource, JSON.stringify(newTilesSource))
);
watch(selectedDistance, (newDistance) =>
  sessionStorage.setItem(storageDistanceSource, newDistance.toString())
);
watch(selectedYear, (newYear) =>
  sessionStorage.setItem(storageYearSource, newYear.toString())
);
watch(selectedVariables, () =>
  sessionStorage.setItem(storageKeyVariables, JSON.stringify(variables.value))
);

function resetSessionStorage() {
  variables.value = JSON.parse(JSON.stringify(defaultVariables));
  selectedTilesSource.value = listTilesParams[0];
  selectedDistance.value = listDistances[0];
  selectedYear.value = listYears[0];
}
</script>

<style scoped lang="scss">
.overmap-switch {
  position: absolute;
  bottom: 1em;
  padding: 0.3em 2em;
  border-radius: 1em;
  min-width: 12.2em;
  left: 50vw;
  z-index: 1000;
  background-color: white;
  outline: solid 2px;
}
</style>
