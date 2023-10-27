<template>
  <div>
    <el-dialog
      class="dialog_box"
      v-model="showRecharge"
      width="50rem"
      lock-scroll
      :close-on-click-modal="false"
      :align-center="true"
      :before-close="handleClose"
    >
      <div class="close_btn" @click="handleClose()">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="recharge_box">
        <div class="operating_box">
          <div class="operating_btn" :class="[walletOperating == 1 && 'active']" @click="handleOperating(1)">
            {{ t("user.deposit") }}
          </div>
          <div class="operating_btn" :class="[walletOperating == 2 && 'active']" @click="handleOperating(2)">
            {{ t("user.withdraw") }}
          </div>
          <div class="operating_btn" :class="[walletOperating == 3 && 'active']" @click="handleOperating(3)">
            {{ $t("user.exchange") }}
          </div>
        </div>
        <div class="choose_operating" v-if="walletOperating != 3">
          <div class="withdraw_item">
            <div class="withdraw_item_lable">
              <span>
                {{
                  t("user.currency", {
                    operating: `${walletOperating == 1 ? "DEPOSIT" : "WITHDRAW"}`,
                  })
                }}
              </span>
            </div>
            <el-select
              v-model="operatingCoin"
              @blur="onVerify('coin')"
              @change="handleChoose"
              class="nft_type wallet_network"
              placeholder="Select network"
              :popper-append-to-body="false"
            >
              <template #prefix>
                <img :src="getCion(operatingCoin)" alt="" />
              </template>
              <el-option v-for="(item, index) in networkList" :key="index" :label="item.coinName" :value="item.coinName">
                <div class="icon_label">
                  <img :src="getCion(item.coinName)" alt="" />
                  <span>{{ item.coinName }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="withdraw_item_error">
              {{ coinTips }}
            </div>
          </div>
          <div class="withdraw_item">
            <div class="withdraw_item_lable">
              <span>
                {{
                  t("user.network", {
                    operating: `${walletOperating == 1 ? "DEPOSIT" : "WITHDRAW"}`,
                  })
                }}
              </span>
            </div>
            <el-select
              v-model="walletNetwork"
              @blur="onVerify('network')"
              class="nft_type wallet_network"
              placeholder="Select network"
              :popper-append-to-body="false"
            >
              <el-option v-for="(item, index) in networkDrop" :key="index" :label="item.chain" :value="item.chain" />
            </el-select>
            <div class="withdraw_item_error">
              {{ networkTips }}
            </div>
          </div>
        </div>
        <div class="recharge_panel">
          <div class="recharge_relevant" v-if="walletOperating == 1">
            <div class="qr_code_box">
              <div class="wallet_addr">
                <div class="tips_text">
                  {{ t("user.sendHint", { coin: operatingCoin }) }}
                </div>
                <div class="img_box" v-if="screenWidth < 950" id="qrCodeDiv" ref="qrCodeDiv"></div>
                <el-input class="wallet_addr_input" readonly="readonly" v-model="receiverAddr" :placeholder="t('user.enterAddrHint')">
                  <template #append>
                    <div class="copy_btn" @click="onCopy(receiverAddr)">
                      <img class="not-select" src="@/assets/svg/user/icon_copy.svg" alt="" />
                    </div>
                  </template>
                </el-input>
                <div class="recharge_hint">
                  <span>{{
                    t("user.hintText1", {
                      coin: operatingCoin,
                      num: confirmNum(),
                    })
                  }}</span>
                </div>
              </div>
              <div class="img_box" v-if="screenWidth > 950" id="qrCodeDiv" ref="qrCodeDiv"></div>
            </div>
          </div>
          <div class="recharge_estimated_price" v-if="walletOperating == 1">
            <div class="price_convert">
              <el-input class="price_input" @focus="isConvert = true" v-model="walletAmount" type="number">
                <template #prefix>
                  <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
                </template>
              </el-input>
              <div class="convert_interval">~</div>
              <el-input class="price_input" @focus="isConvert = false" v-model="ethNum" type="number">
                <template #prefix>
                  <img :src="getCion(operatingCoin)" alt="" />
                </template>
              </el-input>
            </div>
            <div class="price_convert_text">
              {{ t("user.hintText3", { coin: `${operatingCoin}` }) }}
            </div>
          </div>
          <div class="withdraw_relevant" v-else-if="walletOperating == 2">
            <div class="withdraw_item">
              <div class="withdraw_item_lable">
                <img :src="getCion(operatingCoin)" alt="" />
                <span>
                  {{ t("user.receivingAddr", { coin: operatingCoin }) }}
                </span>
                <span class="required">*</span>
              </div>
              <el-input
                class="withdraw_addr_input"
                v-model="walletAddr"
                @blur="onVerify('address')"
                :placeholder="
                  t('user.receivingAddrHint', {
                    coin: `${operatingCoin != 'USDT' ? 'Ethereum' : 'Tether'}`,
                  })
                "
              ></el-input>
              <div class="withdraw_item_error">
                {{ walletAddrTips }}
              </div>
            </div>
            <div class="withdraw_item">
              <div class="withdraw_item_lable exchange_item_lable">
                <p>
                  <span>{{ t("user.withdrawalAmount") }}</span>
                  <span class="required">*</span>
                </p>
                <p>可用 {{ getCoinBalance(operatingCoin).toFixed(4) + " " + operatingCoin }}</p>
              </div>
              <div class="withdraw_convert">
                <div class="price_convert">
                  <el-input class="price_input" @blur="onVerify('amount')" v-model="walletAmount" type="number">
                    <template #prefix>
                      <img :src="getCion(operatingCoin)" alt="" />
                    </template>
                  </el-input>
                  <!-- <el-input class="price_input" @focus="isConvert = true" @blur="onVerify('amount')" v-model="walletAmount" type="number">
                    <template #prefix>
                      <img src="@/assets/svg/user/icon_ethereum.svg" alt="" />
                    </template>
                  </el-input>
                  <div class="convert_interval">~</div>
                  <el-input class="price_input" @focus="isConvert = false" @blur="onVerify('amount')" v-model="ethNum" type="number">
                    <template #prefix>
                      <img :src="getCion(operatingCoin)" alt="" />
                    </template>
                  </el-input> -->
                </div>
              </div>
              <div :class="['withdraw_fee', setting.freeFeeStatus && 'free']">
                <span class="fee_title">
                  {{ t("user.fee") }}
                </span>
                <span class="fee_val">
                  {{ `${network?.newGas || network?.gas} ${operatingCoin || "--"}` }}
                </span>
                <span class="free_text" v-if="setting.freeFeeStatus">{{ t("recharge.free") }}</span>
              </div>
              <div class="withdraw_item_error">
                {{ tipsText }}
              </div>
            </div>
            <div :class="['withdraw_btn', loading && 'loading']" @click="onWithdrawalBalance()">
              <img v-if="loading" src="@/assets/img/user/loading.png" alt="" />
              <span>{{ t("user.requestBtn") }}</span>
            </div>
            <div class="withdraw_hint">
              <p>
                {{ t("user.addrTips2") }}
              </p>
            </div>
          </div>
          <div class="exchange_box" v-else-if="walletOperating == 3">
            <div class="withdraw_relevant exchange_relevant">
              <div class="withdraw_item">
                <div class="withdraw_item_lable exchange_item_lable">
                  <p>
                    <span> {{ t("user.from") }} </span> <span class="required">*</span>
                  </p>
                  <p>
                    {{ t("user.available") }}
                    {{ getCoinBalance(exchangeInfo.exchangeFromCoin).toFixed(4) + " " + exchangeInfo.exchangeFromCoin }}
                  </p>
                </div>
                <div class="withdraw_addr_input exchange_addr_input">
                  <div class="exhange_icon" v-if="exchangeOperating == 1">
                    <img :src="getCion('USDT')" alt="" />
                    <span>USDT</span>
                  </div>
                  <div class="exhange_icon" v-else>
                    <el-select v-model="exchangeInfo.exchangeFromCoin" @change="fetchExchangeRate" :popper-append-to-body="false">
                      <template #prefix>
                        <img :src="getCion(exchangeInfo.exchangeFromCoin)" alt="" />
                      </template>
                      <template v-for="(item, index) in networkList">
                        <el-option
                          :key="index"
                          :label="item.coinName"
                          :value="item.coinName"
                          v-if="item.coinName != 'USDT' && item.isExchange"
                        >
                          <div class="icon_label">
                            <img :src="getCion(item.coinName)" alt="" />
                            <span>{{ item.coinName }}</span>
                          </div>
                        </el-option>
                      </template>
                    </el-select>
                  </div>
                  <el-input
                    type="number"
                    v-model="exchangeInfo.exchangeFromAmount"
                    placeholder="0.0000"
                    @input="onVerifyExchange('amount')"
                  ></el-input>
                </div>
                <div class="withdraw_item_error">
                  <p>{{ exchangeAmountTips }}</p>
                  <p class="max" @click="maxFunc">MAX</p>
                </div>
              </div>
            </div>
            <div class="swap_box" @click="exchangeOperatingFunc"><img src="@/assets/svg/user/icon_swap.svg" /></div>
            <div class="withdraw_relevant exchange_relevant">
              <div class="withdraw_item">
                <div class="withdraw_item_lable exchange_item_lable">
                  <p>
                    <span> {{ t("user.to") }} </span> <span class="required">*</span>
                  </p>
                </div>
                <div class="withdraw_addr_input exchange_addr_input">
                  <div class="exhange_icon" v-if="exchangeOperating == 1">
                    <el-select v-model="exchangeInfo.exchangeToCoin" @change="fetchExchangeRate" :popper-append-to-body="false">
                      <template #prefix>
                        <img :src="getCion(exchangeInfo.exchangeToCoin)" alt="" />
                      </template>
                      <template v-for="(item, index) in networkList">
                        <el-option
                          :key="index"
                          :label="item.coinName"
                          :value="item.coinName"
                          v-if="item.coinName != 'USDT' && item.isExchange"
                        >
                          <div class="icon_label">
                            <img :src="getCion(item.coinName)" alt="" />
                            <span>{{ item.coinName }}</span>
                          </div>
                        </el-option>
                      </template>
                    </el-select>
                  </div>
                  <div class="exhange_icon" v-else>
                    <img :src="getCion('USDT')" alt="" />
                    <span>USDT</span>
                  </div>
                  <el-input
                    type="number"
                    v-model="exchangeInfo.exchangeToAmount"
                    @input="exchangeToAmountFunc"
                    placeholder="0.0000"
                  ></el-input>
                </div>
              </div>
            </div>
            <div class="conversion_box">
              <span>{{
                `1 ${exchangeInfo.exchangeToCoin} ≈ ${exchangeInfo?.exchangeRate.toFixed(4)} ${exchangeInfo.exchangeFromCoin}`
              }}</span>
              <img src="@/assets/svg/user/restart.svg" @click="fetchExchangeRate(1)" />
            </div>
            <!-- <div class="factor_box exchange_relevant">
              <div class="withdraw_item">
                <div class="withdraw_item_lable"><span> two factor </span> <span class="required">*</span></div>
                <el-input
                  class="withdraw_addr_input"
                  v-model="walletAddr"
                  @blur="onVerify('address')"
                  :placeholder="$t('user.receivingAddrHint', { coin: `${operatingCoin != 'USDT' ? 'Ethereum' : 'Tether'}` })"
                ></el-input>
                <div class="withdraw_item_error">
                  {{ walletAddrTips }}
                </div>
              </div>
            </div> -->

            <div :class="['withdraw_btn exchange_btn', loading && 'loading']" @click="exchangeFunc">
              <span>{{ $t("EXCHANGE") }}</span>
            </div>
          </div>
        </div>
        <div class="verify_box">
          <div class="verify_title">
            <span>{{}}</span>
          </div>
          <div class="verify_btn"></div>
        </div>
      </div>
    </el-dialog>
    <rechargeExchangeResult
      :exchangeInfo="exchangeInfo"
      v-if="pageType == 'exchangeResult'"
      @closeDialogFun="closeExchangeDialogFun"
    ></rechargeExchangeResult>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import { i18n } from "@/locales";
const { t } = i18n.global;

import {
  getTheUserSPayoutAddress,
  getRechargeExchangeRate,
  getWithdrawalExchangeRate,
  withdrawalBalance,
  getWithdrawalChain,
} from "@/services/api/user";

import QRCode from "qrcodejs2";
import bigNumber from "bignumber.js";
import { onCopy, accurateDecimal, timeFormat, isValidEthAddress, handleWindowResize } from "@/utils";
import { getSetting } from "@/services/api/invite";
import rechargeExchangeResult from "./rechargeExchangeResult.vue";
export default {
  name: "myWallet",
  components: {
    rechargeExchangeResult,
  },
  props: {
    type: {
      type: Number,
      default: 1,
      required: false,
    },
  },
  data() {
    return {
      showRecharge: true,
      walletOperating: 1, // 1 充币；2 提币；3.闪兑；
      walletNetwork: null, // 网络
      networkList: [],
      receiverAddr: null, // 收款地址
      walletAddr: null, // 钱包地址
      operatingCoin: null, // 操作币种
      exchangeRate: null, // 汇率
      walletAmount: null, // 充币数量
      ethNum: null, // 转化eth数量
      isConvert: true, // 转化类型
      verifys: false, //验证结果
      loading: false, // 等待结果

      timer: null,
      rateTimer: null,

      coinTips: null,
      networkTips: null,
      walletAddrTips: null,
      tipsText: null,

      screenWidth: null,

      setting: {
        withdrawalFees: null,
      },
      exchangeOperating: 1, //1 正向；2反向

      pageType: "",
      exchangeInfo: {
        exchangeFromAmount: null,
        exchangeToAmount: null,
        exchangeFromCoin: "USDT",
        exchangeToCoin: "ETH",
        exchangeRate: 0,
      },
      exchangeAmountTips: null,
      exchangeRateTimer: null,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
    assetLists() {
      const headerStore = useHeaderStore();
      return headerStore.assetLists;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    regInfo() {
      const { regInfo } = this.userStore;
      return regInfo;
    },
    loadLog() {
      const { loadLog } = this.userStore;
      return loadLog;
    },
    currencyData() {
      const { currencyData } = this.userStore;
      return currencyData;
    },
    networkDrop() {
      const { networkList, operatingCoin } = this;
      if (!operatingCoin || !networkList.length > 0) {
        return [];
      }

      const network = networkList.find((e) => e.coinName == operatingCoin);

      return network?.chainList;
    },
    network() {
      const { networkDrop, walletNetwork } = this;
      const network = networkDrop.find((e) => e.chain == walletNetwork);
      return network;
    },
  },
  watch: {
    walletAmount(newV) {
      if (!this.isConvert) return;

      const { operatingCoin, exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.ethNum = newV || 0;
          return;
        }

        if (operatingCoin == "ETH") {
          this.ethNum = newV || 0;
          return;
        }

        this.ethNum = accurateDecimal(new bigNumber(newV || 0).multipliedBy(exchangeRate || 0), 8) || 0;
      }, 300);
    },
    ethNum(newV) {
      if (this.isConvert) return;

      const { operatingCoin, exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.walletAmount = newV || 0;
          return;
        }

        if (operatingCoin == "ETH") {
          this.walletAmount = newV || 0;
          return;
        }

        this.walletAmount = accurateDecimal(new bigNumber(newV || 0).dividedBy(exchangeRate || 0), 8) || 0;
      }, 300);
    },
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    accurateDecimal: accurateDecimal,
    timeFormat: timeFormat,
    t: t,

    getCoinBalance(coin) {
      coin = coin === "WETH" ? "ETH" : coin;
      const res = this.assetLists.filter((x) => x.coinName === coin);
      if (res?.length > 0) {
        return res[0]?.balance;
      } else {
        return 0;
      }
    },
    maxFunc() {
      this.exchangeInfo.exchangeFromAmount = Math.floor(this.getCoinBalance(this.exchangeInfo.exchangeFromCoin) * 10000) / 10000;
      this.exchangeFromAmountFunc();
    },
    // 获取下浮比率
    getExchangeDown(coin) {
      const { networkList } = this;
      const network = networkList.find((e) => e.coinName == coin);
      return network?.down || 0;
    },
    exchangeFromAmountFunc() {
      let exchangeToAmount = null;
      if (this.exchangeInfo.exchangeFromAmount) {
        exchangeToAmount = Math.floor((this.exchangeInfo.exchangeFromAmount / this.exchangeInfo.exchangeRate) * 10000) / 10000;
      }
      this.exchangeInfo.exchangeToAmount = exchangeToAmount;
    },
    exchangeToAmountFunc() {
      let exchangeFromAmount = null;
      if (this.exchangeInfo.exchangeToAmount) {
        exchangeFromAmount = Math.floor(this.exchangeInfo.exchangeToAmount * this.exchangeInfo.exchangeRate * 10000) / 10000;
      }
      this.exchangeInfo.exchangeFromAmount = exchangeFromAmount;
    },
    onVerifyExchange(type) {
      if (!this.exchangeInfo.exchangeFromAmount || this.exchangeInfo.exchangeFromAmount == 0) {
        this.exchangeAmountTips = t("user.enterError6");
      } else if (this.exchangeInfo.exchangeFromAmount > this.getCoinBalance(this.exchangeInfo.exchangeFromCoin)) {
        this.exchangeAmountTips = t("user.enterError4");
      } else if (
        (this.exchangeInfo.exchangeFromCoin == "USDT" && this.exchangeInfo.exchangeFromAmount < 1) ||
        (this.exchangeInfo.exchangeToCoin == "USDT" && this.exchangeInfo.exchangeToAmount < 1)
      ) {
        this.exchangeAmountTips = t("user.enterError7", { data: "1 USDT" });
      } else {
        this.exchangeAmountTips = null;
      }
      if (type) {
        this.exchangeFromAmountFunc();
      }
    },

    // exchange汇率
    async fetchExchangeRate(type) {
      const coin = this.exchangeInfo.exchangeToCoin == "USDT" ? this.exchangeInfo.exchangeFromCoin : this.exchangeInfo.exchangeToCoin;
      const res = await getWithdrawalExchangeRate({
        coinName: coin,
      });
      if (res && res.code == 200) {
        const down = this.getExchangeDown(this.exchangeInfo.exchangeToCoin);
        if (this.exchangeInfo.exchangeFromCoin == "USDT") {
          this.exchangeInfo.exchangeRate = res.data * (1 + down);
        } else {
          this.exchangeInfo.exchangeRate = 1 / (res.data * (1 - down));
        }
        console.log(this.exchangeInfo.exchangeRate, "------this.exchangeInfo.exchangeRate");
        if (type != 1) {
          this.exchangeFromAmountFunc();
        }
      }
    },

    async exchangeOperatingFunc() {
      this.exchangeOperating == 1 ? (this.exchangeOperating = 2) : (this.exchangeOperating = 1);
      [this.exchangeInfo.exchangeFromCoin, this.exchangeInfo.exchangeToCoin] = [
        this.exchangeInfo.exchangeToCoin,
        this.exchangeInfo.exchangeFromCoin,
      ];
      this.exchangeInfo.exchangeFromAmount = this.exchangeInfo.exchangeToAmount;
      this.fetchExchangeRate();
      setTimeout(() => {
        this.onVerifyExchange();
      }, 500);
    },

    closeExchangeDialogFun(data) {
      this.pageType = "";
      if (data) {
        this.exchangeInfo.exchangeFromAmount = null;
        this.exchangeInfo.exchangeToAmount = null;
      }
    },

    exchangeFunc() {
      this.onVerifyExchange();
      if (!this.exchangeAmountTips && this.exchangeInfo.exchangeRate > 0) {
        this.pageType = "exchangeResult";
      }
    },

    handleOperating(event) {
      this.walletOperating = event;
      this.walletAmount = null;
      if (this.walletOperating == 1 && this.operatingCoin != null) {
        this.$nextTick(() => {
          this.createQrcode();
        });

        this.fetchRechargeExchangeRate();
      } else {
        this.fetchWithdrawalExchangeRate();
      }
      if (this.walletOperating == 3) {
        this.fetchExchangeRate();
        this.exchangeRateTimer = setInterval(() => {
          this.fetchExchangeRate(1);
        }, 10000);
      }
    },
    handleChoose(event) {
      this.operatingCoin = event;
      this.isConvert = true;
      this.walletAmount = null;
      this.walletNetwork = null;
      this.fetchSetting();

      if (this.networkDrop.length > 0) {
        this.walletNetwork = this.networkDrop[0].chain;
      }

      if (this.walletOperating == 1) {
        this.$nextTick(() => {
          this.createQrcode();
        });

        this.fetchRechargeExchangeRate();
      } else {
        this.fetchWithdrawalExchangeRate();
      }

      this.$forceUpdate();
    },
    // 支持的网络
    async fetchWithdrawalChain() {
      const res = await getWithdrawalChain();
      if (res && res.code == 200) {
        this.networkList = res.data;

        const coin = this.networkList.find((e) => e.coinName == "ETH");

        if (coin == -1) {
          this.operatingCoin = this.networkList[0].coinName;
        } else {
          this.operatingCoin = coin.coinName;
        }

        if (this.networkDrop.length > 0) {
          this.walletNetwork = this.networkDrop[0].chain;
        }
      }
    },
    // 收款地址
    async fetchReceivingAddr() {
      const res = await getTheUserSPayoutAddress();
      if (res && res.code == 200) {
        this.receiverAddr = res.data;
        localStorage.setItem("receiver", res.data);
        this.$nextTick(() => {
          this.createQrcode();
        });
      }
    },

    // 充值汇率
    async fetchRechargeExchangeRate() {
      const res = await getRechargeExchangeRate({
        coinName: "ETH",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
        this.walletAmount = 1;
      }
    },
    // 提款汇率
    async fetchWithdrawalExchangeRate() {
      const res = await getWithdrawalExchangeRate({
        coinName: "ETH",
      });
      if (res && res.code == 200) {
        this.exchangeRate = res.data;
        this.walletAmount = 0;
      }
    },
    // 验证
    onVerify(type) {
      const { operatingCoin, walletNetwork, setting, walletAmount, walletAddr, network } = this;

      if (type == "submit" || type == "coin") {
        if (!operatingCoin) {
          this.coinTips = t("user.currencyError");
          this.verifys = false;
          return;
        }

        this.coinTips = "";
        this.verifys = true;
      }

      if (type == "submit" || type == "network") {
        if (!walletNetwork) {
          this.networkTips = t("user.networkError");
          this.verifys = false;
          return;
        }

        this.networkTips = "";
        this.verifys = true;
      }

      if (type == "submit" || type == "address") {
        if (!walletAddr) {
          this.walletAddrTips = t("user.enterError1", {
            coin: `${operatingCoin != "USDT" ? "Ethereum" : "Tether"}`,
          });
          this.verifys = false;
          return;
        }

        if (!isValidEthAddress(walletAddr)) {
          this.walletAddrTips = t("user.enterError2", {
            coin: `${operatingCoin != "USDT" ? "Ethereum" : "Tether"}`,
          });
          this.verifys = false;
          return;
        }

        this.walletAddrTips = "";
        this.verifys = true;
      }

      if (type == "submit" || type == "amount") {
        if (!walletAmount) {
          this.tipsText = t("user.enterError3");
          this.verifys = false;
          return;
        } else if (Number(walletAmount) > Number(this.ethBalance)) {
          this.tipsText = t("user.enterError4");
          this.verifys = false;
          return;
        } else if (!setting.freeFeeStatus && Number(network?.gas) > Number(this.walletAmount)) {
          this.tipsText = t("user.enterError5");
          this.verifys = false;
          return;
        }

        this.tipsText = "";
        this.verifys = true;
      }
    },
    // 提款余额freeFeeStatus
    async onWithdrawalBalance() {
      const { walletAmount, walletAddr, operatingCoin, walletNetwork, loading } = this;
      if (loading) return;

      this.onVerify("submit");
      if (!this.verifys) return;

      this.loading = true;
      const res = await withdrawalBalance({
        targetCoin: operatingCoin, // 目标币种
        walletAddress: walletAddr, // 钱包地址
        amount: walletAmount, // 扣除的ETH金额
        targetChain: walletNetwork, // 网络
      });

      this.loading = false;

      if (res && res.code == 200) {
        this.renewBalance();

        this.userStore.setLoad(!this.loadLog);

        if (this.userInfo.userType == "NORMAL") {
          this.$message.success(t("user.submitTestHint"));
        } else {
          this.$message.success(t("user.submitHint"));
        }
        this.handleClose();
      }
    },
    // 更新当前余额
    async renewBalance() {
      const headerStore = useHeaderStore();
      await headerStore.getTheUserBalanceApi();
    },
    // 确认次数
    confirmNum() {
      const { walletNetwork, networkDrop } = this;
      const network = networkDrop.find((e) => e.chain == walletNetwork);
      return network?.height || 1;
    },
    // 关闭创建弹窗
    handleClose() {
      this.$emit("closeDialogFun");
    },
    createQrcode() {
      if (document.getElementById("qrCodeDiv")) {
        //清除
        document.getElementById("qrCodeDiv").innerHTML = "";
        if (this.screenWidth > 950) {
          new QRCode(this.$refs.qrCodeDiv, {
            text: this.receiverAddr,
            width: 126,
            height: 126,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
        } else {
          new QRCode(this.$refs.qrCodeDiv, {
            text: this.receiverAddr,
            width: 72,
            height: 72,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
        }
      }
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
    getCion(event) {
      const { currencyData } = this;
      const coin = currencyData.find((e) => e.name == event);
      return coin?.img || event;
    },
  },
  mounted() {
    this.fetchReceivingAddr();
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
    if (typeof this.type === "number") {
      this.handleOperating(this.type);
    }
  },
  created() {
    this.renewBalance();
    this.fetchSetting();
    this.fetchWithdrawalChain();
  },
  unmounted() {
    if (this.exchangeRateTimer) {
      clearInterval(this.exchangeRateTimer);
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/wallet.scss";
</style>
<style lang="scss">
.qr_code_box > .img_box > img {
  width: 100% !important;
  height: auto !important;
}
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 0.625rem !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.6;
    padding: 0 0.825rem;
    height: auto;

    &.selected {
      color: #fad54d;
    }

    &:hover,
    &.hover {
      border-radius: 0.5rem;
      background-color: #13151f;
    }
  }

  .el-popper__arrow {
    display: none;
  }

  .el-select-dropdown__empty {
    font-size: 1rem;
    color: #a9a4b4;
  }
}

@media screen and (max-width: 950px) {
  .el-select__popper {
    .el-select-dropdown__item {
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.75rem;
      padding: 0 0.25rem;
    }

    .el-select-dropdown__empty {
      font-size: 0.75rem;
    }
  }
}
</style>
