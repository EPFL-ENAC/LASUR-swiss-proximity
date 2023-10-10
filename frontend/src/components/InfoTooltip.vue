<script setup lang="ts">
import { mdiInformationOutline } from "@mdi/js";
</script>

<template>
  <v-tooltip bottom max-width="512">
    <template #activator="{ props }">
      <v-icon class="px-1" v-bind="props" :icon="mdiInformationOutline" />
    </template>
    <slot />
  </v-tooltip>
</template>
