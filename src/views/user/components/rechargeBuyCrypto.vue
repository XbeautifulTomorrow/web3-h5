<template>
  <div class="buy_crypto_box exchange_box">
    <div class="withdraw_relevant exchange_relevant">
      <div class="withdraw_item">
        <div class="withdraw_item_lable exchange_item_lable">
          <p>
            <span> {{ $t("user.youPayWith") }} </span> <span class="required">*</span>
          </p>
        </div>
        <div class="withdraw_addr_input exchange_addr_input">
          <div class="exhange_icon">
            <el-select v-model="exchangeFromCoin" @change="getAmountFunc('from')" :popper-append-to-body="false">
              <template #prefix>
                <img :src="getImgFunc(exchangeFromCoin)" v-if="getImgFunc(exchangeFromCoin)" alt="" />
                <p class="coin_icon" :style={background:noImgCoin[exchangeFromCoin]} v-else>{{exchangeFromCoin[0]}}</p>
              </template>
              <template v-for="(item, index) in coinList" :key="index">
                <el-option :label="index" :value="index">
                  <div class="icon_label">
                    <img :src="getImgFunc(index)" alt="" v-if="getImgFunc(index)" />
                    <p class="coin_icon" :style={background:noImgCoin[index]} v-else>{{index[0]}}</p>
                    <span>{{ index }}</span>
                  </div>
                </el-option>
              </template>
            </el-select>
          </div>
          <el-input type="number" v-model="exchangeFromAmount" :readonly="fromLoading" placeholder="0.0000" @input="handleInput('from')">
            <template #suffix>
              <el-icon class="is-loading" v-if="fromLoading">
                <Loading />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="withdraw_item_error">
          <p>{{ exchangeFromAmountTips }}</p>
        </div>
      </div>
      <div class="withdraw_item">
        <div class="withdraw_item_lable exchange_item_lable">
          <p>
            <span> {{ $t("user.youGet") }} </span> <span class="required">*</span>
          </p>
        </div>
        <div class="withdraw_addr_input exchange_addr_input">
          <div class="exhange_icon">
            <img :src="getCoin('USDT')" alt="" />
            <span>USDT</span>
          </div>

          <el-input type="number" v-model="exchangeToAmount" readonly placeholder="0.0000" @input="handleInput('to')">
            <template #suffix>
              <el-icon class="is-loading" v-if="toLoading">
                <Loading />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="withdraw_item_error">
          <p>{{ exchangeToAmountTips }}</p>
        </div>
      </div>
    </div>
    <div class="module_info">
      <div class="item_info">
        <p class="label">{{ $t("user.paymentProvider") }}</p>
        <p class="info_tag">
          <img src="@/assets/img/user/payment.png" alt="" />
        </p>
      </div>
      <div class="item_info">
        <p class="label">{{ $t("user.depositAccount") }}</p>
        <p class="info">
          {{ userInfo?.userName || userInfo?.email }}
        </p>
      </div>
    </div>
    <div class="module_info">
      <div class="item_info">
        <p class="label">{{ $t("user.totalAmount") }}</p>
        <p class="info font1">
          <el-icon class="is-loading" v-if="fromLoading">
            <Loading />
          </el-icon>
          <span v-else>{{ (exchangeFromAmount || 0) + " " + exchangeFromCoin }}</span>
        </p>
      </div>
      <div class="item_info">
        <p class="label">{{ $t("user.youWillGet") }}</p>
        <p class="info font2">
          <el-icon class="is-loading" v-if="toLoading">
            <Loading />
          </el-icon>
          <span v-else>{{ (exchangeToAmount || 0) + " " + exchangeToCoin }}</span>
        </p>
      </div>
    </div>
    <div class="notice_box">
      <span class="label">{{ $t("lottery.notice") }}:</span>
      <span class="tip">{{ $t("user.threePayTip") }}</span>
    </div>
    <div class="form-rember">
      <span class="form-rember-rectangle" @click="agreeFun">
        <span v-show="agree" class="form-rember-rectangle-fill"></span>
      </span>
      <div class="form-rember-text" @click="agreeFun">
        <el-tooltip class="item" effect="dark" placement="top" popper-class="tooltip_popper_disclaimer">
          <template #content>
            <div class="tooltip_content">
              {{ $t("user.threePayDisclaimer") }}
            </div>
          </template>
          <p v-html="$t('user.agreeDisclaimer')"></p>
        </el-tooltip>
      </div>
    </div>
    <div
      :class="[
        'handle_btn',
        { dark_btn: !exchangeFromAmount || !exchangeToAmount || exchangeFromAmountTips || exchangeToAmountTips || !agree },
      ]"
      @click="submitFunc"
    >
      MERCURYO
    </div>
    <checkLoading v-if="showLoadingeDialog" @closeDialogFun="showLoadingeDialog = false"></checkLoading>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import bigNumber from "bignumber.js";
