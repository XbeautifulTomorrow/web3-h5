<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="26.0625rem"
      :before-close="handleClose"
    >
      <template #header>
        <div class="close_btn" @click="handleClose()">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="public-dialog-content form-content">
        <div class="title1">JOIN TO WIN</div>
        <div class="title2">100,000 USDT</div>
      </div>
      <div class="turntable_box" @click="goTokenWar">
        <div class="text_box">
          <img src="@/assets/img/home/poster/bg_03.webp" alt="" class="text" />
          <img src="@/assets/img/home/poster/pointer.webp" alt="" class="pointer" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setSessionStore } from "@/utils";
export default {
  name: "WarPoster",
  data() {
    return {
      show: true,
    };
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
    goTokenWar() {
      setSessionStore("showWarTips", 2);
      this.$router.push({ name: "TokenWar" });
    },
  },
  created() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
@keyframes pointer-action {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
@keyframes font-action {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
:deep(.public-dialog) {
  &.el-dialog {
    border-radius: 0px;
    background-position: top center !important;
    background-image: none !important;
    box-sizing: border-box;
    background-color: transparent;
  }

  .el-dialog__body {
    padding: 0 !important;
    box-sizing: border-box;
    min-height: 30.625rem;
    background-image: url("@/assets/img/home/poster/bg_01.webp") !important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .close_btn {
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    font-size: 1.75rem;
    color: #fff;
  }
  .title1 {
    background-image: linear-gradient(to bottom, #f0e1ff 0%, #ac94ec 100%);
    font-family: "Medium";
    font-size: 1.5rem;
    font-weight: bold;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    padding-top: 3.75rem;
  }
  .title2 {
    background-image: linear-gradient(to top, #e3a406, #fbd851);
    font-family: "Medium";
    font-size: 1.875rem;
    font-weight: bold;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
  .turntable_box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16.5625rem;
    height: 19.125rem;
    background: url("@/assets/img/home/poster/bg_02.webp") no-repeat center;
    background-size: cover;
    margin: 0 auto;
    margin-top: 2.625rem;
    cursor: pointer;
    .text_box {
      position: relative;
      width: 6.4375rem;
      height: 3.75rem;

      .text {
        width: 100%;
        height: 100%;
        animation: font-action 2.5s ease-in-out infinite;
      }
      .pointer {
        position: absolute;
        width: 5.125rem;
        height: 4.25rem;
        right: -2.8rem;
        bottom: -2.8rem;
        animation: pointer-action 2.5s ease-in-out infinite;
      }
    }
  }
}
@media screen and (max-width: 950px) {
  :deep(.public-dialog) {
    &.el-dialog {
      width: 24rem;
    }
  }
}
@media screen and (max-width: 500px) {
  :deep(.public-dialog) {
    &.el-dialog {
      width: 94%;
    }
    .el-dialog__body {
      .title1 {
        padding-top: 1.875rem !important;
      }
    }
  }
}
</style>
