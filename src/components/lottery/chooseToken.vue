<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    class="lottery-dialog"
    width="700"
  >
    <template #header="{ close }">
      <div class="lottery-dialog-header">
        <el-icon
          v-on="{ click: [close, closeDialogFun] }"
          color="#2d313f"
          size="16"
          class="lottery-dialog-header-icon"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </template>
    <div class="lottery-dialog-content">
      <h2 class="lottery-dialog-title">Choose token</h2>
      <p class="lottery-dialog-illustrate">Choose a token for purchase</p>
      <div class="lottery-dialog-coin">
        <div class="lottery-dialog-coin-left">
          <img class="lottery-dialog-coin-img" src="" alt="" />
          <span class="lottery-dialog-coin-number left">1.22</span>
        </div>
        <div class="lottery-dialog-coin-right">
          <span class="lottery-dialog-coin-balance">Balance</span>
          <img class="lottery-dialog-coin-img-small" src="" alt="" />
          <span class="lottery-dialog-coin-number">1,564</span>
        </div>
      </div>
      <p class="lottery-dialog-insufficient">ETH Insufficient balance</p>
      <div class="lottery-dialog-coin">
        <div class="lottery-dialog-coin-left">
          <img class="lottery-dialog-coin-img" src="" alt="" />
          <span class="lottery-dialog-coin-number left">1.22</span>
        </div>
        <div class="lottery-dialog-coin-usdt">
          <div class="lottery-dialog-coin-right">
            <span class="lottery-dialog-coin-balance">Balance</span>
            <img class="lottery-dialog-coin-img-small" src="" alt="" />
            <span class="lottery-dialog-coin-number">1,564</span>
          </div>
          <p class="lottery-dialog-coin-usdt-illustrate">
            1 ETH = 1800.23 USDT
          </p>
        </div>
      </div>
      <p class="lottery-dialog-insufficient">USDT Insufficient balance</p>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits } from 'vue';

// const props = defineProps({

// })
const emit = defineEmits(['closeDialogFun']);

const visible = ref(true);
const closeDialogFun = () => {
  emit('closeDialogFun');
};
</script>
<style lang="scss" scoped>
.lottery-dialog-coin {
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
.lottery-dialog-coin-left,
.lottery-dialog-coin-right {
  display: flex;
  align-items: center;
  align-content: center;
}
.lottery-dialog-coin-img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.lottery-dialog-coin-number {
  font-size: 24px;
}
.left {
  color: #e4e7f5;
}
.lottery-dialog-coin-balance {
  font-size: 14px;
}
.lottery-dialog-coin-img-small {
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
.lottery-dialog-insufficient {
  font-size: 18px;
  color: #df4328;
  margin: 10px auto 20px;
}
.lottery-dialog-coin-usdt-illustrate {
  font-size: 12px;
}
</style>
