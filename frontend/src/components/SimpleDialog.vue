<template>
  <v-dialog v-model="dialog" :style="`width: ${props.width}px`" scrollable>
    <v-card>
      <v-card-title v-if="name">{{ name }}</v-card-title>
      <v-card-text>
        <br v-if="!name" />
        <slot></slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn v-if="buttonText" @click="dialog = false">
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
    storageKey?: string;
    open: boolean;
  }>(),
  { width: 1000 },
);

const emits = defineEmits<{
  (event: "update:open", value: boolean): void;
}>();

const storageItem = props.storageKey
    ? sessionStorage.getItem(props.storageKey)
    : null,
  dialogClosed = props.storageKey
    ? storageItem
      ? JSON.parse(storageItem)
      : false
    : true;

const dialog = ref(!dialogClosed);

watch(
  () => props.open,
  (value) => {
    dialog.value = value;
  },
);

watch(dialog, (value) => {
  if (props.storageKey)
    sessionStorage.setItem(props.storageKey, JSON.stringify(!value));
  emits("update:open", value);
});
</script>
