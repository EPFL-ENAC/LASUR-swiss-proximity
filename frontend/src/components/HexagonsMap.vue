<template>
  <canvas ref="canvas" :width="width" :height="height" class="backgroundMap">
  </canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineExpose, defineProps, watch, Ref } from "vue";

import {
  scaleThreshold,
  geoMercator,
  groups as d3groups,
  ZoomTransform,
  zoomIdentity,
  GeoProjection,
} from "d3";
import { cellToBoundary, cellToLatLng } from "h3-js";
import { Hexagon, DrawGroup } from "../models/h3";
import { hexagonsResolutions as resolutions } from "@/utils/map";
const canvas = ref();

const width = ref(0);
const height = ref(0);

const props = defineProps<{
  last_hexagon_res: number;
  resolutions_hexagons: Map<number, Hexagon[]>;
  scaleColor: (hex: Hexagon) => string;
}>();

const projection: Ref<GeoProjection> = ref(geoMercator());

const projectionCreated = ref(false);

const actualTransform = ref(zoomIdentity);

const scaleZoomToRes = scaleThreshold().domain([5, 10, 60]).range(resolutions);

const color_groups = ref(new Map<number, DrawGroup[]>());

function zoomed(transform: ZoomTransform) {
  actualTransform.value = transform;
  if (projection.value !== null) {
    const proj: GeoProjection = projection.value;
    const scale = proj.scale() * 2 * Math.PI;

    const [x, y] = (proj([0, 0]) as [number, number]).map((d: number) => -d);
    const newTransform = transform.scale(1 / scale).translate(x, y);
    draw(newTransform);
  }
}

function draw(transform: ZoomTransform) {
  const context = canvas.value.getContext("2d");
  context.save();
  context.clearRect(0, 0, width.value, height.value);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  const groups = color_groups.value.get(scaleZoomToRes(transform.k));
  if (groups) {
    for (let { color, path } of groups) {
      context.beginPath();
      context.fillStyle = color;
      context.fill(path);
    }
  }

  context.restore();
}

onMounted(() => {
  width.value = canvas.value.clientWidth;
  height.value = canvas.value.clientHeight;
});

watch(
  () => props.last_hexagon_res,
  async (last_hexagon_res: number) => {
    const hexagons = props.resolutions_hexagons.get(last_hexagon_res);
    if (!hexagons) return;
    console.log("HexagonsMap watched change in hexagons");

    if (!projectionCreated.value) createProjection(hexagons);

    prepareGroups();
    console.log("Finished watch callback on hexagons");
    zoomed(actualTransform.value);
  }
);

function pointsToPath(ptx: number[][], path = new Path2D()) {
  let points = ptx.map((d) => projection.value([d[0], d[1]])) as [
    number,
    number
  ][];
  const [x0, y0] = points[0];
  path.moveTo(x0, y0);
  for (let [x, y] of points) path.lineTo(x, y);
  path.lineTo(x0, y0);

  return path;
}

function createProjection(hexagons: Hexagon[]) {
  const coor = hexagons.map((d) => cellToLatLng(d.id).reverse());

  projection.value = geoMercator()
    .fitSize([width.value, height.value], {
      type: "MultiPoint",
      coordinates: coor,
    })
    .precision(0.3);
}

function prepareGroups() {
  for (let res of resolutions) {
    if (!color_groups.value.get(res)) {
      const resHexs = props.resolutions_hexagons.get(res);
      if (resHexs) {
        const group = d3groups(resHexs, props.scaleColor).map(
          ([color, hexagons]) => {
            let path = new Path2D();
            for (let hex of hexagons)
              pointsToPath(
                cellToBoundary(hex.id).map((d) => d.reverse()),
                path
              );
            return { color, path };
          }
        );
        // console.log(group);
        color_groups.value.set(res, group);
      }
    }
  }
}

defineExpose({ zoomed });
</script>

<style scoped>
.backgroundMap {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.6;
}
</style>
