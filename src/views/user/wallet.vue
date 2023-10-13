<template>
  <div class="my_wallet_wrapper">
    <div class="wallet_panel">
      <div class="balance_box">
        <div class="balance_l">
          <img src="@/assets/svg/user/icon_balances.svg" alt="">
          <div class="title_text">{{ $t("user.balance") }}</div>
        </div>
        <div class="balance_r" @click="showRecharge = true">{{ $t("user.cashier") }}</div>
      </div>
      <div class="balance_item">
        <div class="balance_item_l">
          <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          <div class="num">
            <span>{{ Number(accurateDecimal(ethBalance, 4)).toLocaleString(undefined, {
              minimumFractionDigits: 4
            }) || 0 }}</span>
            <span>ETH</span>
          </div>
        </div>
      </div>
      <div class="balance_item">
        <div class="balance_item_l">
          <img src="@/assets/svg/user/icon_profile.svg" alt="" />
          <div class="num">
            <span>{{ Number(userPoints).toLocaleString() || 0 }}</span>
            <span>{{ $t("user.point") }}</span>
          </div>
        </div>
        <div class="balance_item_r" @click="showPoints = true">
          <span class="details">{{ $t("user.details") }}</span>
          <img src="@/assets/svg/user/icon_link.svg" alt="" />
        </div>
      </div>
      <div class="balance_item">
        <div class="balance_item_l">
          <img src="@/assets/svg/user/icon_tickets.svg" alt="" />
          <div class="num">
            <span>{{ Number(userTickets).toLocaleString() || 0 }}</span>
            <span>{{ $t("user.tickets") }}</span>
          </div>
        </div>
      </div>
      <div class="wallet_operating">
        <div class="title_text">{{ $t("user.historyTitle") }}</div>
        <div class="choose_box">
          <div class="coin_item" v-for="(item, index) in coinList" :key="index" @click="searchHistory(item)"
            :class="coin == item && ['active']">
            {{ item }}
          </div>
          <div class="replenish_operating">
            <div class="replenish">{{ $t("user.notReceived") }}</div>
            <div class="retrieve" @click="showReplenish = true">
              {{ $t("user.btnReplenish") }}
            </div>
          </div>
        </div>
      </div>
      <el-table :data="historyData" class="table_container">
        <el-table-column prop="logType" :label="$t('user.balanceTabel1')" min-width="100" align="center" key="1">
          <template #default="scope">
            {{ scope.row.logType == "DEPOST" ? "DEPOSIT" : scope.row.logType }}
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" v-if="coin == 'NFT'" :label="$t('user.balanceTabel7')" min-width="100"
          align="center" key="2" show-overflow-tooltip />
        <el-table-column prop="tokenId" v-if="coin == 'NFT'" min-width="100" label="TOKEN ID" align="center" key="3">
          <template #default="scope">
            {{ `#${scope.row.tokenId}` }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceFee" v-if="coin == 'NFT'" min-width="100" :label="$t('user.balanceTabel8')"
          align="center" key="4">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ scope.row.serviceFee || "--" }}</span>
              <img v-if="scope.row.serviceFee" src="@/assets/svg/user/icon_ethereum.svg" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" v-if="coin != 'NFT'" min-width="100" :label="$t('user.balanceTabel2')"
          align="center" key="5">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ accurateDecimal(scope.row.amount, 4) }}</span>
              <img :src="getCion(scope.row.coin)" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="eth_amount" v-if="coin != 'NFT'" min-width="120" :label="$t('user.balanceTabel3')"
          align="center" key="6">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ accurateDecimal(scope.row.criditAmount, 4) }}</span>
              <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="chainType" v-if="coin != 'NFT'" :label="$t('user.network')" min-width="100" align="center"
          key="7" show-overflow-tooltip />
        <el-table-column prop="syncStatus" :label="$t('user.balanceTabel4')" min-width="140" align="center" key="8">
          <template #default="scope">
            <div :class="['sync_status', scope.row.syncStatus]">
              <span> {{ scope.row.syncStatus }}</span>
              <el-tooltip v-if="scope.row.syncStatus == 'REJECTED' || scope.row.syncStatus == 'FAIL'"
                popper-class="tips_box" effect="dark" placement="top">
                <template #content>
                  <span v-if="scope.row.syncStatus == 'FAIL'">
                    The chain is congested and the transfer failed, please try again later.
                  </span>
                  <span v-else-if="scope.row.syncStatus == 'REJECTED'">
                    {{ scope.row.remark }}
                  </span>
                </template>
                <img src="@/assets/svg/user/icon_info.svg" alt="">
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creation_time" :label="$t('user.balanceTabel5')" min-width="160" align="center" key="9">
          <template #default="scope">
            {{ timeFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.balanceTabel6')" align="center" min-width="80" key="10" fixed="right">
          <template #default="scope">
            <div class="view_btn"
              v-if="scope.row.syncStatus != 'REJECTED' && scope.row.syncStatus != 'FAIL' && scope.row.hash"
              @click="viewTxid(scope.row)">{{ $t("user.view") }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="5"
          layout="prev, pager, next" :total="count" :prev-text="$t('common.prev')" :next-text="$t('common.next')" />
      </div>
    </div>
    <!-- 查询补足余额 -->
    <el-dialog v-model="showReplenish" width="50rem" lock-scroll :close-on-click-modal="false" :align-center="true"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="replenish_box">
        <div class="operating_title">
          <span>{{ $t("user.enterId") }}</span>
        </div>
        <el-input class="wallet_addr" v-model="transactionId" :placeholder="$t('user.enterHint')">
        </el-input>
        <div class="btns_box">
          <div class="btn_item cancel" @click="handleClose()">{{ $t('common.cancel') }}</div>
          <div class="btn_item submit" @click="onRechargeByHash()">{{ $t('common.submitLower') }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 充值ETH USDT -->
    <Recharge v-if="showRecharge" @closeDialogFun="handleClose()"></Recharge>
    <!-- 积分详情弹窗 -->
    <Points v-if="showPoints" @closeDialogFun="handleClose()"></Points>
  </div>
</template>
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import {
  getWithdrawalHistory,
  rechargeByHash,
  getTheUserPoint,
  getNftWithdrawalList
} from "@/services/api/user";
import { getUserTotalTicket } from "@/services/api/oneBuy";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat, openUrl, isEthTransactionHashValid } from "@/utils";
import Points from "./pointsDetails.vue";
import Recharge from "./recharge.vue";
export default {
  name: "myWallet",
  components: {
    Points,
    Recharge
  },
  data() {
    return {
      coin: "COIN",
      coinList: ["COIN", "NFT"],
      historyData: [],
      userPoints: null,
      userTickets: null,

      showRecharge: false,

      showReplenish: false, // 充值补充
      transactionId: null,
      timer: null,
      rateTimer: null,

      page: 1,
      size: 5,
      count: 0,

      showPoints: false
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
    loadLog() {
      const { loadLog } = this.userStore;
      return loadLog;
    },
    currencyData() {
      const { currencyData } = this.userStore;
      return currencyData;
    }
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 个人总参与票数
    async fetchUserTotalTicket() {
      const res = await getUserTotalTicket();
      if (res && res.code == 200) {
        this.userTickets = res.data;
      }
    },
    // 积分余额
    async fetchTheUserPoint() {
      const res = await getTheUserPoint();
      if (res && res.code == 200) {
        this.userPoints = res.data.balance;
      }
    },
    // 充值补充
    async onRechargeByHash() {
      const { transactionId } = this;
      if (!transactionId) {
        this.$message.error(t("user.enterHint1"));
        return;
      }

      if (!isEthTransactionHashValid(transactionId)) {
        this.$message.error(t("errorTips.transaction_id_does_not_exist"));
        return
      }

      const res = await rechargeByHash({
        hash: transactionId,
      });

      if (res && res.code == 200) {
        this.$message.success(t("user.enterHint2"));
        this.handleClose();
      }
    },
    // 关闭创建弹窗
    handleClose(done) {

      this.transactionId = null;

      if (done) {
        done();
        return;
      }

      this.showReplenish = false;
      this.showRecharge = false;
      this.showPoints = false;
    },
    // 检索历史
    searchHistory(event) {
      this.coin = event;
      if (this.coin == "NFT") {
        this.fetchNftWithdrawalList(false);
        return
      }


      this.historyData = [];
      this.fetchHistory();
    },
    // 充值提款历史
    async fetchHistory(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getWithdrawalHistory({
        coin: "",
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        this.historyData = res.data.records;
        this.count = res.data.total;
      }
    },

    // NFT充值提款历史
    async fetchNftWithdrawalList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      const res = await getNftWithdrawalList({
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        this.historyData = res.data.records;
        this.count = res.data.total;
      }
    },
    viewTxid(event) {
      let chainLink = process.env.VUE_APP_TRANSACTION_ADDR;
      if (event.chainType == "OKT_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.chainType == "BSC_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_TEST_ADDR;
      } else if (event.chainType == "BASE") {
        chainLink = process.env.VUE_APP_CHAIN_BASE_ADDR;
      } else if (event.chainType == "BSC") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_ADDR;
      } else if (event.chainType == "OKT") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_ADDR;
      } else if (event.chainType == "ThunderCore") {
        chainLink = process.env.VUE_APP_CHAIN_THUNDERCORE_ADDR;
      }
      openUrl(`${chainLink}${event.hash}`);
    },
    handleCurrentChange(page) {
      this.page = page;
      if (this.coin == "NFT") {
        this.fetchNftWithdrawalList(false);
        return
      }
      this.fetchHistory(false);
    },
    getCion(event) {
      const { currencyData } = this;
      const coin = currencyData.find(e => e.name == event);
      return coin?.img || event
    }
  },
  watch: {
    loadLog() {
      if (this.coin == "NFT") {
        return
      }

      this.fetchHistory();
    }
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchHistory();
      this.fetchTheUserPoint();
      this.fetchUserTotalTicket();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>
