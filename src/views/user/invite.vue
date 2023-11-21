<template>
  <div
    :class="['my_invite_wrapper', activeType == 'referred_user' && 'small_bg']"
  >
    <div class="invite_text">
      <img src="@/assets/svg/user/icon_referrals.svg" alt="" />
      <span>{{ $t("user.referrals") }}</span>
    </div>
    <div class="choose_box">
      <div
        class="coin_item"
        v-for="(item, index) in tabsList"
        :key="index"
        @click="handleChange(item)"
        :class="[activeType == item.value && 'active']"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="summary_box" v-if="activeType == 'summary'">
      <div class="invite_panel">
        <div class="title_text">{{ $t("user.inviteTitle") }}</div>
        <div
          class="invite_description"
          v-html="
            $t('user.inviteDescription', {
              num: new bigNumber(setting.downCommissionRate).multipliedBy(100),
            })
          "
        ></div>
      </div>
      <div class="create_invite_code">
        <div class="create_title">{{ $t("user.createTitle") }}</div>
        <el-input
          class="create_input"
          @blur="onVerify()"
          v-model="inviteCode"
          :placeholder="$t('user.createEnterHint')"
        >
          <template #append>
            <div class="create_btn" @click="createInvite()">
              {{ $t("user.create") }}
            </div>
          </template>
        </el-input>
        <div class="create_error">{{ inviteTips }}</div>
      </div>
      <div class="statistics_panel">
        <div class="statistics_title">{{ $t("airdrop.yourStatistics") }}</div>
        <div class="statistics_box">
          <div
            class="statistics_item"
            v-for="(item, index) in statisticsRow"
            :key="index"
          >
            <div class="statistics_type">
              <div class="title">{{ $t("user." + item.statisticsType) }}</div>
              <div
                class="val"
                v-if="
                  item.statisticsType == 'CLICKS' ||
                  item.statisticsType == 'REFERRALS'
                "
              >
                {{ item.totalData }}
              </div>
              <div class="val" v-priceFormat="item.totalData" v-else></div>
            </div>
            <div class="statistics_time">
              <div class="title">{{ $t("airdrop.toDay") }}</div>
              <div
                class="val"
                v-if="
                  item.statisticsType == 'CLICKS' ||
                  item.statisticsType == 'REFERRALS'
                "
              >
                {{ item.todayData }}
              </div>
              <div class="val" v-priceFormat="item.todayData" v-else></div>
            </div>
            <div class="statistics_time">
              <div class="title">{{ $t("airdrop.yesterday") }}</div>
              <div
                class="val"
                v-if="
                  item.statisticsType == 'CLICKS' ||
                  item.statisticsType == 'REFERRALS'
                "
              >
                {{ item.yesterdayData }}
              </div>
              <div class="val" v-priceFormat="item.yesterdayData" v-else></div>
            </div>
            <div class="statistics_time">
              <div class="title">{{ $t("airdrop.thisMonth") }}</div>
              <div
                class="val"
                v-if="
                  item.statisticsType == 'CLICKS' ||
                  item.statisticsType == 'REFERRALS'
                "
              >
                {{ item.thisMonthData }}
              </div>
              <div class="val" v-priceFormat="item.thisMonthData" v-else></div>
            </div>
            <div class="statistics_time">
              <div class="title">{{ $t("airdrop.lastMonth") }}</div>
              <div
                class="val"
                v-if="
                  item.statisticsType == 'CLICKS' ||
                  item.statisticsType == 'REFERRALS'
                "
              >
                {{ item.lastMonthData }}
              </div>
              <div class="val" v-priceFormat="item.lastMonthData" v-else></div>
            </div>
          </div>
        </div>
        <el-table
          :data="inviteList"
          height="23.5rem"
          class="table_container"
          style="width: 100%"
        >
          <el-table-column
            prop="traAmount"
            :label="$t('user.default')"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <img
                class="setCode"
                v-if="scope.row.defaultStatus == 'TRUE'"
                src="@/assets/svg/icon_choose_active.svg"
                alt=""
              />
              <img
                class="setCode"
                v-else
                @click="setDefault(scope.row)"
                src="@/assets/svg/icon_choose.svg"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="inviteCode"
            :label="$t('user.code')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="receiveAmount"
            :label="$t('user.claimed')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="invitePeople"
            :label="$t('user.refs')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="%" align="center" show-overflow-tooltip>
            <template #default>
              {{
                `${new bigNumber(setting.downCommissionRate || 0).multipliedBy(
                  100,
                )}%`
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="traAmount"
            :label="$t('user.default')"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="consumption_box">
                <span v-priceFormat="scope.row.traAmount"></span>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('user.claim')"
            width="200"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div
                v-if="extraMoney(scope.row) > 0"
                :class="['claim_box']"
                @click="handleReceive(scope.row)"
              >
                <span>{{ $t("user.claim") }}</span>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>{{ accurateDecimal(extraMoney(scope.row), 2) }}</span>
              </div>
              <div v-else :class="['claim_box', 'disabled']">
                <span>{{ $t("user.claim") }}</span>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>{{ accurateDecimal(extraMoney(scope.row), 2) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('user.copy')"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <div class="copy_btn">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Copy"
                  placement="top"
                >
                  <img
                    src="@/assets/svg/user/icon_invite_copy.svg"
                    @click="copyInviteLink(scope.row.inviteCode)"
                    alt=""
                  />
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Share on Twitter"
                  placement="top"
                >
                  <img
                    src="@/assets/svg/airdrop/icon_twitter_btn.svg"
                    @click="shareInviteLink(scope.row.inviteCode)"
                    alt=""
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="referred_user_box" v-else>
      <el-table
        :data="detailList"
        class="table_container"
        height="26.5rem"
        style="width: 100%"
      >
        <el-table-column
          prop="inviteCode"
          :label="$t('user.referralCode')"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="userName"
          :label="$t('user.userName')"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="traAmount"
          :label="$t('user.default')"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="consumption_box">
              <span v-priceFormat="scope.row.traAmount"></span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="rebatesAmount"
          :label="$t('user.rewards')"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div class="consumption_box">
              <span v-priceFormat="scope.row.rebatesAmount"></span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('user.date')"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ timeFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="this.count > size">
        <el-pagination
          v-model="page"
          :page-size="size"
          @current-change="handleCurrentChange"
          :pager-count="5"
          layout="prev, pager, next"
          :total="count"
          prev-text="Pre"
          next-text="Next"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { i18n } from "@/locales";
const { t } = i18n.global;

import {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  rebatesReceive,
  rebatesDetailPageList,
  getSetting,
  setDefaultCode,
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
import { onCopy, timeFormat, openUrl, accurateDecimal } from "@/utils";
export default {
  name: "myInvite",
  data() {
    return {
      activeType: "summary",
      tabsList: [
        {
          label: "SUMMARY",
          value: "summary",
        },
        {
          label: "REFERRED USERS",
          value: "referred_user",
        },
      ],
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
        downCommissionRate: null,
      },
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
    },
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
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
        this.inviteTips = t("user.enterCodeError1");
        this.verifys = false;
        return;
      } else if (inviteCode.length < 3) {
        this.inviteTips = t("user.enterCodeError2");
        this.verifys = false;
        return;
      }

      this.inviteTips = "";
      this.verifys = true;
    },
    // 创建邀请吗
    async createInvite() {
      this.onVerify();
      if (!this.verifys) return;
      const res = await rebatesCreateCode({
        code: this.inviteCode,
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
          invites.splice(2, 1);
        }

        this.statisticsRow = invites;
      }
    },
    // 设置默认邀请码
    async setDefault(event) {
      const res = await setDefaultCode({
        inviteCode: event.inviteCode,
      });
      if (res && res.code == 200) {
        this.$message.success(t("common.operationTips"));
        this.fetchRebatesFindList();
      }
    },
    // 邀请资产列表
    async fetchRebatesFindList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const res = await rebatesFindList({
        page: _page,
        size: size,
      });
      if (res && res.code == 200) {
        this.inviteList = res.data;
      }
    },
    // 邀请详情列表
    async fetchDetailPageList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const res = await rebatesDetailPageList({
        page: _page,
        size: size,
      });
      if (res && res.code == 200) {
        this.detailList = res.data.records;
        this.count = res.data.total;
      }
    },
    // 计算剩余未领取佣金
    extraMoney(event) {
      const receiveBalance = Number(
        new bigNumber(event.totalAmount || 0).minus(event.receiveAmount || 0),
      );
      return receiveBalance;
    },
    // 领取佣金
    async handleReceive(event) {
      const receiveBalance = Number(
        new bigNumber(event.totalAmount || 0).minus(event.receiveAmount || 0),
      );
      if (!receiveBalance) {
        this.$message.error(t("user.receivedHint"));
        return;
      }
      const res = await rebatesReceive({
        inviteCode: event.inviteCode,
      });
      if (res && res.code == 200) {
        this.$message.success(t("user.receiveSuccess"));
        this.renewBalance();
        this.fetchRebatesFindList();
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      if (this.activeType == "summary") {
        this.fetchRebatesFindList(false);
      } else {
        this.fetchDetailPageList(false);
      }
    },
    // 复制邀请链接
    copyInviteLink(event) {
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/Home/" + event;
      onCopy(link);
    },
    // 分享邀请链接到推特
    shareInviteLink(event) {
      const currentLink = "https://www.bitzing.io";
      let link = currentLink + "/Home/" + event;
      const inviteText = this.setting.inviteText.replace(/,/g, "\n");

      // 构建推特的分享链接
      var twitterUrl =
        "https://twitter.com/share?text=" +
        encodeURIComponent(inviteText) +
        "&url=" +
        link;
      // 在新窗口中打开推特分享链接
      openUrl(twitterUrl);
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH",
      });

      if (res && res.code == 200) {
        this.setting = res.data;
        this.$forceUpdate();
      }
    },
    // 更新当前余额
    async renewBalance() {
      const headerStore = useHeaderStore();
      await headerStore.getTheUserBalanceApi();
    },
  },
  created() {
    this.tabsList = [
      {
        label: t("user.summary"),
        value: "summary",
      },
      {
        label: t("user.referredUser"),
        value: "referred_user",
      },
    ];

    if (this.isLogin && this.userInfo?.id) {
      this.fetchInvateStatistics();
      this.fetchRebatesFindList();
      this.fetchSetting();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/invite.scss";
</style>
