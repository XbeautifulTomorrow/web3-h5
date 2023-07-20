<template>
  <div class="my_wallet_wrapper">
    <div class="wallet_panel">
      <div class="balance_box">
        <div class="balance_l">
          <img src="@/assets/svg/user/icon_balances.svg" alt="">
          <div class="title_text">BALANCES</div>
        </div>
        <div class="balance_r" @click="showRecharge = true">CASHIER</div>
      </div>
      <div class="balance_item">
        <div class="balance_item_l">
          <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
          <div class="num">
            <span>{{ ethBalance || 0 }}</span>
            <span>ETH</span>
          </div>
        </div>
      </div>
      <div class="balance_item">
        <div class="balance_item_l">
          <img src="@/assets/svg/user/icon_profile.svg" alt="" />
          <div class="num">
            <span>{{ userPoints || 0 }}</span>
            <span>POINTS</span>
          </div>
        </div>
        <div class="balance_item_r" @click="showPoints = true">
          <span class="details">Details</span>
          <img src="@/assets/svg/user/icon_link.svg" alt="" />
        </div>
      </div>
      <div class="wallet_operating">
        <div class="title_text">DEPOSIT & WITHDRAWAL HISTORY</div>
        <div class="choose_box">
          <div class="coin_item" v-for="(item, index) in coinList" :key="index" @click="searchHistory(item)"
            :class="coin == item && ['active']">
            {{ item }}
          </div>
          <div class="replenish">Missing contract ETH deposit?</div>
          <div class="retrieve" @click="showReplenish = true">
            Request deposit address sweep
          </div>
        </div>
      </div>
      <el-table :data="historyData" class="table_container" style="width: 100%">
        <el-table-column prop="logType" label="LOG TYPE" align="center" />
        <el-table-column prop="amount" label="AMOUNT" align="center">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ scope.row.criditAmount }}</span>
              <img v-if="scope.row.criditCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="">
              <img v-else-if="scope.row.criditCoin == 'USDT'" src="@/assets/svg/user/icon_usdt.svg" alt="">
              <span v-else>{{ scope.row.criditCoin }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="eth_amount" label="ETH AMOUNT" align="center">
          <template #default="scope">
            <div class="amount_box">
              <span>{{ scope.row.amount }}</span>
              <img v-if="scope.row.coin == 'ETH'" src="@/assets/svg/user/icon_eth.svg" alt="">
              <img v-else-if="scope.row.coin == 'USDT'" src="@/assets/svg/user/icon_usdt.svg" alt="">
              <span v-else>{{ scope.row.coin }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="syncStatus" label="STATUS" align="center">
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
        <el-table-column prop="creation_time" label="DATE/TIME" align="center">
          <template #default="scope">
            {{ timeFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="TRANSACTION" align="center">
          <template #default="scope">
            <div class="view_btn"
              v-if="scope.row.syncStatus != 'REJECTED' && scope.row.syncStatus != 'FAIL' && scope.row.hash"
              @click="viewTxid(scope.row.hash)">VIEW</div>
              <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="count > size">
        <el-pagination v-model="page" :page-size="size" @current-change="handleCurrentChange" :pager-count="7"
          layout="prev, pager, next" :total="count" prev-text="Pre" next-text="Next" />
      </div>
    </div>
    <!-- 查询补足余额 -->
    <el-dialog v-model="showReplenish" width="50rem" lock-scroll :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="replenish_box">
        <div class="operating_title">
          <span>ENTER TRANSACTION ID</span>
        </div>
        <el-input class="wallet_addr" v-model="transactionId" placeholder="Paste your ERC20 wallet address here">
        </el-input>
        <div class="btns_box">
          <div class="btn_item cancel" @click="handleClose()">Cancel</div>
          <div class="btn_item submit" @click="onRechargeByHash()">Submit</div>
        </div>
      </div>
    </el-dialog>
    <!-- 充值ETH USDT -->
    <el-dialog v-model="showRecharge" width="50rem" lock-scroll :close-on-click-modal="false" :before-close="handleClose">
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="recharge_box">
        <div class="operating_box">
          <div class="operating_btn" :class="[walletOperating == 1 && 'active']" @click="handleOperating(1)">
            DEPOST
          </div>
          <div class="operating_btn" :class="[walletOperating == 2 && 'active']" @click="handleOperating(2)">
            WITHDRAW
          </div>
        </div>
        <div class="choose_operating" v-if="operatingCoin == null">
          <div class="operating_title">
            <span v-if="walletOperating == 1">DEPOSIT OPTIONS</span>
            <span v-else>WITHDRAW OPTIONS</span>
          </div>
          <div class="wallet_operating">
            <div class="wallet_operating_item" @click="handleChoose('ETH')">
              <img src="@/assets/svg/user/icon_eth.svg" alt="" />
              <span>Ethereum [ETH]</span>
            </div>
            <div class="wallet_operating_item" @click="handleChoose('USDT')">
              <img src="@/assets/svg/user/icon_usdt.svg" alt="" />
              <span>Tether [USDT]</span>
            </div>
          </div>
        </div>
        <div class="recharge_panel" v-else>
          <div class="recharge_title">
            <el-icon class="icon_arrow" @click="operatingCoin = null">
              <ArrowLeftBold />
            </el-icon>
            <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_eth.svg" alt="" />
            <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="" />
            <div class="recharge_title_text">
              <span v-if="walletOperating == 1">{{
                `DEPOSIT ${operatingCoin}`
              }}</span>
              <span v-else>{{ `WITHDRAW ${operatingCoin}` }}</span>
            </div>
          </div>
          <div class="recharge_relevant" v-if="walletOperating == 1">
            <div class="qr_code_box">
              <div class="img_box" id="qrCodeDiv" ref="qrCodeDiv"></div>
              <div class="wallet_addr">
                <div class="tips_text">
                  Send the amount of Ethereum of your choice to the following
                  address to receive the equivalent in Coins.
                </div>
                <el-input class="wallet_addr_input" readonly="readonly" v-model="receiverAddr"
                  placeholder="Paste your ERC20 wallet address here">
                  <template #append>
                    <div class="copy_btn" @click="onCopy(receiverAddr)">
                      COPY
                    </div>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="recharge_hint_box">
              <div class="hint_item">
                <div class="hint_l">
                  <img src="@/assets/svg/user/icon_warning.svg" alt="" />
                </div>
                <div class="hint_r">
                  Only deposit over the Ethereum network. Do not use BNB or BSC
                  networks. Also do not use third-party smart contracts for
                  transfers.
                </div>
              </div>
              <div class="hint_item">
                <div class="hint_l">
                  <img style="visibility: hidden" src="@/assets/svg/user/icon_warning.svg" alt="" />
                </div>
                <div class="hint_r">
                  Do NOT send NFT's to this ETH deposit address. In order to
                  recover NFTs deposited to this address an administrative fee
                  will be charged.
                </div>
              </div>
            </div>
          </div>
          <div class="recharge_estimated_price" v-if="walletOperating == 1">
            <div class="price_convert">
              <el-input class="price_input" @focus="isConvert = true" v-model="walletAmount" type="number">
                <template #prefix>
                  <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
                  <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="" />
                </template>
              </el-input>
              <div class="convert_interval">~</div>
              <el-input class="price_input" @focus="isConvert = false" v-model="ethNum" type="number">
                <template #prefix>
                  <img src="@/assets/svg/user/icon_eth.svg" alt="" />
                </template>
              </el-input>
            </div>
            <div class="price_convert_text">
              The value of ETH may change between now and the time we receive
              your payment
            </div>
          </div>
          <div class="withdraw_relevant" v-else>
            <div class="withdraw_tips_text">
              Please enter the Ethereum wallet address you wish to receive the
              funds on. Once confirmed, the withdrawal is usually processed
              within a few minutes.
            </div>
            <div class="withdraw_item">
              <div class="withdraw_item_lable">
                <span>RECEIVING ETHEREUM ADDRESS</span>
                <span class="required">*</span>
              </div>
              <el-input class="withdraw_addr_input" v-model="walletAddr" @blur="onVerify('address')"
                placeholder="Paste your Ethereum wallet address here"></el-input>
              <div class="withdraw_item_error">
                {{ walletAddrTips }}
              </div>
            </div>
            <div class="withdraw_item">
              <div class="withdraw_item_lable">
                <span>WITHDRAWAL AMOUNT</span>
                <span class="required">*</span>
              </div>
              <div class="withdraw_convert">
                <div class="price_convert">
                  <el-input class="price_input" @focus="isConvert = true" @blur="onVerify('amount')"
                    v-model="walletAmount" type="number">
                    <template #prefix>
                      <img v-if="operatingCoin == 'ETH'" src="@/assets/svg/user/icon_ethereum.svg" alt="" />
                      <img v-else src="@/assets/svg/user/icon_usdt.svg" alt="" />
                    </template>
                  </el-input>
                  <div class="convert_interval">~</div>
                  <el-input class="price_input" @focus="isConvert = false" @blur="onVerify('amount')" v-model="ethNum"
                    type="number">
                    <template #prefix>
                      <img src="@/assets/svg/user/icon_eth.svg" alt="" />
                    </template>
                  </el-input>
                </div>
                <div class="withdraw_btn" @click="onWithdrawalBalance()">
                  REQUEST WITHDRAW
                </div>
              </div>
              <div class="withdraw_fee">
                {{
                  `Network fee: ${setting.withdrawalFees || 0} ${operatingCoin}`
                }}
              </div>
              <div class="withdraw_item_error">
                {{ tipsText }}
              </div>
            </div>
            <div class="withdraw_hint">
              <p>
                *You will receive the specified Ethereum amount to your
                withdrawal address
              </p>
              <p>
                *The value subtracted from your balance may vary between now and
                the time we process your withdrawal
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <Points v-if="showPoints" @closeDialogFun="showPoints = false"></Points>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import {
  getTheUserSPayoutAddress,
  getRechargeExchangeRate,
  getWithdrawalExchangeRate,
  withdrawalBalance,
  getWithdrawalHistory,
  rechargeByHash,
  getTheUserPoint
} from "@/services/api/user";

import QRCode from "qrcodejs2";
import bigNumber from "bignumber.js";
import { onCopy, accurateDecimal, timeFormat, openUrl, isValidEthAddress } from "@/utils";
import { getSetting } from "@/services/api/invite";
import Points from "./pointsDetails.vue";
export default {
  name: "myWallet",
  components: {
    Points
  },
  data() {
    return {
      coin: "ETH",
      coinList: ["ETH", "USDT", "BTC"],
      historyData: [],
      userPoints: null,

      showRecharge: false,
      walletOperating: 1, // 1 充币；2 提币；
      receiverAddr: null, // 收款地址
      walletAddr: null, // 钱包地址
      operatingCoin: null, // 操作币种
      exchangeRate: null, // 汇率
      walletAmount: null, // 充币数量
      ethNum: null, // 转化eth数量
      isConvert: true, // 转化类型
      ethFee: 0.03, //eth服务费
      usdtFee: 2.25, //usdt服务费
      verifys: false, //验证结果

      showReplenish: false, // 充值补充
      transactionId: null,
      timer: null,
      rateTimer: null,

      walletAddrTips: null,
      tipsText: null,

      page: 1,
      size: 5,
      count: 0,
      setting: {
        withdrawalFees: null
      },

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
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
  },
  watch: {
    walletAmount(newV) {
      if (!this.isConvert) return;
      const { operatingCoin, exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.ethNum = newV;
          return;
        }
        if (operatingCoin == "ETH") {
          this.ethNum = newV;
          return;
        }

        this.ethNum = accurateDecimal(
          new bigNumber(newV || 0).dividedBy(exchangeRate || 0),
          8
        );
      }, 300);
    },
    ethNum(newV) {
      if (this.isConvert) return;
      const { operatingCoin, exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.walletAmount = newV;
          return;
        }
        if (operatingCoin == "ETH") {
          this.walletAmount = newV;
          return;
        }

        this.walletAmount = accurateDecimal(
          new bigNumber(newV || 0).multipliedBy(exchangeRate || 0),
          8
        );
      }, 300);
    },
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    handleOperating(event) {
      this.walletOperating = event;
      if (this.walletOperating == 1 && this.operatingCoin != null) {
        this.fetchRechargeExchangeRate();

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.createQrcode();
        }, 10);
        this.walletAmount = 1;
      } else {
        this.fetchWithdrawalExchangeRate();
        this.walletAmount = 0;
      }

    },
    handleChoose(event) {
      this.operatingCoin = event;
      this.isConvert = true;
      this.walletAmount = null;
      this.fetchSetting();

      if (this.walletOperating == 1) {
        this.fetchRechargeExchangeRate();

        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.createQrcode();
        }, 10);
        this.walletAmount = 1;
      } else {

        this.walletAmount = 0;
        this.fetchWithdrawalExchangeRate();
      }


    },
    // 收款地址
    async fetchReceivingAddr() {
      const res = await getTheUserSPayoutAddress();
      if (res && res.code == 200) {
        this.receiverAddr = res.data;
        localStorage.setItem("receiver", res.data);
      }
    },
    // 积分余额
    async fetchTheUserPoint() {
      const res = await getTheUserPoint();
      if (res && res.code == 200) {
        this.userPoints = res.data.balance;
      }
    },
    // 充值汇率
    async fetchRechargeExchangeRate() {
      const res = await getRechargeExchangeRate({
        coinName: "ETH",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
    // 提款汇率
    async fetchWithdrawalExchangeRate() {
      const res = await getWithdrawalExchangeRate({
        coinName: "ETH",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
      }
    },
    // 验证
    onVerify(type) {
      const { setting, walletAmount, walletAddr } = this;
      const withdrawalFee = setting.withdrawalFees || 0;
      if (type == "submit" || type == "address") {
        if (!walletAddr) {
          this.walletAddrTips =
            "please enter your Ethereum wallet address here";
          this.verifys = false;
          return;
        }

        if (!isValidEthAddress(walletAddr)) {
          this.walletAddrTips =
            "The format of the entered Ethereum wallet address is incorrect";
          this.verifys = false;
          return;
        }
        this.walletAddrTips = "";
        this.verifys = true;
      }

      if (type == "submit" || type == "amount") {
        if (!walletAmount) {
          this.tipsText = "Please enter the withdrawal amount";
          this.verifys = false;
          return;
        } else if (Number(walletAmount) > Number(this.ethBalance)) {
          this.tipsText = "Insufficient balance";
          this.verifys = false;
          return;
        } else if (
          Number(this.walletAmount) + Number(withdrawalFee) >
          Number(this.ethBalance)
        ) {
          this.tipsText =
            "The amount is not enough to cover the withdrawal fee";
          this.verifys = false;
          return;
        }

        this.tipsText = "";
        this.verifys = true;
      }
    },
    // 提款余额
    async onWithdrawalBalance() {
      const { walletAmount, walletAddr, operatingCoin } = this;
      this.onVerify("submit");
      if (!this.verifys) return;

      const res = await withdrawalBalance({
        targetCoin: operatingCoin, //目标币种
        walletAddress: walletAddr, //钱包地址
        amount: walletAmount, //扣除的ETH金额
      });
      if (res && res.code == 200) {
        this.handleClose();
        this.renewBalance();
        this.$message.success(
          "The application is successful, please check the system transfer later"
        );
      }
    },
    // 更新当前余额
    async renewBalance() {
      const headerStore = useHeaderStore();
      await headerStore.getTheUserBalanceApi();
    },
    async onRechargeByHash() {
      const { transactionId } = this;
      if (!transactionId) {
        this.$message.error("Please enter the on-chain transaction ID");
        return;
      }

      if (!isValidEthAddress(transactionId)) {
        this.$message.error("The format of the entered Ethereum wallet address is incorrect");
        return
      }

      const res = await rechargeByHash({
        hash: transactionId,
      });

      if (res && res.code == 200) {
        this.$message.success(
          "The application is successful, please check whether the assets arrive later"
        );
        this.handleClose();
      }
    },
    // 关闭创建弹窗
    handleClose(done) {
      this.walletOperating = 1; // 1 充币；2 提币；
      this.operatingCoin = null; // 操作币种
      this.walletAddr = null;
      this.exchangeRate = null; // 汇率
      this.walletAmount = null; // 充币数量
      this.ethNum = null; // 转化eth数量
      this.isConvert = true; // 转化类型
      this.walletAddrTips = null;
      this.tipsText = null;

      this.transactionId = null;

      if (done) {
        done();
        return;
      }

      this.showReplenish = false;
      this.showRecharge = false;
    },
    createQrcode() {
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.receiverAddr,
        width: 142,
        height: 142,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    // 检索历史
    searchHistory(event) {
      this.coin = event;
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
        coin: this.coin,
        page: _page,
        size: size
      });

      if (res && res.code == 200) {
        this.historyData = res.data.records;
        this.count = res.data.total;
      }
    },
    viewTxid(event) {
      const transactionUrl = process.env.VUE_APP_TRANSACTION_ADDR;
      openUrl(transactionUrl + event);
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: this.operatingCoin || "ETH"
      });

      if (res && res.code == 200) {
        this.setting = res.data;
        this.$forceUpdate();
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.fetchHistory(false);
    }
  },
  created() {
    this.renewBalance();
    this.fetchHistory();
    this.fetchReceivingAddr();
    this.fetchSetting();
    this.fetchTheUserPoint()
  },
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>
