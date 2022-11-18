<template>
  <canvas ref="canvas" :width="width" :height="height" class="backgroundMap">
  </canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineExpose, defineProps, watch, Ref } from "vue";

import {
  scaleQuantize,
  scaleThreshold,
  extent,
  geoMercator,
  mean,
  groups as d3groups,
  ZoomTransform,
  zoomIdentity,
  GeoProjection,
} from "d3";
import { cellToBoundary, cellToParent, cellToLatLng } from "h3-js";

type Hexagon = {
  id: string;
  amenity: number;
  transit: number;
};

type DrawHexagon = {
  points: [number, number][];
  colorAmenity: string;
  colorTransit: string;
};

type DrawGroup = {
  color: string;
  path: Path2D;
};

const canvas = ref();

const width = ref(0);
const height = ref(0);

const props = defineProps(["hexagons"]);

const projection: Ref<GeoProjection> = ref(geoMercator());

const actualTransform = ref(zoomIdentity);

const resolutions = [6];
const scaleZoomToRes = scaleThreshold().domain([5, 10, 60]).range(resolutions);

const levels_hexagons = ref(new Map<number, Hexagon & DrawHexagon[]>());
const hexagons_groups_amenity = ref(new Map<number, DrawGroup[]>());

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

function zoomed(transform: ZoomTransform) {
  actualTransform.value = transform;
  if (projection.value !== null) {
    const proj: GeoProjection = projection.value;
    const scale = proj.scale() * 2 * Math.PI;

    // console.log(
    //   "Hexagons map zoomed",
    //   projection.value.scale,
    //   scale,
    //   transform,
    //   props.hexagons
    // );
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

  // console.log(
  //   hexagons_groups_amenity.value,
  //   transform.k,
  //   transform,
  //   scaleZoomToRes(transform.k)
  // );

  const groups = hexagons_groups_amenity.value.get(scaleZoomToRes(transform.k));
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
  //   console.log("Mounted hexagons map", props.hexagons);
});

watch(
  () => props.hexagons,
  async (hexagons: Hexagon[]) => {
    if (hexagons.length === 0) return;

    console.log("HexagonsMap watched change in hexagons");

    const amenityValues: number[] = hexagons.map((d) => d.amenity),
      transitValues: number[] = hexagons.map((d) => d.transit),
      domainAmenity = extent(amenityValues) as [number, number],
      domainTransit = extent(transitValues) as [number, number];

    const scaleColorAmenity = scaleQuantize<string, never>()
      .domain(domainAmenity)
      .range(colors);

    const scaleColorTransit = scaleQuantize<string, never>()
      .domain(domainTransit)
      .range(colors);

    const coor = hexagons.map((d) => cellToLatLng(d.id).reverse());

    projection.value = geoMercator()
      .fitSize([width.value, height.value], {
        type: "MultiPoint",
        coordinates: coor,
      })
      .precision(0.3);

    prepareLevelsHexagons(scaleColorAmenity, scaleColorTransit);

    for (let res of resolutions) {
      const resHexs = levels_hexagons.value.get(res);
      if (resHexs) {
        const group = d3groups(resHexs, (d) => d.colorAmenity).map(
          ([color, hexagons]) => {
            let path = new Path2D();
            for (let hex of hexagons) pointsToPath(hex.points, path);
            return { color, path };
          }
        );
        // console.log(group);
        hexagons_groups_amenity.value.set(res, group);
      }
    }
    console.log("Finished watch callback on hexagons");
    zoomed(actualTransform.value);
  }
);

function pointsToPath(ptx: [number, number][], path = new Path2D()) {
  let points = ptx.map((d) => projection.value(d)) as [number, number][];
  const [x0, y0] = points[0];
  path.moveTo(x0, y0);
  for (let [x, y] of points) path.lineTo(x, y);
  path.lineTo(x0, y0);

  return path;
}

function convertToDraw(
  hex: Hexagon,
  scaleColorAmenity: (amenity: number) => string,
  scaleColorTransit: (transit: number) => string
) {
  return Object.assign({}, hex, {
    points: cellToBoundary(hex.id).map((d) => d.reverse()),
    colorTransit: scaleColorTransit(hex.transit),
    colorAmenity: scaleColorAmenity(hex.amenity),
  }) as Hexagon & DrawHexagon;
}

function prepareLevelsHexagons(
  scaleColorAmenity: (amenity: number) => string,
  scaleColorTransit: (transit: number) => string
) {
  for (let res of resolutions) {
    const layer = new Map();
    // const number_division = 7 ** (9 - res);

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
      hexs.map(convertToDraw, scaleColorAmenity, scaleColorTransit)
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
