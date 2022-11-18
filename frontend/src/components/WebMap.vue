<template>
  <div id="webmap" ref="container" class="full-height map">
    <BackgroundMapVue ref="background"></BackgroundMapVue>
    <HexagonsMapVue :hexagons="hexagons" ref="hexagonsmap"></HexagonsMapVue>
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import BackgroundMapVue from "./BackgroundMap.vue";
import HexagonsMapVue from "./HexagonsMap.vue";
import {
  zoom as d3zoom,
  select as d3select,
  zoomIdentity as d3zoomIdentity,
  csv as d3csv,
  ZoomTransform,
} from "d3";

const loading = ref(true);

const container = ref();
const background = ref();
const hexagonsmap = ref();

const center = [-837, 9380];
const scale = 61878;

const zoom = ref(
  d3zoom()
    .scaleExtent([scale >> 3, scale << 7])
    // .extent([
    //   [0, 0],
    //   [width, height],
    // ])
    .on("zoom.render", (event) => zoomed(event.transform))
    .on("end.render", (event) => zoomed(event.transform))
);

const width = ref(0);
const height = ref(0);

const hexagons = ref([]);

function zoomed(transform: ZoomTransform) {
  background.value.zoomed(transform);
  hexagonsmap.value.zoomed(transform);
}

// watch(hexagons, (newHex) => {
//   console.log(newHex);
// });

onMounted(() => {
  width.value = container.value["clientWidth"] | 0;
  height.value = container.value["clientHeight"] | 0;

  // console.log(width.value, height.value, container.value);

  d3select(container.value)
    .call(zoom.value)
    .call(
      zoom.value.transform,
      d3zoomIdentity.translate(-828, 8730).scale(57494)
    );

  console.log("Start fetch");
  d3csv("/hex.csv").then((data) => {
    console.log("Data fetched");
    loading.value = false;
    hexagons.value = data as unknown as never[];
    console.log("Hexagons.value changed");
  });
});
</script>

<style scoped>
.map {
  min-height: 800px;
  width: 100%;
  position: relative;
}
</style>