import { timeForStr } from "@/utils";
import { productionOfThirdPartyOrders, productionOfThirdPartyRate } from "@/services/api/user";
import { i18n } from "@/locales";
const { t } = i18n.global;
import checkLoading from "@/components/checkDialog/checkLoading";

export default {
  name: "rechargeBuyCrypto",
  props: {},
  components: { checkLoading },
  data() {
    return {
      agree: false,
      exchangeAmountTips: "",
      exchangeFromAmountTips: null,
      exchangeToAmountTips: null,
      exchangeFromAmount: null,
      exchangeToAmount: null,
      exchangeFromCoin: "USD",
      exchangeToCoin: "USDT",
      errorRes: null,
      rate: null,
      inputTimer: null,
      fromLoading: false,
      toLoading: false,
      showLoadingeDialog: false,
      coinImgList:['AUD','BGN','BRL','CAD','CHF','CZK','DKK','EUR','GBP','GHS','HKD','JPY','KRW','MXN','NGN','PHP','PLN','SEK','TRY','TWD','USD','VND'],
      noImgCoin:{},
      colors:['#4489ff','#ee5396','#60c6d2','#a56dff','#02cd58','#f8cc33','#ff8a16']
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
    coinList() {
      const headerStore = useUserStore();
      return headerStore.buyCryptoCoinRates;
    },
    three_pay_widget_id() {
      const headerStore = useUserStore();
      return headerStore.three_pay_widget_id;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
  },
  watch: {
    coinList(val) {
      if (Object.keys(val).length !== 0) {
        this.rate = val[this.exchangeFromAmount];
      }
    },
  },
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    getImgFunc(coin){
      if(this.coinImgList.includes(coin)){
        return require(`@/assets/svg/newCoin/${coin}.svg`)
      } else {
        this.getNoImgCoin(coin);
        return false
      }
    },
    getNoImgCoin(coin){
      if(!this.noImgCoin[coin]){
        this.noImgCoin[coin] = this.colors[Math.floor(Math.random() * this.colors.length)]
      }
    },
    getCoin(coin) {
      const headerStore = useUserStore();
      return headerStore.getCoin(coin);
    },
    agreeFun() {
      this.agree = !this.agree;
    },
    handleInput(type) {
      clearTimeout(this.inputTimer);
      this.inputTimer = setTimeout(() => {
        this.getAmountFunc(type);
      }, 500);
    },
    async getAmountFunc(type) {
      this.errorRes = null;
      this.onVerifyExchange(type);
      type == "from" ? (this.exchangeToAmount = null) : (this.exchangeFromAmount = null);
      let from = type == "from" ? this.exchangeFromCoin : this.exchangeToCoin;
      let to = type == "from" ? this.exchangeToCoin : this.exchangeFromCoin;
      let amount = type == "from" ? this.exchangeFromAmount : this.exchangeToAmount;

      if (amount > 0) {
        type == "from" ? (this.toLoading = true) : (this.fromLoading = true);
        const res = await productionOfThirdPartyRate({ from, to, amount, widget_id: this.three_pay_widget_id });
        if (res && res.data) {
          if (res?.headers) {
            type == "from" ? (this.toLoading = false) : (this.fromLoading = false);
            let data = res?.data;
            if (data?.code == 400005) {
              this.errorRes = data?.data;
              this.onVerifyExchange(type);
            } else if (data?.code == 400001) {
              if (type == "from") {
                this.exchangeFromAmountTips = data?.data.amount[0];
              } else {
                this.exchangeToAmountTips = data?.data.amount[0];
              }
            }
          } else {
            type == "from" ? (this.toLoading = false) : (this.fromLoading = false);
            this.errorRes = null;
            let data = res?.data;
            if (type == "from") {
              this.exchangeToAmount = data?.amount;
            } else {
              this.exchangeFromAmount = data?.fiat_amount;
            }
            this.onVerifyExchange(type);
          }
        }
      }
    },
    async submitFunc() {
      this.onVerifyExchange("from");
      this.onVerifyExchange("to");
      if (!this.exchangeFromAmountTips && !this.exchangeToAmountTips && this.agree) {
        let res = await productionOfThirdPartyOrders();
        if (res && res.code == 200) {
          let targetUrl = `${res.data}&amount=${this.exchangeToAmount}&fiat_currencies=${this.exchangeFromCoin}`;
          this.showLoadingeDialog = true;
          setTimeout(() => {
            window.open(targetUrl);
          }, 1000);
        }
      }
    },
    onVerifyExchange(type) {
      this.exchangeFromAmountTips = null;
      this.exchangeToAmountTips = null;
      let exchangeAmountTips = null;
      let coin = type == "from" ? this.exchangeFromCoin : this.exchangeToCoin;
      let amount = type == "from" ? this.exchangeFromAmount : this.exchangeToAmount;
      let min = 0;
      let max = 0;
      if (this.errorRes) {
        min = this.errorRes[coin].min;
        max = this.errorRes[coin].max;
      }
      if (!this.errorRes) {
        if (amount && amount <= 0) {
          exchangeAmountTips = t("user.ruleTip1");
        }
      } else {
        if (Number(amount) < Number(min)) {
          exchangeAmountTips = t("user.ruleTip2", { min, coin: this.exchangeFromCoin });
        } else if (Number(amount) > Number(max)) {
          exchangeAmountTips = t("user.ruleTip3", { max, coin: this.exchangeFromCoin });
        } else {
          exchangeAmountTips = null;
        }
      }

      if (type == "from") {
        this.exchangeFromAmountTips = exchangeAmountTips;
      } else {
        this.exchangeToAmountTips = exchangeAmountTips;
      }
    },
  },
  mounted() {},
  created() {},
  unmounted() {},
};
</script>
<style lang="scss" scoped>
@import "./wallet.scss";
.buy_crypto_box {
  .module_info {
    padding: 1.25rem;
    border-radius: 0.625rem;
    background-color: #191c28;
    margin-top: 1.25rem;
    .item_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        font-size: 0.875rem;
        color: #a9a4b4;
      }
      .info_tag {
        img {
          width: 8.8125rem;
          height: 2.5rem;
        }
      }
      .info {
        display: flex;
        align-items: center;
        color: #ffffff;
        &.font1 {
          font-family: Inter;
          font-size: 1.5rem;
          font-weight: normal;
        }
        &.font2 {
          font-family: Inter;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .coin {
          width: 1.5rem;
          height: 1.5rem;
          margin-left: 0.5rem;
        }
      }
    }
  }
  .notice_box {
    height: 3.75rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.25rem;
    padding: 0 1.25rem;
    border-radius: 0.625rem;
    background-color: #332e1b;
    margin-top: 1.25rem;
    .label {
      color: #fad54d;
      font-weight: bold;
    }
    .tip {
      color: #a9a4b4;
    }
  }
  .form-rember {
    display: flex;
    align-items: center;
    margin-top: 0.825rem;
    margin-bottom: 1.875rem;
  }

  .form-rember-rectangle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-right: 0.75rem;
    border-radius: 0.1875rem;
    border: solid 1px #a9a4b4;
    cursor: pointer;
  }

  .form-rember-rectangle-fill {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.125rem;
    background-color: #fad54d;
  }

  .form-rember-text {
    font-size: 1rem;
    text-align: left;
    color: #a9a4b4;
    cursor: pointer;
  }

  .handle_btn {
    width: 100%;
    height: 3.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background-image: linear-gradient(to top, #e3a406, #fbd851);
    cursor: pointer;
    font-size: 1.125rem;
    line-height: 1.21;
    text-align: center;
    color: #13151f;
    &.dark_btn {
      border: solid 1px rgba(228, 231, 245, 0.15);
      background-color: #292c36;
      background-image: none;
      color: #e4e7f5;
    }
  }
}

