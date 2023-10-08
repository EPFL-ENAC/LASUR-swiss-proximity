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
        <v-container>
          <h1>Bienvenue sur <i>Swiss Proximity</i></h1>
          <br />
          <p>
            <i>Swiss Proximity</i> est un outil de planification et d’aide à la
            décision pour penser de manière plus durable nos territoires urbains
            de demain. Cette interface a été développée par des chercheurs de
            l'EPFL pour aider les usagers, praticiens, collectivités et
            décideurs à mieux comprendre leurs territoires du point de vue des
            "proximités urbaines".
          </p>
          <h2>Les <i>proximités urbaines</i>, c’est quoi?</h2>
          <p>
            Nous considérons qu’un territoire durable devrait non seulement
            tendre vers la neutralité carbone, mais aussi favoriser
            l’inclusivité et le progrès social. Ainsi, les proximités urbaines
            doivent être pensées en terme de:
          </p>
          <ul>
            <li>
              densité (nombre de services, magasins, guichets, …) pour réduire
              les distances de déplacement et les rendre accessibles en modes
              doux;
            </li>
            <li>
              diversité (diversité de services, magasins, guichets, …) pour
              offrir une variété de choix dans une distance raisonnable;
            </li>
            <li>
              nature et convivialité pour favoriser l’hospitalité urbaine et le
              vivre-ensemble.
            </li>
          </ul>
          <p>
            Ainsi, nous proposons un outils qui permette aux utilisateur.ice.s
            de visualiser les proximités urbaines dans les 80 agglomérations
            suisses.
          </p>
          <h2>Un outil d’aide à la planification</h2>
          <p>
            L’interface s’organise en un outil comparatif comportant deux volets
            principaux:
          </p>
          <ol>
            <li>
              <i>L’offre territoriale de proximité </i> : nous avons catégorisé
              10 types de lieu, services, ou infrastructures qui composent nos
              territoires urbains: apprendre, se cultiver, se soigner, s’aérer,
              faire du sport, bien manger, faire ses courses, faire les
              magasins, guichets, transports publics.
            </li>
            <li>
              <i>La demande activité-déplacement de proximité </i>: permet de
              visualiser où les gens se déplacent dans la proximité. En regard
              de l’offre, l’étude de la demande permet d’identifier des poches
              territoriales où territoire et usages sont discordants. La demande
              de mobilité est basée sur le modèle voyageur développé par
              l’Office Fédérale du Développement Territoriale (ARE).
            </li>
          </ol>
          <p>
            Un troisième volet permet de calculer les isochrones d’accessibilité
            avec différents mode de transport à travers les agglomérations
            suisses.
          </p>
          <h2>Navigation sur l’interface</h2>
          <p>
            L’interface est optimisée pour un usage sur ordinateur, et n’est pas
            adapté aux smartphones.
          </p>
          <p>
            La colonne de gauche vous permet de jouer avec les paramètres de la
            demande et de l’offre de proximité. Vous trouverez plus
            d’informations, notamment sur la méthode et les données, dans les
            <i>infos</i> en haut à droite.
          </p>

          <h2>Bonne découverte !</h2>
        </v-container>
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

p {
  padding-bottom: 0.2em;
}

h2 {
  padding-top: 0.6em;
  padding-bottom: 0.4em;
}

ul,
ol {
  margin-left: 2em;
  padding-bottom: 0.2em;
}

li {
  padding-bottom: 0.1em;
}
</style>
