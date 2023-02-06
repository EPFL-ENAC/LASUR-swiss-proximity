<template>
  <v-container
    class="d-flex fill-height pa-0 align-stretch flex-column flex-nowrap"
    fluid
  >
    <v-row class="shrink no-gutters">
      <v-col cols="12">
        <v-container fluid>
          <h1>Maplibre prototype</h1>
          <span class="text-subtitle-1">
            Using MaplibreGL and vector tiles</span
          >
        </v-container>

        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row class="grow no-gutters ma-0">
      <v-col cols="3">
        <v-container fluid>
          <v-select
            v-model="selectedTransportMode"
            :items="listTransportModes"
            item-text="name"
            return-object
            label="Transport mode"
          ></v-select>
        </v-container>
      </v-col>
      <v-divider vertical></v-divider>

      <v-col cols="9" class="pa-0">
        <v-container
          class="d-flex pb-4 pa-0 fill-height align-stretch flex-column flex-nowrap"
          fluid
        >
          <v-row class="grow">
            <v-col cols="12">
              <IsochronesMap
                :selected-transport-mode="selectedTransportMode.profile"
              ></IsochronesMap>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="shrink">
            <v-col cols="12">
              <v-container fluid>
                <h4>Légende</h4>
                Suspendisse potenti. In et dolor faucibus, elementum est nec,
                lobortis velit. Aenean blandit sapien sed urna pellentesque, at
                lacinia erat facilisis. Morbi vestibulum, mauris id pellentesque
                iaculis, tellus sapien varius quam, vel interdum tellus diam at
                velit. Donec lectus dui, lobortis quis dapibus in, euismod id
                ex. Donec lorem justo, elementum sit amet magna non, congue
                venenatis orci. Aenean eu tristique urna. Quisque et fermentum
                nisl. Mauris sit amet tellus sed nunc fermentum luctus a ac
                mauris. Cras tortor justo, blandit sed diam eu, imperdiet
                tristique dui. Suspendisse consectetur mauris neque, ac
                fringilla tortor auctor ac. Mauris vitae magna cursus, molestie
                ante vitae, facilisis augue.
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import IsochronesMap from "@/components/IsochronesMap.vue";
import { ref } from "vue";

import { listTransportModes } from "@/utils/isochrone";

const selectedTransportMode = ref(
  listTransportModes.find((t) => t.name === "Public transport") ||
    listTransportModes[0]
);
</script>

<style scoped>
.variable :deep(input) {
  margin-right: 12px;
  text-align: right;
}

.selector-column {
  width: 400px;
}
</style>
