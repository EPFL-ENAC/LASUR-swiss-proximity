<template>
  <div class="legend">
    <div class="legend-item" v-for="item in props.colors" :key="item.label">
      <div class="color-box" :style="{ backgroundColor: item.color }"></div>
      <div class="label text-body-2">{{ item.distance }} {{ item.label }}</div>
      <v-spacer></v-spacer>
      <div class="code text-body-1 font-weight-medium">{{ item.category }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Color = {
  color: string;
  label: string;
  category: string;
  distance?: string;
};

const props = defineProps<{
  colors: Color[];
}>();
</script>

<style scoped>
.legend {
  position: absolute;
  bottom: 1em;
  background-color: white;
  padding: 1em;
  border-radius: 1em;
  /* outline: solid 2px black; */
  z-index: 1000;
  right: 2em;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  color: rgba(var(--v-theme-primary), var(--v-medium-emphasis-opacity));
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
}

.color-box {
  width: 40px;
  height: 25px;
  margin-right: 8px;
}

.label,
.code {
  margin-right: 8px;
}
</style>
