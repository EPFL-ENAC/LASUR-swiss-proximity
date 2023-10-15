<template>
  <v-container
    class="fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row class="flex-shrink-1 flex-grow-0">
      <v-col>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1 no-gutters ma-0">
      <v-col cols="3">
        <v-card flat>
          <v-card-title>Carte des isochrones</v-card-title>
          <v-card-text>
            (En cours de développement) Visualiser le temps nécessaire pour se
            déplacer depuis un point donné en fonction du mode de transport, que
            ce soit à pied, en voiture, à vélo (et bientôt en transport
            public!). La carte affiche aussi les arrêts de transport public.
          </v-card-text>
          <v-card-title>Type de transport</v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedTransportMode">
              <v-radio
                v-for="transportMode in listTransportModes"
                class="variable"
                :key="transportMode.name"
                :label="transportMode.name"
                :value="transportMode"
              >
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>

      <v-col cols="9" class="pa-0">
        <IsochronesMap
          :selected-transport-mode="selectedTransportMode.profile"
        ></IsochronesMap>
        <legend-map :colors="isochroneColors" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import IsochronesMap from "@/components/IsochronesMap.vue";
import { ref, watch } from "vue";

import { listTransportModes } from "@/utils/isochrone";
import type { TransportMode } from "@/utils/isochrone";
import LegendMap from "@/components/LegendMap.vue";
import { isochroneColors } from "@/utils/map";

const storageKeyTransportMode = "selectedTransportMode";

const storageItem = sessionStorage.getItem(storageKeyTransportMode),
  savedTransportMode = storageItem
    ? (JSON.parse(storageItem) as TransportMode)
    : listTransportModes.find((t) => t.name === "Public transport") ||
      listTransportModes[0];

const selectedTransportMode = ref(savedTransportMode);

watch(selectedTransportMode, (newTransportMode) => {
  sessionStorage.setItem(
    storageKeyTransportMode,
    JSON.stringify(newTransportMode)
  );
});
</script>

<style scoped>
.variable :deep(input) {
  margin-right: 12px;
  text-align: right;
}
</style>
