<template>
  <v-app>
    <v-app-bar app dense>
      <v-app-bar-title>SWISS MOBILITY</v-app-bar-title>
      <v-tabs>
        <v-tab to="/doublemap">Double</v-tab>
        <v-tab to="/singlemap">Single</v-tab>
        <v-tab to="/vectortilemap">Vector tiles</v-tab>
        <v-tab to="/about">A propos</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  overflow: unset;
}
</style>
