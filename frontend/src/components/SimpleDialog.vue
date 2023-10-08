<template>
  <v-dialog v-model="dialog" :width="width" scrollable>
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card>
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
import { withDefaults, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    name?: string;
    width?: number;
    buttonText?: string;
    open: boolean;
  }>(),
  { width: 1400 }
);

const emits = defineEmits<{
  (event: "update:open", value: boolean): void;
}>();

const storageItem = sessionStorage.getItem("dialogClosed"),
  dialogClosed = storageItem ? JSON.parse(storageItem) : false;

const dialog = ref(!dialogClosed);

watch(
  () => props.open,
  (value) => {
    dialog.value = value;
  }
);

watch(dialog, (value) => {
  sessionStorage.setItem("dialogClosed", JSON.stringify(!value));
  emits("update:open", value);
});
</script>