.content {
  margin: 0 3.75rem;
}
.dialog_title {
  height: 3.75rem;
  font-family: BlenderPro;
  font-size: 2.875rem;
  line-height: 1.3;
  color: #e4e7f5;
  margin-bottom: 1.875rem;
}
.dialog_exchange_box {
  display: flex;
  margin-bottom: 1.875rem;
  .dialog_sub_exchange {
    flex: 1;
    padding: 20px;
    border-radius: 10px;
    background-color: #191c28;
    img {
      width: 5rem;
      margin-bottom: 1rem;
    }
    .txt {
      font-size: 1rem;
      color: #a9a4b4;
      font-weight: bold;
    }
    .val {
      font-family: Inter;
      font-size: 1.125rem;
      font-weight: bold;
      line-height: 1.5;
      color: #fff;
      margin-top: 0.5rem;
    }
  }
  .exchange_icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.25rem;
    img {
      width: 2.25rem;
      height: 2.25rem;
      padding: 0.25rem;
      border-radius: 50%;
      background-color: #20222d;
    }
  }
}
.dialog_exchange_info {
  padding: 1.25rem;
  border-radius: 0.625rem;
  background-color: #191c28;
  margin-bottom: 1.875rem;
  .item_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      font-size: 0.875rem;
      color: #a9a4b4;
    }
    .info_tag {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 4px 16px;
      border-radius: 4px;
      background-color: rgba(12, 187, 62, 0.3);
      color: #0cbb3e;
      font-size: 0.875rem;
    }
    .info {
      display: flex;
      align-items: center;
      .coin {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
      }
    }
  }
}
.tip_box {
  height: 1.625rem;
  line-height: 1.625rem;
  margin-bottom: 1.875rem;
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Inter;
    font-size: 0.875rem;
    color: #fff;
    img {
      margin-right: 8px;
    }
  }
}

