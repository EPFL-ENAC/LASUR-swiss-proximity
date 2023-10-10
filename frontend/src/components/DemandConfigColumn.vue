<template>
  <v-card class="py-2" flat>
    <v-card-title>
      Demande de proximité :
      <info-tooltip>
        Basée sur le MNTP et les projections de l’ARE, DETEC
      </info-tooltip>
    </v-card-title>
    <v-card-title>
      Année
      <info-tooltip>
        Année de projection de la demande de déplacement.
      </info-tooltip>
    </v-card-title>
    <v-card-text>
      <v-select
        variant="outlined"
        class="pt-1"
        :model-value="yearSelected"
        @update:model-value="emits('update:yearSelected', $event)"
        :items="listYears"
    /></v-card-text>
    <v-card-title
      >Seuil de proximité
      <info-tooltip>
        Seuil de distance en dessous de laquelle un déplacement est “de
        proximité”. 1300m correspond environ à 15’ à pied, 3800m à 15’ à vélo et
        7000m 30’ à vélo.
      </info-tooltip>
    </v-card-title>
    <v-card-text>
      <v-select
        variant="outlined"
        class="pt-1"
        :model-value="distanceSelected"
        @update:model-value="emits('update:distanceSelected', $event)"
        :items="listDistances"
    /></v-card-text>
    <v-card-title>Mode de déplacement</v-card-title>
    <v-card-text>
      <v-checkbox
        v-for="variable in variables"
        v-model="variable.selected"
        :key="variable.id"
        density="compact"
        hide-details
      >
        <template v-slot:label>
          <div class="pl-1 font-weight-medium">{{ variable.name }}</div>
        </template>
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { TileParams, DemandVariable } from "@/utils/variables";
import InfoTooltip from "@/components/InfoTooltip.vue";
import { listYears, listDistances } from "@/utils/variables";
const props = defineProps<{
  variables: DemandVariable[];
  yearSelected: number;
  distanceSelected: number;
}>();

const emits = defineEmits<{
  (event: "update:variables", variables: DemandVariable[]): void;
  (event: "update:yearSelected", yearSelected: number): void;
  (event: "update:distanceSelected", distanceSelected: number): void;
}>();

watch(
  () => props.yearSelected,
  (yearSelected) => emits("update:yearSelected", Number(yearSelected))
);

watch(
  () => props.distanceSelected,
  (distanceSelected) =>
    emits("update:distanceSelected", Number(distanceSelected))
);

watch(
  () => props.variables,
  (variables) => {
    emits("update:variables", variables);
  }
);
</script>
