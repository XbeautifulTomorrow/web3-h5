<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog"
    width="522"
    :before-close="closeDialogFun"
  >
    <template #header="{ close }">
      <div class="public-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="public-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="public-dialog-content">
      <h2 class="public-dialog-loading">
        <img src="@/assets/img/lottery/loading.png" alt="" />
      </h2>
      <p class="public-dialog-loading-text">
        Your purchase is being processed.
      </p>
      <p class="public-dialog-illustrate">
        Your transaction is being processed and will be confirmed on the
        blockchain soon
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
  }
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
</style>