.status_icon {
  margin-bottom: 1.875rem;
}
.close_btn {
  position: absolute;
  top: 1.6875rem;
  right: 1.875rem;
  width: 2.8125rem;
  height: 2.8125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #2d313f;
  background-color: #2a2d36;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  color: #a9a4b4;
}
@media screen and (max-width: 950px) {
  .buy_crypto_box {
    .module_info {
      margin-top: 0.5rem;
      border-radius: 0.25rem;
      .item_info {
        .info {
          &.font1 {
            font-size: 1rem;
          }
          &.font2 {
            font-size: 1rem;
          }
        }
        .info_tag {
          img {
            width: auto;
            height: 1.875rem;
          }
        }
      }
    }
    .notice_box {
      height: auto;
      display: block;
      text-align: left;
      padding: 0.5rem;
      margin-top: 0.5rem;
      border-radius: 0.25rem;
      .label {
        margin-right: 0.25rem;
      }
    }
    .form-rember {
      margin-bottom: 1rem;
    }
    .handle_btn {
      width: 100%;
      height: 2rem;
      border-radius: 0.25rem;
      font-size: 0.625rem;
      margin-top: 0rem;
    }
  }
}
</style>
<style lang="scss">
.tooltip_popper_disclaimer {
  width: 22.25rem;
  background-color: #2c115b !important;
  color: #a9a4b4 !important;
  border-color: #2c115b !important;
  .el-popper__arrow::before {
    background-color: #2c115b !important;
  }
}
</style>
