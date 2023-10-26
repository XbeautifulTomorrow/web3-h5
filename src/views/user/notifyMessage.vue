<template>
  <div class="notify-box">
    <div class="sub-notify">
      <div class="notification-title" v-if="type == 'success'">
        <img src="@/assets/img/lottery/notice1.png" class="type-img" alt="" />
        <span>{{ notifyTxt }}</span>
      </div>
      <div class="notification-title" v-if="type == 'fail'">
        <img src="@/assets/img/lottery/notice2.png" class="type-img" alt="" v-if="type == 'fail'" />
        <span>{{ notifyTxt }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

defineProps({
  type: {
    type: String, //success成功；fail失败
    default: "",
  },
  notifyTxt: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.notify-box {
  .notification-title {
    color: #a9a4b4;
    font-size: 0.75rem;
    font-weight: normal;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #e4e7f5;
    line-height: 1.5;
    img {
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 0.625rem;
    }
  }
}
</style>
