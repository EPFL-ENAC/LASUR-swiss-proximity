<template>
  <v-app>
    <v-toolbar flat color="white" app>
      <v-toolbar-title max-width="300px">SWISS PROXIMITY</v-toolbar-title>
      <v-tabs class="flex-grow-1 flex-shrink-0 px-10" align-tabs="center" grow>
        <v-tab to="/simplemap">Simple</v-tab>
        <v-tab to="/doublemap">Double</v-tab>
        <v-tab to="/isochrones">Isochrones</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn @click="openInfos"> Infos </v-btn>
      <v-btn @click="openWelcome"> Welcome </v-btn>
    </v-toolbar>
    <v-main>
      <router-view></router-view>
      <simple-dialog v-model:open="openedInfo" button-text="Fermer">
        <info-dialog></info-dialog>
      </simple-dialog>
      <simple-dialog
        v-model:open="openedWelcome"
        storageKey="welcomeDialog"
        button-text="Commencer"
      >
        <welcome-dialog></welcome-dialog>
      </simple-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SimpleDialog from "@/components/SimpleDialog.vue";
import WelcomeDialog from "@/components/WelcomeDialog.vue";
import InfoDialog from "@/components/InfoDialog.vue";
import { ref } from "vue";

const openedInfo = ref(false);
const openedWelcome = ref(false);

const openInfos = () => {
  openedInfo.value = true;
  openedWelcome.value = false;
};
const openWelcome = () => {
  openedWelcome.value = true;
  openedInfo.value = false;
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  overflow: unset;
}
</style>
