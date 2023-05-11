<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
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
      <h2 class="lottery-dialog-title">Notice</h2>
      <p class="lottery-dialog-illustrate">
        The prize is in your backpack. Please go to your backpack and check it
        out
      </p>
      <p class="lottery-dialog-illustrate">
        Prizes have entered your backpack, please go to the backpack to check, due to congestion on the chain, part of the prizes can not be accounted for, we will be converted to the final value of the NFT directly into the ETH transferred to your balance
      </p>
      <h3 class="lottery-dialog-title-other">NFTs</h3>
      <ul class="lottery-dialog-lists">
        <li
          class="lottery-dialog-list"
          v-for="(item, index) in 6"
          :key="`portrait-${index}`"
        >
          <img class="lottery-dialog-portrait" src="" alt="" />
        </li>
      </ul>
      <h3 class="lottery-dialog-title-other">ETH</h3>
      <ul class="lottery-dialog-lists">
        <li
          class="lottery-dialog-list"
          v-for="(item, index) in 4"
          :key="`portrait-${index}`"
        >
          <img class="lottery-dialog-portrait" src="" alt="" />
          <p class="lottery-dialog-list-text">
            <img class="lottery-dialog-list-img" src="" alt="" />
            <span class="lottery-dialog-list-number">73.025</span>
          </p>
          <span class="lottery-dialog-list-result sold">Sold</span>
          <span class="lottery-dialog-list-result refund">Refund</span>
        </li>
      </ul>
      <p class="lottery-dialog-total">
        <span class="lottery-dialog-total-title">Total:</span>
        <span class="lottery-dialog-total-number"> 352.6514 ETH </span>
      </p>
      <el-button class="lottery-dialog-button">Check my inventory</el-button>
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
.lottery-dialog-icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.lottery-dialog-total {
  margin-top: 30px;
}
</style>
