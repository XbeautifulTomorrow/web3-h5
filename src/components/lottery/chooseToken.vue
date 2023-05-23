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
  width: 640px;
  height: 70px;
  border-radius: 8px;
  border: 1px solid #363945;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.public-dialog-coin-left,
.public-dialog-coin-right {
  display: flex;
  align-items: center;
  align-content: center;
}
.public-dialog-coin-img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.public-dialog-coin-number {
  font-size: 24px;
}
.left {
  color: #e4e7f5;
}
.public-dialog-coin-balance {
  font-size: 14px;
}
.public-dialog-coin-img-small {
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
.public-dialog-insufficient {
  font-size: 18px;
  color: #df4328;
  margin: 10px auto 20px;
}
.public-dialog-coin-usdt-illustrate {
  font-size: 12px;
}
</style>
