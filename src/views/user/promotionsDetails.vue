<template>
  <div class="promotions_details_box">
    <div class="promotions_box">
      <div class="promotions_l" @click="goBack">
        <img src="@/assets/svg/icon_right.svg" alt="" />
        <div class="name_text">Welcome Offer</div>
      </div>
    </div>
    <div class="promotions_details">
      <img
        src="https://x-pool.s3.ap-southeast-1.amazonaws.com/prd/mystery/IMAGE/2023-09-19/4e3bc9801cc845cfaec7bc6dad7571eb.webp"
        alt=""
        class="banner"
      />
      <p class="name">Welcome Offer</p>
      <div class="handler_btn deposit_btn_box">
        <p class="btn active deposit_btn" @click="depositFunc">{{ $t("user.deposit") }}</p>
      </div>
      <div class="progress_box">
        <p class="title">{{ $t("user.progress") }}</p>
        <div class="progress_item_box" v-if="false">
          <div class="progress_item">
            <!-- 奖金总额： -->
            <p>{{ $t("user.deposit") }}{{ 0.5 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
          <div class="progress_item">
            <!-- 已领取： -->
            <p>>{{ $t("user.received") }}{{ 0.5 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
          <div class="progress_item">
            <!-- 待解锁： -->
            <p>>{{ $t("user.unlocked") }}{{ 0.5 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
        </div>
        <div class="progress_item_box" v-else>
          <div class="progress_item">
            <!-- 您获得总积分： -->
            <p>{{ $t("user.getTotalPoint") }}{{ 0.5 }}</p>
            <img src="@/assets/svg/user/icon_tickets_num.svg" alt="" />
          </div>
        </div>
      </div>
      <el-table :data="tableData" class="table_container">
        <el-table-column prop="round" :label="$t('user.round')" min-width="60" align="center" key="1" />
        <el-table-column prop="seriesName" :label="$t('user.spendingGoals')" min-width="140" align="center" key="2">
          <template #default="scope">
            <div class="progress_bar_box">
              <p class="progress_bar_active" :style="{ width: `${(scope.row.spending / scope.row.goals) * 100}%` }">
                <span>{{ scope.row.spending }} / {{ scope.row.goals }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tokenId" :label="$t('user.bonus')" min-width="60" align="center" key="3">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ scope.row.awards || "--" }}</span>
              <img v-if="scope.row.awards" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceFee" min-width="100" :label="$t('user.claim')" align="center" key="4" fixed="right">
          <template #default="scope">
            <p class="table-btn" v-if="scope.row.status == 1">{{ $t("user.claimed") }}</p>
            <p class="table-btn active" v-else-if="scope.row.status == 2">{{ $t("user.claim") }}</p>
            <p class="btn-text" v-else-if="scope.row.status == 3">{{ $t("user.underWay") }}</p>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="conditions_box">
        <div class="conditions_head" @click="isConditionsShow = !isConditionsShow">
          <p>{{ $t("login.userAgreement") }}</p>
          <img src="@/assets/svg/chevron-down.svg" :class="[{ 'icon-up': isConditionsShow }]" alt="" />
        </div>
        <transition name="fade">
          <div class="conditions_content" v-show="isConditionsShow">
            · 此注册优惠适用于所有在Bitzing注册的玩家。 · 此优惠仅适用于在Bitzing进行的首次存款。 · 首次存款需要在活动开启过程中完成。
            ·激活此优惠所需的最低存款额为0.01 ETH · 最高奖金为首次存款的200%，最高可达10
            ETH。这意味着如果您的首次存款高达5ETH，你将获得200%的奖金，如果您的存款超过 5 ETH，您将获得总计 10 ETH 的奖金。 ·
            在活动期间完成消费需求并前往此页面领取才能获得奖金 · 活动结束后未领取的奖金将被清空。 ·
            只有在促销期间购买盲盒产生的消费金额才能解锁奖金。 · 此优惠对每个客户、计算机、IP地址或家庭仅有效一次。 ·
            被发现使用多个帐户使用奖金的玩家将被关闭所有帐户并没收奖金。 ·Bitzing保留随时修改、暂停或取消任何推广活动的权利，恕不另行通知。
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from "@/locales";
const { t } = i18n.global;
import emitter from "@/utils/event-bus.js";
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { getTheUserPoint } from "@/services/api/user";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat } from "@/utils";
export default {
  name: "myPromotions",
  data() {
    return {
      userPoints: null,
      isConditionsShow: false,
      tableData: [
        { round: 1, spending: 2, goals: 10, awards: 1, status: 1 },
        { round: 2, spending: 2.4, goals: 10, awards: 2, status: 2 },
        { round: 3, spending: 4, goals: 10, awards: 4, status: 3 },
        { round: 4, spending: 6, goals: 10, awards: 6, status: "" },
      ],
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 积分余额
    async fetchTheUserPoint() {
      const res = await getTheUserPoint();
      if (res && res.code == 200) {
        this.userPoints = res.data.balance;
      }
    },
    goBack() {
      this.$emit("hide");
    },
    depositFunc() {
      emitter.emit("pageTypeChange", "recharge");
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchTheUserPoint();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/promotions.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
