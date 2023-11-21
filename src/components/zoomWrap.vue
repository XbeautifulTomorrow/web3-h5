<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
const designWidth = 1140;
const designHeight = 1080 - 200;
const wrapRef = ref(null);
const state = reactive({
  ratio: 1,
  origin: "center",
});

const onResize = () => {
  const { innerWidth } = window;
  const innerHeight = window.innerHeight - window.innerWidth * 0.08;
  const xRatio = innerWidth / designWidth;
  const yRatio = innerHeight / designHeight;
  const ratio = Math.min(xRatio, yRatio);
  state.ratio = ratio;
  state.origin = xRatio > yRatio ? "center" : "top";
};

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <div class="wrap" ref="wrapRef">
    <div
      class="scale"
      :style="`transform: scale(${state.ratio});transform-origin: ${state.origin}`"
    >
      <div class="content">
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
@media screen and (max-width: 1530px) {
  .scale {
    transform: scale(1) !important;
  }
}
</style>
