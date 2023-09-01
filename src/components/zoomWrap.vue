<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
let designWidth = 1140;
const designHeight = 1080 - 200;
const content = ref(null);
const translateY = ref(null);
const state = reactive({
  ratio: 1,
  origin: "center",
});

const onResize = () => {
  const { innerWidth, innerHeight } = window;
  const contentHeight = content.value.offsetHeight;
  if (contentHeight > innerHeight) {
    translateY.value = innerHeight / innerWidth > 0.5 ? 50 : (innerHeight / innerWidth) * 100;
  } else {
    translateY.value = 50;
  }
  if (innerWidth < 950) {
    designWidth = innerWidth;
  }
  const innerHeights = innerHeight - innerWidth * 0.1;
  const xRatio = innerWidth / designWidth;
  const yRatio = innerHeights / designHeight;
  const ratio = innerWidth < 950 ? xRatio : Math.min(xRatio, yRatio);
  state.ratio = ratio;
  state.origin = xRatio > yRatio ? "center" : "top";
};

onMounted(() => {
  setTimeout(() => {
    onResize();
  }, 200);
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="wrap" ref="wrapRef">
    <div class="scale" :style="`transform: scale(${state.ratio});transform-origin: ${state.origin}`">
      <div class="content" ref="content" :style="{ transform: `translate(-50%, -${translateY}%)` }">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scale {
  width: 1px;
  height: 1px;
}
.content {
  width: 98vw;
  transform: translate(-50%, -50%);
}
@media (min-width: 950px) and (max-width: 1650px) {
  .scale {
    transform: scale(1) !important;
  }
}
</style>
