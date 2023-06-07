<template>
  <div class="referral_container">
    <div class="referral_title">MY BIGZING AIRDROP REFERRAL LINK</div>
    <div class="step_box">
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_connect_wallet.svg" alt="">
        <div class="dots">1</div>
        <div class="description">Connect wallet and copy your referral link below</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_share_link.svg" alt="">
        <div class="dots">2</div>
        <div class="description">Send the link to your friend or share in your socials</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_successfully_invited.svg" alt="">
        <div class="dots">3</div>
        <div class="description">Any user connect wallet and sign in with your link.</div>
      </div>
      <div class="step_item">
        <img src="@/assets/svg/airdrop/icon_calculate_income.svg" alt="">
        <div class="dots">4 </div>
        <div class="description">As the referrer, you will get 10% points as rewards from each verified user.</div>
      </div>
      <div class="interval_box">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
        <img src="@/assets/svg/airdrop/icon_arrow.svg" alt="">
      </div>
    </div>
    <div class="create_invite_code">
      <div class="create_title">SET CUSTOM REFERRALS CODE</div>
      <el-input class="create_input" @blur="onVerify()" v-model="inviteCode" placeholder="Set referral code...">
        <template #append>
          <div class="create_btn" @click="createInvite()">CREATE</div>
        </template>
      </el-input>
      <div class="create_error">{{ inviteTips }}</div>
    </div>
    <el-table :data="inviteList" class="table_container" style="width: 100%">
      <el-table-column prop="inviteCode" label="CODE" align="center" />
      <el-table-column prop="invitePeople" label="REFS" align="center" />
      <el-table-column prop="pointAmount" label="REGIST POINT" align="center" />
      <el-table-column prop="traAmount" label="%" align="center">
        <template #default>
          {{ commissionrate }}
        </template>
      </el-table-column>
      <el-table-column label="EXTRA POINT" align="center"></el-table-column>
      <el-table-column label="COPY" align="center">
        <template #default="scope">
          <div class="copy_btn">
            <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInviteLink(scope.row.inviteCode)" alt="">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
        layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
    </div>
    <div class="statistics_panel">
      <div class="statistics_title">YOUR STATISTICS</div>
      <div class="statistics_box">
        <div class="statistics_item" v-for="(item, index) in statisticsRow" :key="index">
          <div class="statistics_type">
            <div class="title">{{ item.statisticsType }}</div>
            <div class="val">{{ item.totalData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">Today</div>
            <div class="val">{{ item.todayData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">Yesterday</div>
            <div class="val">{{ item.yesterdayData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">This month</div>
            <div class="val">{{ item.thisMonthData }}</div>
          </div>
          <div class="statistics_time">
            <div class="title">Last month</div>
            <div class="val">{{ item.lastMonthData }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
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
      size: 6,
      count: 0,
    };
  },
  computed: {
    commissionrate() {
      const { downCommissionRate } = this.setting;
      const rateVal = new bigNumber(downCommissionRate).multipliedBy(100)
      return `${rateVal}%`
    }
  },
  methods: {
    bigNumber: bigNumber,
    // 验证
    onVerify() {
      const { inviteCode } = this;
      if (!inviteCode) {
        this.inviteTips = "Please enter the invitation code here";
        this.verifys = false;
        return
      } else if (inviteCode.length < 3) {
        this.inviteTips = "Must be at least 3 characters";
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
        this.$message.success("Created successfully");
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
      const link = currentLink.origin + "/home?code=" + event;
      onCopy(link);
    },
    // 翻页
    handleCurrentChange(page) {
      this.page = page;
      this.fetchRebatesFindList();
    }
  },
  created() {
    this.fetchInvateStatistics();
    this.fetchRebatesFindList();
    this.fetchSetting();
  }
};
</script>
  
<style lang="scss" scoped>
@import "./components/referral.scss";
</style>