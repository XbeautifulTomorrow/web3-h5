<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="31.875rem"
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
        <div class="win_title">YOU WIN!</div>
        <div class="win_amount">
          <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
          <span>{{ winInfo?.winerIncome || 0 }}</span>
        </div>
        <div class="win_info">
          <div class="info_item">
            <div class="val">
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span>{{ winInfo?.winerBuyPrice || 0 }}</span>
            </div>
            <div class="title">您参与的价值</div>
          </div>
          <div class="info_item">
            <div class="val">
              <img src="@/assets/svg/home/warGame/icon_chance.svg" alt="" />
              <span>{{ getWinningRate(winInfo?.winerBuyPrice) || 0 }}%</span>
            </div>
            <div class="title">Your Win Chance</div>
          </div>
          <div class="info_item">
            <div class="val">
              <img
                src="@/assets/svg/home/warGame/icon_multiplication.svg"
                alt=""
              />
              <span>{{ winInfo?.winerMultipleRate || 0 }}</span>
            </div>
            <div class="title">您的盈利倍率</div>
          </div>
        </div>
        <div class="close_win_btn" @click="handleClose()">
          <span>CANCEL</span>
        </div>
        <div class="win_safe">
          <img src="@/assets/svg/home/warGame/icon_safe.svg" alt="" />
          <img
            class="line"
            src="@/assets/svg/home/warGame/icon_line.svg"
            alt=""
          />
          <div class="safe_illustrate">
            <span>{{ $t("ticketsInfo.verify1") }}</span>
            <span>{{ $t("ticketsInfo.verify2") }}</span>
          </div>
          <img
            class="line"
            src="@/assets/svg/home/warGame/icon_line.svg"
            alt=""
          />
          <div class="safe_verify">
            <span @click="onVerify()">{{ $t("ticketsInfo.verify3") }}</span>
            <span>{{ $t("ticketsInfo.verify4") }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useHeaderStore } from "@/store/header.js";
import bigNumber from "bignumber.js";
import { accurateDecimal, openUrl } from "@/utils";
export default {
  name: "warWinning",
  props: {
    winInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    // 验证公平性
    onVerify(event) {
      let chainLink = process.env.VUE_APP_TRANSACTION_ADDR;
      if (event.lotteryChainType == "OKT_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.lotteryChainType == "BSC_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (event.lotteryChainType == "BASE") {
        chainLink = process.env.VUE_APP_CHAIN_BASE_ADDR;
      } else if (event.lotteryChainType == "BSC") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_ADDR;
      } else if (event.lotteryChainType == "OKT") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_ADDR;
      } else if (event.lotteryChainType == "ThunderCore") {
        chainLink = process.env.VUE_APP_CHAIN_THUNDERCORE_ADDR;
      } else if (event.lotteryChainType == "TRC_20_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20TEST_ADDR;
      } else if (event.lotteryChainType == "TRC_20") {
        chainLink = process.env.VUE_APP_CHAIN_TRC20_ADDR;
      }
      openUrl(`${chainLink}${event.hash}`);
    },
    // 格式化胜率
    getWinningRate(event) {
      const { winInfo } = this;
      const amount = Number(event || 0);
      if (!amount || !Number(winInfo?.jackpot)) return 0;

      const rate = new bigNumber(event)
        .div(Number(winInfo?.jackpot))
        .multipliedBy(100);

      return accurateDecimal(rate, 2);
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
  },
  created() {
    this.fetchRewardAmount();
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./components/warWinning.scss";
</style>
