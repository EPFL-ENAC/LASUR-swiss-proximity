import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Isochrones from "../views/IsochronesView.vue";
import DoubleMap from "../views/DoubleMapView.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/doublemap",
  },
  {
    path: "/doublemap",
    name: "Double map",
    component: DoubleMap,
  },
  {
    path: "/isochrones",
    name: "Isochrones map",
    component: Isochrones,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
