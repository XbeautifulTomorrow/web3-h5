<template>
  <div class="lottery-notify-box">
    <div class="lottery-notify-loading notification-title" v-if="type == 'loading'">
      <img src="@/assets/img/lottery/loading.png" class="loading-img" alt="" />
      <span>Your transaction is being processed and will be confirmed on the blockchain soon</span>
    </div>
    <div class="lottery-notify">
      <div class="notification-title" v-if="type == 'success'">
        <img src="@/assets/img/lottery/notice1.png" class="type-img" alt="" />
        <span>Reward successfully transferred to your inventory</span>
      </div>
      <div class="notification-title" v-if="type == 'warning'">
        <img src="@/assets/img/lottery/notice2.png" class="type-img" alt="" v-if="type == 'warning'" />
        <span
          >Some of the prizes may not be available. We will convert them to ETH at the current price of that NFT and transfer it to your
          balance.</span
        >
      </div>
      <div class="click-txt" v-if="type != 'loading' && !isShowRes"><span @click="isShowRes = true">Click to check it</span></div>
      <div class="lottery-notify-result" v-if="isShowRes">
        <div class="lottery-item" v-for="item in data" :key="item.id">
          <div class="lottery-img">
            <img :src="item.nftImg" alt="" />
            <div class="lottery-refund" v-if="item.lotteryStatus == 'FAIL'"><p>Refund</p></div>
          </div>
          <div class="lottery-price" v-if="item.lotteryStatus == 'FAIL'">
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            <span v-priceFormat="item.initPric"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps } from "vue";

defineProps({
  type: {
    type: String,
    default: "",
  },
  data: {
    requird: false,
  },
});
const isShowRes = ref(false);
</script>
<style lang="scss" scoped>
.lottery-notify-box {
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
  .lottery-notify-loading {
    .loading-img {
      animation: rotate 1s linear infinite;
    }
  }
  .lottery-notify {
    .click-txt {
      display: flex;
      justify-content: flex-end;
      font-size: 0.75rem;
      color: #11cde9;
      text-align: right;
      cursor: pointer;
      margin-right: 30px;
    }
    .lottery-notify-result {
      display: flex;
      margin-left: 3.125rem;
      margin-top: 0.25rem;
      .lottery-item {
        width: 4rem;
        margin-right: 0.5rem;
        .lottery-img {
          position: relative;
          width: 4rem;
          height: 4rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 0.25rem;
          }
          .lottery-refund {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            background: rgba(250, 213, 77, 0.9);
            border-radius: 0 0 0.25rem 0.25rem;
            p {
              font-size: 0.75rem;
              zoom: 0.83;
              transform-origin: center;
              text-align: center;
            }
          }
        }
        .lottery-price {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          color: #e4e7f5;
          font-weight: bold;
          transform: scale(0.83);
          transform-origin: center;
          img {
            width: 0.75rem;
            margin-right: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
