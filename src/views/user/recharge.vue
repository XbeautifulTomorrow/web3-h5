<template>
  <el-dialog class="dialog_box" v-model="showRecharge" width="50rem" lock-scroll :close-on-click-modal="false"
    :before-close="handleClose">
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
                <el-input class="price_input" @focus="isConvert = true" @blur="onVerify('amount')" v-model="walletAmount"
                  type="number">
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
            <div class="withdraw_fee" v-if="operatingCoin == 'ETH'">
              {{
                `Network fee: ${setting.withdrawalFees || 0} ${operatingCoin}`
              }}
            </div>
            <div class="withdraw_fee" v-else>
              {{
                `Network fee: ${accurateDecimal(new bigNumber(setting.withdrawalFees || 0).multipliedBy(exchangeRate), 4)
                || 0} ${operatingCoin}`
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
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";

import {
  getTheUserSPayoutAddress,
  getRechargeExchangeRate,
  getWithdrawalExchangeRate,
  withdrawalBalance
} from "@/services/api/user";

import QRCode from "qrcodejs2";
import bigNumber from "bignumber.js";
import { onCopy, accurateDecimal, timeFormat } from "@/utils";
import { getSetting } from "@/services/api/invite";
export default {
  name: "myWallet",
  data() {
    return {
      showRecharge: true,
      walletOperating: 1, // 1 充币；2 提币；
      receiverAddr: null, // 收款地址
      walletAddr: null, // 钱包地址
      operatingCoin: null, // 操作币种
      exchangeRate: null, // 汇率
      walletAmount: null, // 充币数量
      ethNum: null, // 转化eth数量
      isConvert: true, // 转化类型
      verifys: false, //验证结果

      timer: null,
      rateTimer: null,

      walletAddrTips: null,
      tipsText: null,

      setting: {
        withdrawalFees: null
      }
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
    accurateDecimal: accurateDecimal,
    timeFormat: timeFormat,
    handleOperating(event) {
      this.walletOperating = event;
      if (this.walletOperating == 1 && this.operatingCoin != null) {

        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.createQrcode();
        }, 10);
        this.walletAmount = 1;
      } else {
        this.walletAmount = 0;
      }

      this.fetchWithdrawalExchangeRate();
    },
    handleChoose(event) {
      this.operatingCoin = event;
      this.isConvert = true;
      this.walletAmount = null;
      this.fetchSetting();

      if (this.walletOperating == 1) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.createQrcode();
        }, 10);
        this.walletAmount = 1;
      } else {

        this.walletAmount = 0;
      }

      this.fetchWithdrawalExchangeRate();
    },
    // 收款地址
    async fetchReceivingAddr() {
      const res = await getTheUserSPayoutAddress();
      if (res && res.code == 200) {
        this.receiverAddr = res.data;
        localStorage.setItem("receiver", res.data);
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
        this.renewBalance();
        this.$message.success(
          "The application is successful, please check the system transfer later"
        );
        this.handleClose();
      }
    },
    // 更新当前余额
    async renewBalance() {
      const headerStore = useHeaderStore();
      await headerStore.getTheUserBalanceApi();
    },
    // 关闭创建弹窗
    handleClose() {
      this.walletOperating = 1; // 1 充币；2 提币；
      this.operatingCoin = null; // 操作币种
      this.walletAddr = null;
      this.exchangeRate = null; // 汇率
      this.walletAmount = null; // 充币数量
      this.ethNum = null; // 转化eth数量
      this.isConvert = true; // 转化类型
      this.walletAddrTips = null;
      this.tipsText = null;

      this.$emit("closeDialogFun");
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
    this.renewBalance();
    this.fetchReceivingAddr();
    this.fetchSetting();
  },
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>
  