<template>
  <div :class="['my_invite_wrapper', activeType == 'referred_user' && 'small_bg']">
    <div class="invite_text">
      <img src="@/assets/svg/user/icon_referrals.svg" alt="">
      <span>REFERRALS</span>
    </div>
    <div class="choose_box">
      <div class="coin_item" v-for="(item, index) in tabsList" :key="index" @click="handleChange(item)"
        :class="[activeType == item.value && 'active']">
        {{ item.label }}
      </div>
    </div>
    <div class="summary_box" v-if="activeType == 'summary'">
      <div class="invite_panel">
        <div class="title_text">Earn ETH and cent by sharing BITZING!</div>
        <div class="invite_description">
          Post your unique tracker in your socials, in your Discord and send it to anyone with a passion for NFTs
          with a little explanation of Bitzing. You will be handsomely rewarded with up to <span style="color:white">{{
            new bigNumber(setting.consumePointRate).multipliedBy(100) }}%</span>
          of their daily purchases and paid to you in ETH.
        </div>
      </div>
      <div class="create_invite_code">
        <div class="create_title">Set custom referrals code</div>
        <el-input class="create_input" @blur="onVerify()" v-model="inviteCode" placeholder="Set referral code...">
          <template #append>
            <div class="create_btn" @click="createInvite()">CREATE</div>
          </template>
        </el-input>
        <div class="create_error">{{ inviteTips }}</div>
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
        <el-table :data="inviteList" height="18.625rem" class="table_container" style="width: 100%">
          <el-table-column prop="inviteCode" label="CODE" align="center" />
          <el-table-column prop="receiveAmount" label="CLAIMED" align="center" />
          <el-table-column prop="invitePeople" label="REFS" align="center" />
          <el-table-column prop="pointAmount" label="POINT" align="center" />
          <el-table-column prop="traAmount" label="CONSUMPTION" align="center" />
          <el-table-column label="CLAIM" align="center">
            <template #default="scope">
              <div class="claim_box" @click="handleReceive(scope.row)">
                <span>CLAIM</span>
                <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
                <span>{{ new bigNumber(scope.row.totalAmount || 0).minus(scope.row.receiveAmount || 0) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="COPY" align="center">
            <template #default="scope">
              <div class="copy_btn">
                <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInviteLink(scope.row.inviteCode)" alt="">
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box" v-if="count > size">
          <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
            layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
        </div>
      </div>
    </div>
    <div class="referred_user_box" v-else>
      <el-table :data="detailList" class="table_container" height="26.5rem" style="width: 100%">
        <el-table-column prop="inviteCode" label="REFERRAL CODE" align="center" />
        <el-table-column prop="userName" label="USERNAME" align="center" />
        <el-table-column prop="rebatesAmount" label="CONSUMPTION" align="center">
          <template #default="scope">
            <div class="consumption_box">
              <span>{{ scope.row.rebatesAmount }}</span>
              <img src="@/assets/svg/user/icon_invite_ethereum.svg" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pointAmount" label="POINT" align="center" />
        <el-table-column prop="createTime" label="REFERRED AT" align="center">
          <template #default="scope">
            {{ timeFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="this.count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

import {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  rebatesReceive,
  rebatesDetailPageList,
  getSetting
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
import { onCopy, timeFormat } from "@/utils";
export default {
  name: 'myInvite',
  data() {
    return {
      activeType: "summary",
      tabsList: [{
        label: "SUMMARY",
        value: "summary"
      }, {
        label: "REFERRED USERS",
        value: "referred_user"
      }],
      inviteCode: null,
      verifys: false,
      inviteTips: null,
      statisticsRow: null,
      inviteList: [],
      detailList: [],
      page: 1,
      size: 5,
      count: 0,
      setting: {
        withdrawalFees: null
      }
    };
  },
  computed: {
    ...mapStores(useUserStore),
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    }
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    handleChange(event) {
      this.page = 1;
      this.size = 5;
      this.count = 0;
      this.activeType = event.value;

      if (event.value == "summary") {
        this.fetchInvateStatistics();
        this.fetchRebatesFindList();
      } else {
        this.size = 8;
        this.fetchDetailPageList();
      }
    },
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
    // 邀请统计
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
          invites.splice(2, 1);
        }

        this.statisticsRow = invites;
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList() {
      const res = await rebatesFindList();
      if (res && res.code == 200) {
        this.inviteList = res.data;
      }
    },
    // 邀请详情列表
    async fetchDetailPageList() {
      const res = await rebatesDetailPageList({
        page: this.page,
        size: this.size
      });
      if (res && res.code == 200) {
        this.detailList = res.data.records;
        this.count = res.data.total;
      }
    },
    // 领取佣金
    async handleReceive(event) {
      const receiveBalance = Number(new bigNumber(event.totalAmount || 0).minus(event.receiveAmount || 0));
      if (!receiveBalance) {
        this.$message.error("Commission has been received");
        return
      }
      const res = await rebatesReceive({
        inviteCode: event.inviteCode
      });
      if (res && res.code == 200) {
        this.$message.success("Receive success");
        this.fetchRebatesFindList();
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchDetailPageList();
    },
    // 复制邀请链接
    copyInviteLink(event) {
      const currentLink = window.location;
      let link = currentLink.origin + "/Home/" + event;
      onCopy(link);
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH"
      });

      if (res && res.code == 200) {
        this.setting = res.data;
        this.$forceUpdate();
      }
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchInvateStatistics();
      this.fetchRebatesFindList();
      this.fetchSetting();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./components/invite.scss";
</style>
    