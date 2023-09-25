<template>
  <div class="promotions_details_box">
    <div class="promotions_box">
      <div class="promotions_l" @click="goBack">
        <img src="@/assets/svg/icon_right.svg" alt="" />
        <div class="name_text">{{ details.name }}</div>
      </div>
    </div>
    <div class="promotions_details">
      <img
        :src="details.banner"
        alt=""
        class="banner"
      />
      <p class="name">{{ details.name }}</p>
      <div class="activity_desc" v-html="details.activityDesc"></div>
      <div class="handler_btn deposit_btn_box" v-if="details.activityType == 'WELCOME_BONUS'&&tableData?.length==0">
        <p class="btn active deposit_btn" @click="depositFunc">{{ $t("user.deposit") }}</p>
      </div>
      <div class="progress_box" v-if="(details.activityType == 'WELCOME_BONUS'&&tableData?.length>0)||details.activityType != 'WELCOME_BONUS'">
        <p class="title">{{ $t("user.progress") }}</p>
        <div class="progress_item_box" v-if="details.activityType == 'WELCOME_BONUS'">
          <div class="progress_item">
            <!-- 奖金总额： -->
            <p>{{ $t("user.totalBonus") }}{{ welcomeStatic?.totalRewards || 0 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
          <div class="progress_item">
            <!-- 已领取： -->
            <p>{{ $t("user.received") }}{{ welcomeStatic?.receivedReward || 0 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
          <div class="progress_item">
            <!-- 待解锁： -->
            <p>{{ $t("user.unlocked") }}{{ welcomeStatic?.unlockReward || 0 }}</p>
            <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          </div>
        </div>
        <div class="progress_item_box" v-else>
          <div class="progress_item">
            <!-- 您获得总积分： -->
            <p>{{ $t("user.getTotalPoint") }}{{ pointStatic || 0 }}</p>
            <img src="@/assets/svg/user/icon_point.svg" alt="" />
          </div>
        </div>
      </div>
      <el-table :data="tableData" class="table_container" v-if="details.activityType == 'WELCOME_BONUS'&&tableData?.length>0">
        <el-table-column prop="id" :label="$t('user.round')" min-width="60" align="center" key="1" />
        <el-table-column prop="seriesName" :label="$t('user.spendingGoals')" min-width="140" align="center" key="2">
          <template #default="scope">
            <div class="progress_bar_box">
              <div class="progress_bar_active" :style="{ width: `${((scope.row.targetAmount-scope.row.consumptionAmount) / scope.row.targetAmount) * 100}%` }" v-if="scope.row.consumptionAmount!=scope.row.targetAmount">
                <p><span>{{ new bigNumber(scope.row.targetAmount).minus(new bigNumber(scope.row.consumptionAmount))  }}</span> / {{ scope.row.targetAmount }}</p>
              </div>
              <p v-else><span>{{new bigNumber(scope.row.targetAmount).minus(new bigNumber(scope.row.consumptionAmount)) }}</span> / {{ scope.row.targetAmount }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bonus" :label="$t('user.bonus')" min-width="60" align="center" key="3">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ scope.row.bonus || "--" }}</span>
              <img v-if="scope.row.bonus" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceFee" min-width="100" :label="$t('user.claim')" align="center" key="4" fixed="right">
          <template #default="scope">
            <p class="table-btn" v-if="scope.row.status == 'RECEIVED'">{{ $t("user.claimed") }}</p>
            <p class="table-btn active" v-else-if="scope.row.status == 'NOT_CLAIMED'" @click="activityReceiveFunc">
              {{ $t("user.claim") }}
            </p>
            <p class="btn-text" v-else-if="scope.row.status == 'IN_PROGRESS'">{{ $t("user.underWay") }}</p>
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
          <div class="conditions_content" v-show="isConditionsShow" v-html="details.conditionRule"></div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from "@/locales";
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { getActivityTargetList, getActivityTargetHeaderDataTotal, activityReceive, getActivityPoint } from "@/services/api/user";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat } from "@/utils";
export default {
  name: "myPromotions",
  props: {
    details: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isConditionsShow: false,
      tableData: [],
      welcomeStatic: {},
      pointStatic: null,
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
    // 欢迎奖金表格
    async getActivityTargetListFunc() {
      const res = await getActivityTargetList();
      if (res && res.code == 200) {
        this.tableData = res.data;
      }
    },
    // 欢迎奖金统计
    async getActivityTargetHeaderDataTotalFunc() {
      const res = await getActivityTargetHeaderDataTotal();
      if (res && res.code == 200) {
        this.welcomeStatic = res.data;
      }
    },
    // 积分
    async getActivityPointFunc() {
      const res = await getActivityPoint({ activityId: this.details.id });
      if (res && res.code == 200) {
        this.pointStatic = res.data;
      }
    },

    // 领取欢迎奖金
    async activityReceiveFunc() {
      const res = await activityReceive();
      if (res && res.code == 200) {
        this.$message.success(t("user.receiveSuccess"));
        this.getActivityTargetListFunc();
        this.getActivityTargetHeaderDataTotalFunc();
      }
    },

    goBack() {
      this.$emit("hide");
    },
    depositFunc() {
      this.$emit("depositFunc");
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.getActivityTargetListFunc();
      if (this.details.activityType == "WELCOME_BONUS") {
        this.getActivityTargetHeaderDataTotalFunc();
      } else {
        this.getActivityPointFunc();
      }
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
