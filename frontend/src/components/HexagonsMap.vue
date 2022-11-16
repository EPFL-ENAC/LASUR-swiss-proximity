<template>
  <canvas ref="canvas" :width="width" :height="height" class="backgroundMap">
  </canvas>
</template>

<script setup>
import { ref, onMounted, defineExpose, defineProps, watch } from "vue";

import {
  scaleQuantize,
  scaleThreshold,
  extent,
  geoMercator,
  mean,
  groups as d3groups,
} from "d3";
import { cellToBoundary, cellToParent, cellToLatLng } from "h3-js";

const canvas = ref();

const width = ref(0);
const height = ref(0);

const props = defineProps(["hexagons"]);

const projection = ref(null);

const hex = ref([]);

const resolutions = [6, 7, 8];
const scaleZoomToRes = scaleThreshold().domain([5, 10, 60]).range(resolutions);

const levels_hexagons = ref(new Map());
const hexagons_groups_amenity = ref(new Map());

const colors = [
  "#1a9850",
  "#66bd63",
  "#a6d96a",
  "#d9ef8b",
  "#ffffbf",
  "#fee08b",
  "#fdae61",
  "#f46d43",
  "#d73027",
];

function zoomed(transform) {
  if (projection.value) {
    const scale = projection.value.scale() * 2 * Math.PI;

    console.log(
      "Hexagons map zoomed",
      projection.value.scale,
      scale,
      transform,
      props.hexagons
    );
    const newTransform = transform
      .scale(1 / scale)
      .translate(...projection.value([0, 0]).map((d) => -d));
    draw(newTransform);
  }
}

function draw(transform) {
  const context = canvas.value.getContext("2d");
  context.save();
  context.clearRect(0, 0, width.value, height.value);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  console.log(
    hexagons_groups_amenity.value,
    transform.k,
    transform,
    scaleZoomToRes(transform.k)
  );

  for (let { color, path } of hexagons_groups_amenity.value.get(
    scaleZoomToRes(transform.k)
  )) {
    context.beginPath();

    context.fillStyle = color;
    context.fill(path);
  }

  context.globalAlpha = 0.2;
  context.lineWidth = 5 / transform.k;

  context.restore();
}

onMounted(() => {
  width.value = canvas.value.clientWidth;
  height.value = canvas.value.clientHeight;
  //   console.log("Mounted hexagons map", props.hexagons);
});

watch(props, () => {
  const amenityValues = props.hexagons.map((d) => d.amenity),
    transitValues = props.hexagons.map((d) => d.transit);

  const scaleColorAmenity = scaleQuantize()
    .domain(extent(amenityValues))
    .range(colors);

  const scaleColorTransit = scaleQuantize()
    .domain(extent(transitValues))
    .range(colors);

  const coor = props.hexagons.map(({ id }) => cellToLatLng(id).reverse());

  projection.value = geoMercator()
    .fitSize([width.value, height.value], {
      type: "MultiPoint",
      coordinates: coor,
    })
    .precision([0.3]);

  prepareLevelsHexagons(scaleColorAmenity, scaleColorTransit);

  for (let res of resolutions) {
    const group = d3groups(
      levels_hexagons.value.get(res),
      (d) => d.colorAmenity
    ).map(([color, hexagons]) => {
      let path = new Path2D();
      for (let hex of hexagons) pointsToPath(hex.points, path);
      return { color, path };
    });
    console.log(group);
    hexagons_groups_amenity.value.set(res, group);
  }
});

function pointsToPath(ptx, path = new Path2D()) {
  let points = ptx.map((d) => projection.value(d));
  path.moveTo(...points[0]);
  for (let [x, y] of points) path.lineTo(x, y);
  path.lineTo(...points[0]);

  return path;
}

function prepareLevelsHexagons(scaleColorAmenity, scaleColorTransit) {
  for (let res of resolutions) {
    const layer = new Map();
    const number_division = 7 ** (9 - res);
    let hexs = [];
    if (res !== 9) {
      for (const h of props.hexagons) {
        const parentID = cellToParent(h.id, res);
        let parent = layer.get(parentID);
        if (!parent) {
          parent = { amenity: [], transit: [] };
          layer.set(parentID, parent);
        }
        parent.amenity.push(h.amenity);
        parent.transit.push(h.transit);
      }

      hexs = [...layer.entries()].map(([id, d]) =>
        Object.assign({ id }, d, {
          amenity: mean(d.amenity),
          transit: mean(d.transit),
        })
      );
    } else {
      hexs = props.hexagons;
    }

    levels_hexagons.value.set(
      res,
      hexs.map((d) =>
        Object.assign({}, d, {
          points: cellToBoundary(d.id).map((d) => d.reverse()),
          colorTransit: scaleColorTransit(d.transit),
          colorAmenity: scaleColorAmenity(d.amenity),
        })
      )
    );
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
