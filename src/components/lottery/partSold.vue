<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    class="public-dialog"
    width="700"
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
      <h2 class="public-dialog-title">Notice</h2>
      <p class="public-dialog-illustrate">
        The prize is in your backpack. Please go to your backpack and check it
        out
      </p>
      <p class="public-dialog-illustrate">
        Prizes have entered your backpack, please go to the backpack to check,
        due to congestion on the chain, part of the prizes can not be accounted
        for, we will be converted to the final value of the NFT directly into
        the ETH transferred to your balance
      </p>
      <template v-if="reserveList.length">
        <h3 class="public-dialog-title-other">NFTs</h3>
        <ul class="public-dialog-lists">
          <li
            class="public-dialog-list"
            v-for="(item, index) in reserveList"
            :key="`portrait-${index}`"
          >
            <img class="public-dialog-portrait" :src="item.nftImg" alt="" />
          </li>
        </ul>
      </template>
      <template v-if="soldList.length">
        <h3 class="public-dialog-title-other">ETH</h3>
        <ul class="public-dialog-lists">
          <li
            class="public-dialog-list"
            v-for="(item, index) in soldList"
            :key="`portrait-${index}`"
          >
            <img class="public-dialog-portrait" :src="item.nftImg" alt="" />
            <p class="public-dialog-list-text">
              <img
                class="public-dialog-list-img"
                src="@/assets/img/eth.png"
                alt=""
              />
              <span class="public-dialog-list-number">{{ item.price }}</span>
            </p>
            <span class="public-dialog-list-result sold">Sold</span>
            <span class="public-dialog-list-result refund">Refund</span>
          </li>
        </ul>
      </template>
      <p class="public-dialog-total">
        <span class="public-dialog-total-title">Total:</span>
        <span class="public-dialog-total-number"> {{ total }} ETH </span>
      </p>
      <el-button class="public-button" @click="inventoryFun">
        Check my inventory
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  reserveList: {
    type: Object,
    default: () => {
      return [];
    },
  },
  soldList: {
    type: Object,
    default: () => {
      return [];
    },
  },
});
const emit = defineEmits(["closeDialogFun"]);

const visible = ref(true);
const total = ref(0);
const closeDialogFun = () => {
  emit("closeDialogFun");
};
const inventoryFun = () => {
  emit("inventoryFun");
};
</script>
<style lang="scss" scoped>
.public-dialog-icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.public-dialog-total {
  margin-top: 30px;
}
</style>
