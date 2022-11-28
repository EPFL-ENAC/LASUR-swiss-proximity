<template>
  <div ref="container" class="full-height map">
    <BackgroundMapVue ref="background"></BackgroundMapVue>
    <HexagonsMapVue
      :resolutions_hexagons="resolutions_hexagons"
      :resolutions="resolutions"
      :last_hexagon_res="last_hexagon_res"
      :scale-color="props.scaleColor"
      ref="hexagonsmap"
    ></HexagonsMapVue>
    <v-progress-linear :active="loading" indeterminate></v-progress-linear>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  Ref,
  defineProps,
  defineEmits,
  computed,
  watch,
} from "vue";
import BackgroundMapVue from "./BackgroundMap.vue";
import HexagonsMapVue from "./HexagonsMap.vue";
import { Hexagon } from "../models/h3";
import { parse as Papaparse, ParseResult } from "papaparse";
import { zoom as d3zoom, select as d3select, ZoomTransform } from "d3";

import { hexagonsResolutions as resolutions, scale } from "@/utils/map";

const loading = ref(true);

const container = ref();
const background = ref();
const hexagonsmap = ref();

const props = defineProps<{
  scaleColor: (hex: Hexagon) => string;
  transform: ZoomTransform;
}>();

const emit = defineEmits<{
  (event: "update:transform", value: ZoomTransform): void;
}>();

const width = ref(0);
const height = ref(0);

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

const last_hexagon_res: Ref<number> = ref(0);
const resolutions_hexagons: Ref<Map<number, Hexagon[]>> = ref(new Map());

const transformSync = computed({
  get() {
    return props.transform;
  },
  set(value) {
    emit("update:transform", value);
  },
});

watch(
  () => props.transform,
  (newTransform) => zoomed(newTransform)
);

function zoomed(transform: ZoomTransform) {
  transformSync.value = transform;
  background.value.zoomed(transform);
  hexagonsmap.value.zoomed(transform);
}

onMounted(() => {
  width.value = container.value["clientWidth"] | 0;
  height.value = container.value["clientHeight"] | 0;

  // console.log(width.value, height.value, container.value);

  d3select(container.value)
    .call(zoom.value)
    .call(zoom.value.transform, transformSync.value);

  console.log("Start fetch");
  for (const res of resolutions) {
    Papaparse(`/hexagons/hexagons_${res}.csv`, {
      // worker: t  rue,
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (results: ParseResult<Hexagon>) {
        console.log("Parsing completed res", res);
        resolutions_hexagons.value.set(res, results.data);
        loading.value = false;
        last_hexagon_res.value = res;
        console.log("Hexagons.value changed");
      },
    });
  }
});
</script>

<style scoped>
.map {
  min-height: 1000px;
  width: 100%;
  position: relative;
}
</style>
