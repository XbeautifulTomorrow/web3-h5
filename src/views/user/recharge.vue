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
          <div
            class="operating_btn"
            :class="[walletOperating == 1 && 'active']"
            @click="handleOperating(1)"
          >
            {{ t("user.deposit") }}
          </div>
          <div
            class="operating_btn"
            :class="[walletOperating == 2 && 'active']"
            @click="handleOperating(2)"
          >
            {{ t("user.withdraw") }}
          </div>
          <div
            class="operating_btn"
            :class="[walletOperating == 3 && 'active']"
            @click="handleOperating(3)"
          >
            {{ t("user.exchange") }}
          </div>
          <div
            class="operating_btn buy_crypTo"
            :class="[walletOperating == 4 && 'active']"
            @click="handleOperating(4)"
            v-if="legalPlatform?.length > 0"
          >
            {{ t("user.buyCrypto") }}
          </div>
          <div
            class="operating_btn"
            :class="[walletOperating == 5 && 'active']"
            @click="handleOperating(5)"
          >
            {{ t("user.coupons") }}
          </div>
        </div>
        <div
          class="banner_promotion_box"
          v-if="walletOperating == 1 || walletOperating == 4"
        >
          <img
            v-if="screenWidth > 950"
            src="@/assets/img/user/recharge_banner.webp"
            alt=""
          />
          <img
            v-else
            src="@/assets/img/user/recharge_banner_mobile.webp"
            alt=""
          />
          <div class="promotion_text">
            <div>
              <span>{{ $t("user.depositTo") }}</span>
              <span class="bonus">{{ $t("user.getBonus") }}</span>
            </div>
            <div>
              <span>{{ $t("user.upTo") }}</span>
              <span class="bonus">$ 1,000,000</span>
            </div>
          </div>
        </div>
        <div
          class="choose_operating"
          v-if="walletOperating == 1 || walletOperating == 2"
        >
          <div class="withdraw_item">
            <div class="withdraw_item_lable">
              <span>
                {{
                  t("user.currency", {
                    operating: `${
                      walletOperating == 1 ? "DEPOSIT" : "WITHDRAW"
                    }`,
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
              <el-option
                v-for="(item, index) in networkList"
                :key="index"
                :label="item.coinName"
                :value="item.coinName"
              >
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
                    operating: `${
                      walletOperating == 1 ? "DEPOSIT" : "WITHDRAW"
                    }`,
                  })
                }}
              </span>
            </div>
            <el-select
              v-model="walletNetwork"
              @change="walletNetworkChange"
              @blur="onVerify('network')"
              class="nft_type wallet_network"
              placeholder="Select network"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="(item, index) in networkDrop"
                :key="index"
                :label="item.chain"
                :value="item.chain"
              />
            </el-select>
            <div class="withdraw_item_error">
              {{ networkTips }}
            </div>
          </div>
        </div>
        <div class="recharge_panel">
          <template v-if="walletOperating == 1">
            <div class="recharge_relevant">
              <div class="qr_code_box">
                <div class="wallet_addr">
                  <div class="tips_text">
                    {{ t("user.sendHint", { coin: operatingCoin }) }}
                  </div>
                  <div
                    class="img_box"
                    v-if="screenWidth < 950"
                    id="qrCodeDiv"
                    ref="qrCodeDiv"
                  ></div>
                  <el-input
                    class="wallet_addr_input"
                    readonly="readonly"
                    v-model="receiverAddr"
                    :placeholder="t('user.enterAddrHint')"
                  >
                    <template #append>
                      <div class="copy_btn" @click="onCopy(receiverAddr)">
                        <img
                          class="not-select"
                          src="@/assets/svg/user/icon_copy.svg"
                          alt=""
                        />
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
                <div
                  class="img_box"
                  v-if="screenWidth > 950"
                  id="qrCodeDiv"
                  ref="qrCodeDiv"
                ></div>
              </div>
            </div>
            <div class="recharge_estimated_price">
              <div class="price_convert">
                <el-input
                  class="price_input"
                  @focus="isConvert = true"
                  v-model="walletAmount"
                  type="number"
                >
                  <template #prefix>
                    <img
                      v-if="operatingCoin == 'ETH'"
                      :src="getCion(operatingCoin)"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/svg/user/icon_usdt_gold.svg"
                      alt=""
                    />
                  </template>
                </el-input>
                <div class="convert_interval">~</div>
                <el-input
                  class="price_input"
                  @focus="isConvert = false"
                  v-model="ethNum"
                  type="number"
                >
                  <template #prefix>
                    <img
                      v-if="operatingCoin == 'ETH'"
                      src="@/assets/svg/user/icon_usdt_gold.svg"
                      alt=""
                    />
                    <img v-else :src="getCion(operatingCoin)" alt="" />
                  </template>
                </el-input>
              </div>
              <div class="price_convert_text">
                {{ t("user.hintText3", { coin: `${operatingCoin}` }) }}
              </div>
            </div>
          </template>
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
                <p v-if="operatingCoin == 'USDC'">
                  {{ $t("user.available") }}

                  {{
                    accurateDecimal(getCoinBalance("USDT"), 4, true) +
                    " " +
                    operatingCoin
                  }}
                </p>
                <p v-else>
                  {{ $t("user.available") }}
                  {{
                    accurateDecimal(getCoinBalance(operatingCoin), 4, true) +
                    " " +
                    operatingCoin
                  }}
                </p>
              </div>
              <div class="withdraw_convert">
                <div class="price_convert">
                  <el-input
                    class="price_input"
                    @blur="onVerify('amount')"
                    v-model="walletAmount"
                    type="number"
                  >
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
              <div class="additional_box">
                <div :class="['withdraw_fee', setting.freeFeeStatus && 'free']">
                  <span class="fee_title">
                    {{ t("user.fee") }}
                  </span>
                  <span class="fee_val">
                    {{
                      `${network?.newGas || network?.gas} ${
                        operatingCoin || "--"
                      }`
                    }}
                  </span>
                  <span class="free_text" v-if="setting.freeFeeStatus">
                    {{ t("recharge.free") }}
                  </span>
                </div>
                <div class="max_btn" @click="maxBalance">
                  {{ $t("user.maxV") }}
                </div>
              </div>
              <div class="withdraw_item_error">
                {{ tipsText }}
              </div>
            </div>
            <div
              :class="['withdraw_btn', loading && 'loading']"
              @click="onWithdrawalBalance()"
            >
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
                    <span> {{ t("user.from") }} </span>
                    <span class="required">*</span>
                  </p>
                  <p>
                    {{ t("user.available") }}
                    {{
                      getCoinBalance(exchangeInfo.exchangeFromCoin).toFixed(4) +
                      " " +
                      exchangeInfo.exchangeFromCoin
                    }}
                  </p>
                </div>
                <div class="withdraw_addr_input exchange_addr_input">
                  <div class="exhange_icon" v-if="exchangeOperating == 1">
                    <img :src="getCion('USDT')" alt="" />
                    <span>USDT</span>
                  </div>
                  <div class="exhange_icon" v-else>
                    <el-select
                      v-model="exchangeInfo.exchangeFromCoin"
                      @change="fetchExchangeRate"
                      :popper-append-to-body="false"
                    >
                      <template #prefix>
                        <img
                          :src="getCion(exchangeInfo.exchangeFromCoin)"
                          alt=""
                        />
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
                  <p class="max" @click="maxFunc">{{ $t("user.maxV") }}</p>
                </div>
              </div>
            </div>
            <div class="swap_box" @click="exchangeOperatingFunc">
              <img src="@/assets/svg/user/icon_swap.svg" />
            </div>
            <div class="withdraw_relevant exchange_relevant">
              <div class="withdraw_item">
                <div class="withdraw_item_lable exchange_item_lable">
                  <p>
                    <span> {{ t("user.to") }} </span>
                    <span class="required">*</span>
                  </p>
                </div>
                <div class="withdraw_addr_input exchange_addr_input">
                  <div class="exhange_icon" v-if="exchangeOperating == 1">
                    <el-select
                      v-model="exchangeInfo.exchangeToCoin"
                      @change="fetchExchangeRate"
                      :popper-append-to-body="false"
                    >
                      <template #prefix>
                        <img
                          :src="getCion(exchangeInfo.exchangeToCoin)"
                          alt=""
                        />
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
                `1 ${
                  exchangeInfo.exchangeToCoin
                } ≈ ${exchangeInfo?.exchangeRate.toFixed(4)} ${
                  exchangeInfo.exchangeFromCoin
                }`
              }}</span>
              <!-- <img src="@/assets/svg/user/restart.svg" @click="fetchExchangeRate()" /> -->
              <div
                class="progress"
                style="
                  width: 20px;
                  height: 20px;
                  border: 4px solid rgba(169, 164, 180, 0.5);
                "
              >
                <div
                  class="inner_progress"
                  style="width: 20px; height: 20px; left: -4px; top: 6px"
                  v-if="processStatus"
                >
                  <svg id="svgelem" height="20">
                    <circle cx="20" cy="10" r="8" stroke-width="4">
                      <animate
                        attributeName="stroke-dasharray"
                        from="0,50.265"
                        to="50.265,0"
                        dur="10s"
                        fill="freeze"
                      />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
            <div
              :class="['withdraw_btn exchange_btn', loading && 'loading']"
              @click="exchangeFunc"
            >
              <span>{{ t("user.exchange") }}</span>
            </div>
          </div>
          <rechargeBuyCrypto
            v-else-if="walletOperating == 4"
          ></rechargeBuyCrypto>
          <coupons
            @couponsTips="couponTips"
            v-else-if="walletOperating == 5"
          ></coupons>
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
    <couponSuccess
      v-if="pageType == 'coupons'"
      :couponsVal="couponUSD"
      @closeDialogFun="pageType = null"
    ></couponSuccess>
    <checkWarningDialog
      v-if="pageType == 'checkWarningDialog'"
      :setting="setting"
      @closeDialogFun="pageType = null"
      >{{ t("user.accountExceptionTip") }}</checkWarningDialog
    >
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
  // getRechargeExchangeRate,
  // getWithdrawalExchangeRate,
  withdrawalBalance,
  getWithdrawalChain,
  exchangeRateV2,
  getLegalCurrencyRechargeList,
} from "@/services/api/user";

