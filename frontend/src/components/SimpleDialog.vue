<template>
  <v-dialog v-model="dialog" :width="width">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card class="text-justify">
      <v-card-title v-if="name">{{ name }}</v-card-title>
      <v-card-text>
        <br v-if="!name" />
        <slot></slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn v-if="buttonText" text @click="dialog = false">
          {{ buttonText }}
        </v-btn>
        <v-btn v-else icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    name?: string;
    width?: number;
    open?: boolean;
    buttonText?: string;
  }>(),
  { width: 1024, open: true }
);

const dialog = ref(false);

onMounted(() => {
  dialog.value = props.open;
});
</script>
