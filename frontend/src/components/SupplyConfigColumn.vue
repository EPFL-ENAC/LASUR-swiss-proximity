<template>
  <v-card flat>
    <v-card-title>Offre de proximité :</v-card-title>

    <v-card-text>
      <div v-for="variable in variables" class="pb-2">
        <v-checkbox
          v-model="variable.selected"
          :label="variable.name"
          :key="variable.id"
          density="compact"
          hide-details
        />
        <v-row v-if="variable.selected" class="pl-7" align="center" no-gutters>
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

          <v-col cols="6"> <v-label>pondération</v-label> </v-col>
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
  </v-card>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import type { SupplyVariable } from "@/utils/variables";

const props = defineProps<{
  variables: SupplyVariable[];
}>();

const emits = defineEmits<{
  (event: "update:variables", variables: SupplyVariable[]): void;
}>();

watch(
  () => props.variables,
  (variables) => {
    emits("update:variables", variables);
  }
);
</script>

<!-- 
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
  </template> -->
