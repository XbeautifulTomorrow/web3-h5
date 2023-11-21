<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-image class="lottery-img" :src="src">
    <template #placeholder>
      <div class="image-slot">
        <img
          src="@/assets/img/lottery/default_nft.webp"
          alt=""
          class="lottery-placeholder-img"
        />
      </div>
    </template>
    <template #error>
      <div class="image-slot">
        <img
          src="@/assets/img/lottery/default_nft.webp"
          alt=""
          class="lottery-placeholder-img"
        />
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
  .image-slot {
    width: 100%;
    height: 100%;
  }

  .lottery-placeholder-img {
    width: 100%;
    height: 100%;
    transform: scale(1.2);
  }
  :deep(.el-image__inner) {
    object-fit: cover;
  }
  img {
    object-fit: cover;
  }
}
</style>
