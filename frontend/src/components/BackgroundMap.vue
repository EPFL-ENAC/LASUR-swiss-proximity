<template>
  <svg ref="svg" :viewBox="viewbox" class="backgroundMap">
    <g id="layers" pointer-events="none"></g>
  </svg>
</template>

<script setup>
import { ref, onMounted, defineExpose, computed } from "vue";

import { tile as d3tile, tileWrap as d3tileWrap } from "d3-tile";
import { select as d3select } from "d3";

const svg = ref(null);

const width = ref(0);
const height = ref(0);

const viewbox = computed(() => `0,0,${width.value},${height.value}`);

const tile = ref(null);
const deltas = ref([-4, -1, 0]);

const levels = ref();

const url = (x, y, z) =>
  `https://cartodb-basemaps-1.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

function zoomed(transform) {
  // console.log("Zoomed", transform);
  levels.value.each(function (delta) {
    const tiles = tile.value.zoomDelta(delta)(transform);
    // console.log(delta, transform, tiles);

    d3select(this)
      .selectAll("image")
      .data(tiles, (d) => d)
      .join("image")
      .attr("xlink:href", (d) => url(...d3tileWrap(d)))
      .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
      .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
      .attr("width", tiles.scale)
      .attr("height", tiles.scale);
  });
}

onMounted(() => {
  width.value = svg.value.clientWidth;
  height.value = svg.value.clientHeight;

  tile.value = d3tile().size([width.value, height.value]).tileSize(512);

  levels.value = d3select("#layers")
    .selectAll("g")
    .data(deltas.value)
    .join("g");
  // .attr("id", (d) => `layer_${d}`);
});

defineExpose({ zoomed, deltas });
</script>

<style scoped>
.backgroundMap {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 1;
}
</style>
