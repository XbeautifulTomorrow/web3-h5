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
        <div class="close_win_btn" @click="receiveAmount()">
          <span>CLAIM REWARD</span>
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
import { accurateDecimal } from "@/utils";
import { getRewardAmount, receiveAmount } from "@/services/api/tokenWar";
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
    // 获取未领取奖金
    async fetchRewardAmount() {
      const res = await getRewardAmount();
      if (res.code == 200) {
        this.rewardAmount = res.data;
      }
    },
    // 领取奖金
    async receiveAmount() {
      if (this.rewardAmount <= 0) return;
      const res = await receiveAmount();
      if (res.code == 200) {
        this.$message.success("Received successfully!");
        const { getTheUserBalanceApi } = useHeaderStore();
        getTheUserBalanceApi();
        this.$emit("closeReceiveFun");
      }
    },
    // 验证公平性
    onVerify() {},
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
