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
        <div class="win_title">{{ $t("tokenWar.youWin") }}</div>
        <div class="win_amount">
          <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
          <span>{{ formatUsd(calculateProfit()) }}</span>
        </div>
        <div class="win_info">
          <div class="info_item">
            <div class="val">
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span>{{ formatUsd(winInfo?.winerBuyPrice) }}</span>
            </div>
            <div class="title">{{ $t("tokenWar.participatePrice") }}</div>
          </div>
          <div class="info_item">
            <div class="val">
              <img src="@/assets/svg/home/warGame/icon_chance.svg" alt="" />
              <span>{{ getWinningRate(winInfo?.winerBuyPrice) || 0 }}%</span>
            </div>
            <div class="title">{{ $t("tokenWar.yourWinChance") }}</div>
          </div>
          <div class="info_item">
            <div class="val">
              <img
                src="@/assets/svg/home/warGame/icon_multiplication.svg"
                alt=""
              />
              <span>
                {{ accurateDecimal(winInfo?.winerMultipleRate, 2) || 0 }}
              </span>
            </div>
            <div class="title">{{ $t("tokenWar.profitMultiple") }}</div>
          </div>
        </div>
        <div class="close_win_btn" @click="handleClose()">
          <span>CLOSE</span>
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
import bigNumber from "bignumber.js";
import { accurateDecimal, openUrl, formatUsd } from "@/utils";
export default {
  name: "warWinning",
  props: {
    winInfo: {
      type: Object,
      default: null,
    },
    config: {
      type: Object,
      default: null,
    },
    warData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      show: true,
    };
  },

  computed: {
    /**
     * @description 用户总计参与金额
     */
    totalBonus() {
      const { warData } = this;
      let bonus = 0;
      for (let i = 0; i < warData.length; i++) {
        bonus += Number(warData[i].buyPrice);
      }
      return bonus;
    },
  },
  methods: {
    formatUsd: formatUsd,
    accurateDecimal: accurateDecimal,
    // 验证公平性
    onVerify() {
      const { winInfo } = this;
      let chainLink = import.meta.env.VITE_APP_TRANSACTION_ADDR;
      if (winInfo.lotteryChainType == "OKT_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (winInfo.lotteryChainType == "BSC_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (winInfo.lotteryChainType == "BASE") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BASE_ADDR;
      } else if (winInfo.lotteryChainType == "BSC") {
        chainLink = import.meta.env.VITE_APP_CHAIN_BSC_ADDR;
      } else if (winInfo.lotteryChainType == "OKT") {
        chainLink = import.meta.env.VITE_APP_CHAIN_OKT_ADDR;
      } else if (winInfo.lotteryChainType == "ThunderCore") {
        chainLink = import.meta.env.VITE_APP_CHAIN_THUNDERCORE_ADDR;
      } else if (winInfo.lotteryChainType == "TRC_20_TEST") {
        chainLink = import.meta.env.VITE_APP_CHAIN_TRC20TEST_ADDR;
      } else if (winInfo.lotteryChainType == "TRC_20") {
        chainLink = import.meta.env.VITE_APP_CHAIN_TRC20_ADDR;
      }
      openUrl(`${chainLink}${winInfo.hash}`);
    },
    // 格式化胜率
    getWinningRate(event) {
      const { totalBonus } = this;
      const amount = Number(event || 0);
      if (!amount || !Number(totalBonus)) return 0;

      const rate = new bigNumber(event)
        .div(Number(totalBonus))
        .multipliedBy(100);

      return accurateDecimal(rate, 2);
    },
    // 计算收益
    calculateProfit() {
      const { winInfo, config } = this;
      if (!winInfo?.winerIncome || !config?.fee) return;

      const winFee = Number(
        new bigNumber(winInfo?.winerIncome || 0).multipliedBy(config?.fee),
      );

      return Number(new bigNumber(winInfo?.winerIncome || 0).minus(winFee));
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
  },
  created() {},
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./components/warWinning.scss";
</style>
