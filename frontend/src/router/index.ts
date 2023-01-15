import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Isochrones from "../views/IsochronesView.vue";
import DoubleMap from "../views/DoubleMapView.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
