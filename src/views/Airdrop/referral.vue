<template>
  <div class="referral_container">
    <div class="referral_title">{{ $t("airdrop.referralsTitles") }}</div>
    <div class="step_box">
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_connect_wallet.svg" alt="">
        <div class="dots">1</div>
        <div class="description">{{ $t("airdrop.referralsText1") }}</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_share_link.svg" alt="">
        <div class="dots">2</div>
        <div class="description">{{ $t("airdrop.referralsText2") }}</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_successfully_invited.svg" alt="">
        <div class="dots">3</div>
        <div class="description">{{ $t("airdrop.referralsText3") }}</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_calculate_income.svg" alt="">
        <div class="dots">4</div>
        <div class="description">{{ $t("airdrop.referralsText4") }}</div>
      </div>
      <div class="interval_box">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
      </div>
    </div>
    <div class="statistics_panel">
      <div class="statistics_title">{{ $t("airdrop.yourStatistics") }}</div>
      <div class="statistics_box">
        <div class="statistics_item" v-for="(item, index) in statisticsRow" :key="index">
          <div class="statistics_type">
            <div class="title">{{ item.statisticsType }}</div>
            <div class="val">{{ item.totalData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">{{ $t("airdrop.toDay") }}</div>
            <div class="val">{{ item.todayData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">{{ $t("airdrop.yesterday") }}</div>
            <div class="val">{{ item.yesterdayData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">{{ $t("airdrop.thisMonth") }}</div>
            <div class="val">{{ item.thisMonthData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">{{ $t("airdrop.lastMonth") }}</div>
            <div class="val">{{ item.lastMonthData }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="create_invite_code">
      <div class="create_title">{{ $t("airdrop.setCodeTips") }}</div>
      <el-input class="create_input" @blur="onVerify()" v-model="inviteCode" :placeholder="$t('airdrop.setCodeHint')">
        <template #append>
          <div class="create_btn" @click="createInvite()">{{ $t("airdrop.createBtn") }}</div>
        </template>
      </el-input>
      <div class="create_error">{{ inviteTips }}</div>
    </div>
    <el-table :data="inviteList" class="table_container" style="width: 100%">
      <el-table-column prop="inviteCode" :label="$t('airdrop.code')" align="center" />
      <el-table-column prop="invitePeople" :label="$t('airdrop.refs')" align="center" />
      <el-table-column prop="pointAmount" :label="$t('airdrop.regist')" align="center" />
      <el-table-column prop="traAmount" label="%" align="center">
        <template #default>
          {{ commissionrate }}
        </template>
      </el-table-column>
      <el-table-column prop="extraPointAmount" :label="$t('airdrop.bonus')" align="center"></el-table-column>
      <el-table-column label="COPY" align="center" fixed="right">
        <template #default="scope">
          <div class="copy_btn">
            <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInviteLink(scope.row.inviteCode)" alt="">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-box">
      <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
        layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
    </div> -->
  </div>
</template>
  
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  getSetting
} from "@/services/api/invite";
import { onCopy } from "@/utils";
import bigNumber from "bignumber.js";
export default {
  name: 'AirdropReferral',
  data() {
    return {
      inviteCode: null,
      verifys: false,
      inviteTips: null,
      inviteList: [],
      statisticsRow: [],
      setting: {
        downCommissionRate: 0,
        withdrawalFees: 0
      },
      page: 1,
      size: 10,
      count: 0,
      timer: null
    };
  },
  watch: {
    inviteCode(newV) {
      const reg = /[^A-Za-z0-9]/g;
      if (!newV) return

      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(() => {
        this.inviteCode = newV.replace(reg, "").slice(0, 45);
      }, 300);
    }
  },
  computed: {
    ...mapStores(useUserStore),
    commissionrate() {
      const { downPointRate } = this.setting;
      const rateVal = new bigNumber(downPointRate || 0).multipliedBy(100)
      return `${rateVal}%`
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
  },
  methods: {
    bigNumber: bigNumber,
    // 验证
    onVerify() {
      const { inviteCode } = this;
      if (!inviteCode) {
        this.inviteTips = t("airdrop.enterCodeHint");
        this.verifys = false;
        return
      } else if (inviteCode.length < 3) {
        this.inviteTips = t("airdrop.enterCodeNum");
        this.verifys = false;
        return
      }

      this.inviteTips = "";
      this.verifys = true;
    },
    // 创建邀请码
    async createInvite() {
      this.onVerify();
      if (!this.verifys) return
      const res = await rebatesCreateCode({
        code: this.inviteCode
      });
      if (res && res.code == 200) {
        this.inviteCode = null;
        this.$message.success(t("common.createdTips"));
        this.fetchRebatesFindList();
      }
    },
    // 邀请统计
    async fetchInvateStatistics() {
      const res = await userInvateStatistics();
      if (res && res.code == 200) {
        const invites = res.data;
        if (invites.length > 3) {
          invites.splice(3, 1);
        }

        this.statisticsRow = invites;
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }
      const res = await rebatesFindList({
        page: _page,
        size: size
      });
      if (res && res.code == 200) {
        this.inviteList = res.data;
      }
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH"
      });
      if (res && res.code == 200) {
        this.setting = res.data;
      }
    },
    // 复制邀请链接
    copyInviteLink(event) {
      const currentLink = window.location;
      const link = currentLink.origin + "/Airdrop/" + event;
      onCopy(link);
    },
    // 翻页
    handleCurrentChange(page) {
      this.page = page;
      this.fetchRebatesFindList();
    }
  },
  created() {
    if (!this.isLogin || !this.userInfo?.id) return
    this.fetchInvateStatistics();
    this.fetchRebatesFindList();
    this.fetchSetting();
  }
};
</script>
  
<style lang="scss" scoped>
@import "./components/referral.scss";
</style>