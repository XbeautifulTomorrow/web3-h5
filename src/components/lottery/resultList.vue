<template>
  <el-dialog
    v-model="visible"
    destroy-on-close
    :show-close="false"
    :align-center="true"
    class="result-dialog"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="result-dialog-content">
      <h2 class="result-title">Top Blue-chips Box</h2>
      <p class="result-illustrate">An offcial box by Bitzing</p>
      <ul
        :class="[
          'result-main',
          {
            onlyOne: result.length < 2,
          },
        ]"
      >
        <li
          class="result-list"
          v-for="(item, index) in result"
          :key="`result-${index}`"
        >
          <img class="result-portrait" :src="item.nftImg" alt="" />
          <div class="result-club">
            <div class="result-club-title">
              Bored Ape Yacht Club
              <el-icon color="#11cde9" size="12"><CircleCheckFilled /></el-icon>
            </div>
            <span class="result-club-serial" v-if="item.tokenId">
              #&nbsp;{{ item.tokenId }}
            </span>
          </div>
          <p class="result-coin">{{ `${item.price}  ${item.coin}` }}</p>
          <div class="result-one-footer" v-if="result.length < 2">
            <el-button
              class="result-one-button take"
              type="warning"
              round
              @click="chooseLotteryHold('hold')"
            >
              Take the NFT
            </el-button>
            <el-button
              class="result-one-button sell"
              round
              @click="chooseLotteryHold"
            >
              <span>Sell for</span>
              <span class="result-total">{{ total }}ETH</span>
              <span>({{ second }}s)</span>
            </el-button>
            <p class="result-end">
              At the end of the countdown you will automatically sell all NFT
            </p>
          </div>
          <div class="result-sell">
            <span class="result-sell-text">Sell for</span>
            <span class="result-sell-total">{{ total }}ETH</span>
          </div>
        </li>
      </ul>
      <div class="result-footer" v-if="result.length > 1">
        <div class="resule-footer-buttons">
          <el-button
            class="result-footer-button take"
            type="warning"
            round
            @click="chooseLotteryHold('hold')"
          >
            Take the NFT
          </el-button>
          <el-button
            class="result-footer-button sell"
            round
            @click="chooseLotteryHold"
          >
            <span>Sell for</span>
            <span class="result-total">{{ total }}ETH</span>
            <span>({{ second }}s)</span>
          </el-button>
        </div>
        <p class="result-end">
          At the end of the countdown you will automatically sell all NFT
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from "vue";
import { BigNumber } from "bignumber.js";

const props = defineProps({
  result: {
    type: Array,
    requird: true,
  },
});
const emit = defineEmits(["chooseLotteryHold", "inventoryFun"]);
const WIDTH = 375;
let timer = null;
const visible = ref(true);
let total = ref(0);
let second = ref(60);
let width = ref(WIDTH);
onMounted(() => {
  totalFun();
  timerFun();
});
onUnmounted(() => {
  clearTimerFun();
});
const totalFun = () => {
  const { result } = props;
  if (result.length > 1) {
    width.value = 1920;
  }
  result.forEach((item) => {
    total.value = BigNumber(total.value).plus(Number(item.price));
  });
};
const timerFun = () => {
  timer = setInterval(() => {
    second.value--;
    if (second.value < 1) {
      clearTimerFun();
    }
  }, 1000);
};
const clearTimerFun = () => {
  clearInterval(timer);
  timer = null;
};
const chooseLotteryHold = (data) => {
  emit("chooseLotteryHold", data);
};
</script>
<style lang="scss" scoped>
@import url("./css/result.scss");
</style>
<style lang="scss">
.result-dialog {
  background: none;
}
.take {
  font-weight: 500;
  color: #13151f;
  background-image: linear-gradient(to top, #e3a406, #fbd851);
  &:hover {
    color: #13151f;
    background-image: linear-gradient(to top, #e3a406, #fbd851);
  }
}
.sell {
  color: #e4e7f5;
  border: solid 1px rgba(228, 231, 245, 0.15);
  background-color: rgba(239, 150, 46, 0.1);
  &:hover {
    border: solid 1px rgba(228, 231, 245, 0.15);
    background-color: rgba(239, 150, 46, 0.1);
    color: #e4e7f5;
  }
}
.result-one-footer {
  .sell {
    margin-top: 10px;
    margin-left: 0 !important;
  }
}
</style>
