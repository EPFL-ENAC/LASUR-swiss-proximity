// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/doublemap",
  },
  {
    path: "/simplemap",
    name: "Simple map",
    component: () => import("@/views/SimpleMapView.vue"),
  },
  {
    path: "/doublemap",
    name: "Double map",
    component: () => import("@/views/DoubleMapView.vue"),
  },
  {
    path: "/isochrones",
    name: "Isochrones map",
    component: () => import("@/views/IsochronesView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
