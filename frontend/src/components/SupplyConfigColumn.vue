<template>
  <v-card class="px-2 px-xl-3 px-xxl-6 py-2" flat>
    <v-card-title class="my-2"
      >Offre de proximité
      <info-tooltip>Basée sur les données OSM (juin 2023)</info-tooltip>
      <v-btn
        :icon="show ? mdiChevronUp : mdiChevronDown"
        @click="show = !show"
        flat
        density="compact"
      ></v-btn>
    </v-card-title>
    <template v-if="show">
      <v-card-text>
        <div v-for="variable in variables" class="pb-2">
          <v-checkbox
            v-model="variable.selected"
            :key="variable.id"
            density="compact"
            :disabled="isVariableDisabled(variable)"
            hide-details
          >
            <template v-slot:label>
              <div class="pl-1 font-weight-medium">
                {{ variable.name }}
              </div>
              <info-tooltip v-if="variable.infos.length > 0">{{
                variable.infos.join(", ")
              }}</info-tooltip>
            </template>
          </v-checkbox>

          <v-row
            v-if="variable.selected && !isVariableDisabled(variable)"
            class="pl-7"
            align="center"
            no-gutters
          >
            <v-col cols="6"> <v-label>diversité</v-label> </v-col>
            <v-col cols="6">
              <v-slider
                hide-details
                density="compact"
                track-size="1"
                thumb-size="10"
                :color="variable.selected ? 'black' : 'grey'"
                min="1"
                max="5"
                step="1"
                v-model="variable.diversity"
                thumb-label
              ></v-slider>
            </v-col>

            <v-col cols="6"> <v-label>poids</v-label> </v-col>
            <v-col cols="6">
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
        </div>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from "vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import type { SupplyVariable } from "@/utils/variables";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";

const props = defineProps<{
  variables: SupplyVariable[];
}>();

const emits = defineEmits<{
  (event: "update:variables", variables: SupplyVariable[]): void;
}>();

const show = ref(true);

const isAllSelected = computed(
  () => props.variables.find((variable) => variable.id === "All")?.selected
);

const isVariableDisabled = (variable: SupplyVariable) =>
  isAllSelected.value && variable.id !== "All";

watch(
  () => props.variables,
  (variables) => {
    emits("update:variables", variables);
  }
);
</script>
