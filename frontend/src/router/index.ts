import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SingleMap from "../views/SingleMap.vue";
import DoubleMap from "../views/DoubleMap.vue";
import VectorTileMap from "../views/VectorTileMap.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/singlemap",
    name: "Single map",
    component: SingleMap,
  },
  {
    path: "/doublemap",
    name: "Double map",
    component: DoubleMap,
  },
  {
    path: "/vectortilemap",
    name: "Vector tiles map",
    component: VectorTileMap,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
