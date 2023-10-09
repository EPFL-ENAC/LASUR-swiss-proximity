<template>
  <v-card flat>
    <v-card-title>Demande de proximité :</v-card-title>
    <v-card-title>Année</v-card-title>
    <v-card-text>
      <v-select
        :model-value="yearSelected"
        @update:model-value="emits('update:yearSelected', $event)"
        :items="listYears"
    /></v-card-text>
    <v-card-title>Seuil de proximité</v-card-title>
    <v-card-text>
      <v-select
        :model-value="distanceSelected"
        @update:model-value="emits('update:distanceSelected', $event)"
        :items="listDistances"
    /></v-card-text>
    <v-card-title>Mode de déplacement</v-card-title>
    <v-card-text>
      <v-checkbox
        v-for="variable in variables"
        v-model="variable.selected"
        :label="variable.name"
        :key="variable.id"
        density="compact"
        hide-details
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { TileParams, DemandVariable } from "@/utils/variables";

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