import QRCode from "qrcodejs2";
import bigNumber from "bignumber.js";
import {
  onCopy,
  accurateDecimal,
  timeFormat,
  isValidEthAddress,
  isValiTronAddress,
  handleWindowResize,
} from "@/utils";
import { getSetting } from "@/services/api/invite";
import rechargeExchangeResult from "./components/rechargeExchangeResult";
import rechargeBuyCrypto from "./components/rechargeBuyCrypto";
import coupons from "./components/coupons";
import couponSuccess from "./components/couponSuccess";
import checkWarningDialog from "@/components/checkDialog/checkWarningDialog";
export default {
  name: "myWallet",
  components: {
    rechargeExchangeResult,
    rechargeBuyCrypto,
    coupons,
    couponSuccess,
    checkWarningDialog,
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
      realExchangeRate: null, // 真实汇率
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
      receiverAddrList: [],
      processStatus: true,
      couponUSD: null,
      legalPlatform: [],
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
      const { exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.ethNum = newV || 0;
          return;
        }
        this.ethNum =
          accurateDecimal(
            new bigNumber(newV || 0).dividedBy(exchangeRate || 0),
            2
          ) || 0;
      }, 300);
    },
    ethNum(newV) {
      if (this.isConvert) return;
      const { exchangeRate } = this;
      this.rateTimer = setTimeout(() => {
        if (!newV) {
          this.walletAmount = newV || 0;
          return;
        }

        this.walletAmount =
          accurateDecimal(
            new bigNumber(newV || 0).multipliedBy(exchangeRate || 0),
            8
          ) || 0;
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
      this.exchangeInfo.exchangeFromAmount =
        Math.floor(
          this.getCoinBalance(this.exchangeInfo.exchangeFromCoin) * 10000
        ) / 10000;
      this.exchangeFromAmountFunc();
    },
    // 提取所有余额
    maxBalance() {
      const { operatingCoin, getCoinBalance } = this;
      let balance = 0;
      if (operatingCoin == "USDC") {
        balance = Number(accurateDecimal(getCoinBalance("USDT"), 4));
      } else {
        balance = Number(accurateDecimal(getCoinBalance(operatingCoin), 4));
      }

      this.walletAmount = balance;
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
        exchangeToAmount =
          Math.floor(
            (this.exchangeInfo.exchangeFromAmount /
              this.exchangeInfo.exchangeRate) *
              10000
          ) / 10000;
      }
      this.exchangeInfo.exchangeToAmount = exchangeToAmount;
    },
    exchangeToAmountFunc() {
      let exchangeFromAmount = null;
      if (this.exchangeInfo.exchangeToAmount) {
        exchangeFromAmount =
          Math.floor(
            this.exchangeInfo.exchangeToAmount *
              this.exchangeInfo.exchangeRate *
              10000
          ) / 10000;
      }
      this.exchangeInfo.exchangeFromAmount = exchangeFromAmount;
      this.onVerifyExchange();
    },
    onVerifyExchange(type) {
      if (type) {
        this.exchangeFromAmountFunc();
      }
      if (
        !this.exchangeInfo.exchangeFromAmount ||
        this.exchangeInfo.exchangeFromAmount == 0
      ) {
        this.exchangeAmountTips = t("user.enterError6");
      } else if (
        this.exchangeInfo.exchangeFromAmount >
        this.getCoinBalance(this.exchangeInfo.exchangeFromCoin)
      ) {
        this.exchangeAmountTips = t("user.enterError4");
      } else if (
        (this.exchangeInfo.exchangeFromCoin == "USDT" &&
          this.exchangeInfo.exchangeFromAmount < 1) ||
        (this.exchangeInfo.exchangeToCoin == "USDT" &&
          this.exchangeInfo.exchangeToAmount < 1)
      ) {
        this.exchangeAmountTips = t("user.enterError7", { data: "1 USDT" });
      } else {
        this.exchangeAmountTips = null;
      }
    },

    // exchange汇率
    async fetchExchangeRate(type) {
      const coin =
        this.exchangeInfo.exchangeToCoin == "USDT"
          ? this.exchangeInfo.exchangeFromCoin
          : this.exchangeInfo.exchangeToCoin;
      const res = await exchangeRateV2({
        coinName: coin,
      });
      if (res && res.code == 200) {
        const down = this.getExchangeDown(this.exchangeInfo.exchangeToCoin);
        if (this.exchangeInfo.exchangeFromCoin == "USDT") {
          this.exchangeInfo.exchangeRate = res.data / (1 - down);
        } else {
          this.exchangeInfo.exchangeRate = 1 / (res.data * (1 - down));
        }
        if (type == 1) {
          this.exchangeFromAmountFunc();
        } else if (type == 2) {
          this.exchangeToAmountFunc();
        }
      }
    },

    async exchangeOperatingFunc() {
      this.exchangeOperating == 1
        ? (this.exchangeOperating = 2)
        : (this.exchangeOperating = 1);
      [this.exchangeInfo.exchangeFromCoin, this.exchangeInfo.exchangeToCoin] = [
        this.exchangeInfo.exchangeToCoin,
        this.exchangeInfo.exchangeFromCoin,
      ];
      if (this.exchangeOperating == 1) {
        this.exchangeInfo.exchangeFromAmount =
          this.exchangeInfo.exchangeToAmount;
        this.fetchExchangeRate(1);
      } else {
        this.exchangeInfo.exchangeToAmount =
          this.exchangeInfo.exchangeFromAmount;
        this.fetchExchangeRate(2);
      }
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
      if (this.exchangeRateTimer) {
        clearInterval(this.exchangeRateTimer);
      }
      if (this.walletOperating == 1 && this.operatingCoin != null) {
        this.$nextTick(() => {
          this.createQrcode();
        });

        this.fetchRechargeExchangeRate(this.operatingCoin);
      } else if (this.walletOperating == 3) {
        this.fetchExchangeRate(1);
        this.exchangeRateTimer = setInterval(() => {
          this.fetchExchangeRate();
          this.processStatus = false;
          setTimeout(() => {
            this.processStatus = true;
          }, 100);
        }, 10000);
      } else {
        this.fetchWithdrawalExchangeRate();
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
        this.getWalletAddress();
      }

      if (this.walletOperating == 1) {
        this.$nextTick(() => {
          this.createQrcode();
        });

        this.fetchRechargeExchangeRate(event);
      } else {
        this.fetchRechargeExchangeRate(event);
        this.fetchWithdrawalExchangeRate();
      }

      this.$forceUpdate();
    },
    // 支持的网络
    async fetchWithdrawalChain(type) {
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
          this.walletNetworkChange();
        }
        if (type == true) {
          this.fetchRechargeExchangeRate(this.operatingCoin);
        }
      }
    },
    walletNetworkChange() {
      if (this.walletNetwork && this.networkDrop) {
        this.getWalletAddress();
        localStorage.setItem("receiver", this.receiverAddr);
        this.$nextTick(() => {
          this.createQrcode();
        });
      }
    },
    getWalletAddress() {
      const type = this.networkDrop.find(
        (x) => x.chain == this.walletNetwork
      )?.type;
      this.receiverAddr = this.receiverAddrList.find(
        (x) => x.type == type
      )?.address;
    },
    // 收款地址
    async fetchReceivingAddr() {
      const res = await getTheUserSPayoutAddress();
      if (res && res.code == 200) {
        this.receiverAddrList = res.data;
        this.walletNetworkChange();
      }
    },

    // 充值汇率
    async fetchRechargeExchangeRate(coin = "ETH") {
      const down = this.getExchangeDown(coin);
      if (coin == "USDT") {
        this.exchangeRate = 1 / (1 * (1 - down));
        this.walletAmount = null;
        setTimeout(() => {
          this.walletAmount = 1;
        }, 200);
        return;
      }
      const res = await exchangeRateV2({
        coinName: coin,
      });
      if (res && res.code == 200) {
        this.exchangeRate = 1 / (res.data * (1 - down));
        this.realExchangeRate = res.data;
        this.walletAmount = null;
        setTimeout(() => {
          this.walletAmount = 1;
        }, 200);
      }
    },
    // 提款汇率
    async fetchWithdrawalExchangeRate() {
      // const res = await getWithdrawalExchangeRate({
      //   coinName: "ETH",
      // });
      // if (res && res.code == 200) {
      //   this.exchangeRate = res.data;
      //   this.walletAmount = 0;
      // }
      this.walletAmount = 0;
    },

    // 真实汇率
    async fetchRealExchangeRate(coin) {
      const res = await exchangeRateV2({
        coinName: coin,
      });
      if (res && res.code == 200) {
        const down = this.getExchangeDown(coin);
        this.exchangeRate = res.data / (1 - down);
      }
    },
    // 获取法币支付平台
    async getLegalCurrencyRechargeListFunc() {
      const res = await getLegalCurrencyRechargeList();
      if (res && res.code == 200) {
        this.legalPlatform = res.data;
      }
    },
    // 验证
    onVerify(type) {
      const {
        operatingCoin,
        walletNetwork,
        setting,
        walletAmount,
        walletAddr,
        network,
      } = this;

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
        const type = this.networkDrop.find(
          (x) => x.chain == this.walletNetwork
        )?.type;
        if (type == "TRON" && !isValiTronAddress(walletAddr)) {
          this.walletAddrTips = t("user.enterError2", {
            coin: `${operatingCoin != "USDT" ? "Ethereum" : "Tether"}`,
          });
          this.verifys = false;
          return;
        } else if (type != "TRON" && !isValidEthAddress(walletAddr)) {
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
        const { operatingCoin } = this;
        const coin = operatingCoin == "USDC" ? "USDT" : operatingCoin;
        if (!walletAmount) {
          this.tipsText = t("user.enterError3");
          this.verifys = false;
          return;
        } else if (Number(walletAmount) > this.getCoinBalance(coin)) {
          this.tipsText = t("user.enterError4");
          this.verifys = false;
          return;
        } else if (
          !setting.freeFeeStatus &&
          Number(network?.gas) > Number(this.walletAmount)
        ) {
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
      const {
        walletAmount,
        walletAddr,
        operatingCoin,
        walletNetwork,
        loading,
      } = this;
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
      } else if (res?.length == 3) {
        if (res[2].messageKey === "the_account_limit_withdrawal") {
          this.pageType = "checkWarningDialog";
        } else if (res[2].messageKey === "min_withdrawal_limit") {
          this.$message.closeAll();
          let amount = this.setting?.minWithdrawal;
          if (operatingCoin != "USDT" && operatingCoin != "USDC") {
            amount = (
              this.setting?.minWithdrawal / this.realExchangeRate
            ).toFixed(4);
          }
          this.$message.warning(
            t("user.enterError8", { data: `${amount} ${operatingCoin}` })
          );
        }
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
    couponTips(event) {
      this.pageType = "coupons";
      this.couponUSD = event;
      this.renewBalance();
    },
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "USDT",
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
    try {
      // eslint-disable-next-line no-undef
      dataLayer.push({
        event: "deposit_box_open",
        ecommerce: "ok",
      });
    } catch (err) {
      console.log(err);
    }
  },
  created() {
    this.getLegalCurrencyRechargeListFunc();
    this.renewBalance();
    this.fetchSetting();
    this.fetchWithdrawalChain(true);
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
