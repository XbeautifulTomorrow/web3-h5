<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-image class="lottery-img" :src="src">
    <template #placeholder>
      <div class="image-slot">
        <img src="@/assets/svg/placeholder_img.svg" alt="" class="lottery-placeholder-img" />
      </div>
    </template>
    <template #error>
      <div class="image-slot">
        <img src="@/assets/svg/placeholder_img.svg" alt="" class="lottery-placeholder-img" />
      </div>
    </template>
  </el-image>
</template>
<script setup>
import { defineProps } from "vue";

defineProps({
  src: {
    type: String,
    requird: true,
  },
});
</script>
<style lang="scss" scoped>
.lottery-img {

  .lottery-placeholder-img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 0.25rem;
  }
}
</style>
