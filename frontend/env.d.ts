/// <reference types="vite/client" />

declare module "@maplibre/maplibre-gl-geocoder";
declare module "*.md" {
  import type { ComponentOptions } from "vue";

  const Component: ComponentOptions;
  export default Component;
}
