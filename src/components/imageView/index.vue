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
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
  }
}
</style>
