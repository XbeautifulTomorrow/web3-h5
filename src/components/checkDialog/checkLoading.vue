<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog result-loading-dialog"
    width="522"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <img class="public-dialog-header-icon" src="@/assets/svg/close.svg" alt="" v-on="{ click: [close, closeDialogFun] }" />
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-loading">
        <img src="@/assets/img/lottery/loading.png" alt="" />
      </h2>
      <p class="public-dialog-loading-text">
        {{ $t("lottery.loading_tip1") }}
      </p>
      <p class="public-dialog-illustrate">
        {{ $t("lottery.loading_tip2") }}
      </p>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
</script>
<style scoped lang="scss">
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
.public-dialog-loading {
  img {
    width: 5rem;
    height: 5rem;
    animation: rotate 1s linear infinite;
    margin-top: 1.875rem;
  }
  margin-top: -4rem;
}
.public-dialog-loading-text {
  font-family: BlenderPro;
  font-size: 1.5rem;
  color: #e4e7f5;
  margin-top: 1.875rem;
  margin-bottom: 0.5rem;
}
.public-dialog-illustrate {
  margin-bottom: 3.125rem;
  color: #a9a4b4;
}
.public-dialog-header-icon {
  margin-top: 1.875rem;
  margin-right: 1.875rem;
  cursor: pointer;
}
@media (max-width: 950px) {
  .public-dialog-loading{
    margin-top:0;
  }
  .public-dialog-header-icon {
    width: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
  }
}
</style>
