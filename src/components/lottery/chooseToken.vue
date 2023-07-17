<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    :append-to-body="true"
    class="public-dialog"
    width="700"
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
      <h2 class="public-dialog-title">Choose token</h2>
      <p class="public-dialog-illustrate">Choose a token for purchase</p>
      <div class="public-dialog-coin">
        <div class="public-dialog-coin-left">
          <img class="public-dialog-coin-img" src="" alt="" />
          <span class="public-dialog-coin-number left">1.22</span>
        </div>
        <div class="public-dialog-coin-right">
          <span class="public-dialog-coin-balance">Balance</span>
          <img class="public-dialog-coin-img-small" src="" alt="" />
          <span class="public-dialog-coin-number">1,564</span>
        </div>
      </div>
      <p class="public-dialog-insufficient">ETH Insufficient balance</p>
      <div class="public-dialog-coin">
        <div class="public-dialog-coin-left">
          <img class="public-dialog-coin-img" src="" alt="" />
          <span class="public-dialog-coin-number left">1.22</span>
        </div>
        <div class="public-dialog-coin-usdt">
          <div class="public-dialog-coin-right">
            <span class="public-dialog-coin-balance">Balance</span>
            <img class="public-dialog-coin-img-small" src="" alt="" />
            <span class="public-dialog-coin-number">1,564</span>
          </div>
          <p class="public-dialog-coin-usdt-illustrate">1 ETH = 1800.23 USDT</p>
        </div>
      </div>
      <p class="public-dialog-insufficient">USDT Insufficient balance</p>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from "vue";

// const props = defineProps({

// })
const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
</script>
<style lang="scss" scoped>
.public-dialog-coin {
  width: 100%;
  height: 4.375rem;
  border-radius: 0.5rem;
  border: 1px solid #363945;
  background: #13151f;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  box-sizing: border-box;
}
.public-dialog-coin-left,
.public-dialog-coin-right {
  display: flex;
  align-items: center;
  align-content: center;
}
.public-dialog-coin-img {
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.625rem;
}
.public-dialog-coin-number {
  font-size: 1.5rem;
}
.left {
  color: #e4e7f5;
}
.public-dialog-coin-balance {
  font-size: 0.875rem;
}
.public-dialog-coin-img-small {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0 0.625rem;
}
.public-dialog-insufficient {
  font-size: 1.125rem;
  color: #df4328;
  margin: 0.625rem auto 1.25rem;
}
.public-dialog-coin-usdt-illustrate {
  font-size: 0.75rem;
}
</style>
