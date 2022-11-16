import { onMounted, onUnmounted, ref } from "vue";

export default function useWindowResize() {
  const height = ref(0);
  const width = ref(0);

  function resize() {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  }

  onMounted(() => {
    resize();
    window.addEventListener("resize", resize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });

  return { height, width };
}
