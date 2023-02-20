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
      <v-btn @click="openDialog"> Infos </v-btn>
    </v-toolbar>
    <v-main>
      <router-view></router-view>
      <simple-dialog v-model:open="open" button-text="Commencer">
        <h1>Bienvenue sur Swiss Proximity ! __________________</h1>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id diam
          nulla. Morbi id mauris in magna mattis ullamcorper. In id finibus
          eros, at blandit neque. Duis sed erat porttitor, laoreet nisl nec,
          sodales dui. Vivamus vitae ligula dignissim, venenatis enim eu,
          maximus odio. Praesent semper sem sit amet lacus tincidunt, et
          fringilla ipsum malesuada. Integer congue diam nulla. Vivamus in
          egestas turpis. Praesent convallis tellus eget ipsum faucibus auctor.
          Duis ipsum massa, vehicula ut dapibus a, viverra vel arcu. Fusce sit
          amet commodo metus. Vestibulum tincidunt, ex congue malesuada
          malesuada, quam lectus elementum velit, non gravida augue magna
          convallis metus.
        </p>
        <h2>C’est quoi ?</h2>
        <p>
          Nullam consequat bibendum volutpat. Vivamus laoreet lectus consequat,
          suscipit ipsum quis, auctor metus. Proin id neque turpis. Sed interdum
          nulla sed eleifend convallis. Mauris tempor ut arcu quis tristique.
          Phasellus et vestibulum eros. Praesent pellentesque orci vitae blandit
          fermentum. Quisque vestibulum elit at eros finibus maximus. Fusce vel
          massa quis ante sodales efficitur nec ullamcorper urna. Sed vitae
          risus aliquam, placerat urna in, placerat massa. Suspendisse aliquam
          ultricies mauris accumsan pharetra. La plateforme est divisée en
          plusieurs chapitres :
        </p>
        <ul>
          <li>
            Le chapitre
            <v-tooltip bottom max-width="512">
              <template #activator="{ attrs }">
                <span v-bind="attrs" class="d-inline-flex font-weight-bold">
                  Cartographies affectives&nbsp;
                  <v-icon color="primary" small>
                    mdi-information-outline
                  </v-icon>
                </span>
              </template>
              <p class="text-justify">
                Cras sit amet velit eget libero malesuada rutrum ut eget sapien.
                Fusce a magna ullamcorper, bibendum tellus ac, semper lorem.
                Proin porta consequat tellus. Donec metus mi, malesuada nec
                efficitur a, placerat ac sem. Donec ac lacus efficitur, porta
                lacus sit amet, mattis felis. Sed vitae interdum erat.
                Vestibulum est mi, egestas id ante eu, eleifend tincidunt urna.
                Nulla dictum fringilla lorem vel malesuada. Proin id porta
                metus, ut fermentum nisi. Pellentesque ac lacus accumsan,
                pharetra purus a, venenatis odio. Sed urna lorem, hendrerit eget
                dignissim ac, dictum maximus erat.
              </p>
              <p class="purple--text">
                À explorer et superposer sans modération !
              </p>
            </v-tooltip>
          </li>
          <li>
            Le chapitre
            <v-tooltip bottom max-width="512">
              <template #activator="{ attrs }">
                <span v-bind="attrs" class="d-inline-flex font-weight-bold">
                  Atlas des paysages de mobilité&nbsp;
                  <v-icon color="primary" small>
                    mdi-information-outline
                  </v-icon>
                </span>
              </template>
              <p class="text-justify">
                Vestibulum finibus, lectus a porta tristique, risus metus
                finibus purus, interdum ullamcorper libero orci eu ipsum.
                Praesent egestas eleifend ligula. Phasellus sollicitudin nec
                mauris nec faucibus. Fusce quis odio vestibulum, bibendum nunc
                a, maximus velit. Donec sed varius urna. Vestibulum iaculis
                luctus sapien, et imperdiet eros sodales vel. Proin dictum sem
                fringilla, dapibus ante in, ornare nulla. Ut aliquam erat id
                bibendum feugiat. Proin non cursus diam, quis venenatis ligula.
                Donec dignissim convallis suscipit. Nam sed facilisis lectus,
                vitae dignissim lorem. Etiam euismod vestibulum magna eu
                vehicula.
              </p>
              <p class="purple--text">
                Soyez attentifs aux cercles, ils ont des choses à dire…
              </p>
            </v-tooltip>
          </li>
          <li>
            Le chapitre
            <v-tooltip bottom max-width="512">
              <template #activator="{ attrs }">
                <span v-bind="attrs" class="d-inline-flex font-weight-bold">
                  Contexte et fonds de cartes&nbsp;
                  <v-icon color="primary" small>
                    mdi-information-outline
                  </v-icon>
                </span>
              </template>
              <p class="text-justify">
                Ce chapitre contient des cartes plus classiques pour permettre
                de se repérer facilement.
              </p>
            </v-tooltip>
          </li>
        </ul>
        <br />
        <h2>Navigation sur le site</h2>
        <p>
          Aenean hendrerit blandit metus, vitae tincidunt ligula tincidunt sed.
          Vestibulum eu facilisis leo, ut bibendum quam. Mauris eu imperdiet
          neque. Integer at ligula ex. Donec vulputate mi eu ex convallis
          consequat. Aenean ornare accumsan congue. Donec fermentum massa neque,
          sit amet fermentum urna consectetur vel. Mauris in mauris ut felis
          consectetur ornare sed sed turpis. Praesent ac ipsum id ipsum
          tincidunt scelerisque. Praesent vel gravida nulla, sit amet tempus
          eros. In pretium pulvinar mi eu venenatis. In condimentum libero
          magna, nec aliquet erat venenatis non. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed fermentum ipsum quis eros vestibulum,
          ac dapibus libero dictum. Nulla at auctor urna, at pellentesque urna.
          Vivamus varius arcu tortor, vel porttitor neque ultrices et.
          <span class="font-weight-bold"
            >On vous conseille d’accéder au site sur un ordinateur car celui-ci
            n'a pas été optimisé sur téléphone.</span
          >
        </p>
        <h2>Pourquoi ?</h2>
        <p>
          Suspendisse potenti. In et dolor faucibus, elementum est nec, lobortis
          velit. Aenean blandit sapien sed urna pellentesque, at lacinia erat
          facilisis. Morbi vestibulum, mauris id pellentesque iaculis, tellus
          sapien varius quam, vel interdum tellus diam at velit. Donec lectus
          dui, lobortis quis dapibus in, euismod id ex. Donec lorem justo,
          elementum sit amet magna non, congue venenatis orci. Aenean eu
          tristique urna. Quisque et fermentum nisl. Mauris sit amet tellus sed
          nunc fermentum luctus a ac mauris. Cras tortor justo, blandit sed diam
          eu, imperdiet tristique dui. Suspendisse consectetur mauris neque, ac
          fringilla tortor auctor ac. Mauris vitae magna cursus, molestie ante
          vitae, facilisis augue.
        </p>
        <h2>Bonne découverte !</h2>
      </simple-dialog>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SimpleDialog from "@/components/SimpleDialog.vue";

import { ref } from "vue";

const open = ref(false);
const openDialog = () => {
  open.value = true;
};
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  overflow: unset;
}
</style>
