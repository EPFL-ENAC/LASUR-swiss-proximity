<template>
  <v-container>
    <info-markdown />
  </v-container>
</template>

<script setup lang="ts">
import InfoMarkdown from "@/components/InfoMarkdown.md";
</script>

<style scoped>
.markdown-body :deep(p) {
  padding-bottom: 0.8em;
}

.markdown-body :deep(h3:not(:first-child)) {
  padding-top: 1.2em;
}

.markdown-body :deep(h3) {
  padding-bottom: 0.8em;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-left: 2em;
  padding-bottom: 0.2em;
}

.markdown-body :deep(li) {
  padding-bottom: 0.1em;
}

.markdown-body :deep(table) {
  display: block;
  width: 100%;
  overflow: auto;
  padding-bottom: 2em;
}

.markdown-body :deep(table) th {
  font-weight: 600;
}

.markdown-body :deep(table) td,
.markdown-body :deep(table) th {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body :deep(table) tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body :deep(table) tr:nth-child(2n) {
  background-color: #f6f8fa;
}
</style>
