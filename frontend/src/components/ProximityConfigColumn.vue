<template>
  <v-card flat>
    <v-card-title>Parameters</v-card-title>
    <v-card-text>
      <v-card-title class="text-subtitle-1 px-0 pt-4 pb-0">Source</v-card-title>

      <v-radio-group
        hide-details
        :model-value="selectedTilesSource"
        @update:model-value="emits('update:selectedTilesSource', $event)"
      >
        <v-radio
          v-for="tilesParams in tilesSources"
          class="variable"
          :key="tilesParams.name"
          :label="tilesParams.name"
          :value="tilesParams"
          density="compact"
        >
        </v-radio>
      </v-radio-group>

      <template v-for="[category, variables] in groupedVariables.entries()">
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
                {{ cleanVariableString(getVariableNameWithoutGroup(variable)) }}
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
      <v-btn @click="onResetSessionStorage" variant="flat">
        Reset parameters
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import {
  cleanVariableString,
  getVariableGroup,
  getVariableNameWithoutGroup,
} from "@/utils/variables";
import type { TileParams, ProximityVariable } from "@/utils/variables";

const props = defineProps<{
  variables: ProximityVariable[];
  tilesSources: TileParams[];
  selectedTilesSource: TileParams;
  onResetSessionStorage: () => void;
}>();

const emits = defineEmits<{
  (event: "update:variables", variables: ProximityVariable[]): void;
  (event: "update:selectedTilesSource", selectedTilesSource: TileParams): void;
}>();

watch(
  () => props.variables,
  (variables) => {
    emits("update:variables", variables);
  }
);

const groupedVariables = computed(() =>
  props.variables.reduce((group, variable) => {
    const category = getVariableGroup(variable);
    if (group.has(category)) group.get(category).push(variable);
    else group.set(category, [variable]);

    return group;
  }, new Map())
);
</script>
