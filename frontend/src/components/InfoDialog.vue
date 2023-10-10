<template>
  <v-container>
    <info-markdown />
  </v-container>
</template>

<script setup lang="ts">
import InfoMarkdown from "@/components/InfoMarkdown.md";
</script>

<style scoped>
::v-deep.markdown-body p {
  padding-bottom: 0.4em;
}

::v-deep.markdown-body h3 {
  padding-top: 0.6em;
  padding-bottom: 0.4em;
}

::v-deep.markdown-body ul,
::v-deep.markdown-body ol {
  margin-left: 2em;
  padding-bottom: 0.2em;
}

::v-deep.markdown-body li {
  padding-bottom: 0.1em;
}

::v-deep.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
}

::v-deep.markdown-body table th {
  font-weight: 600;
}

::v-deep.markdown-body table td,
::v-deep.markdown-body table th {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

::v-deep.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}
</style>
