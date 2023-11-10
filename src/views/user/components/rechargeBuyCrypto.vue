<template>
  <div class="buy_crypto_box exchange_box">
    <div class="withdraw_relevant exchange_relevant">
      <div class="withdraw_item">
        <div class="withdraw_item_lable exchange_item_lable">
          <p>
            <span> {{ $t("YOU PAY WITH") }} </span> <span class="required">*</span>
          </p>
        </div>
        <div class="withdraw_addr_input exchange_addr_input">
          <div class="exhange_icon">
            <el-select v-model="exchangeInfo.exchangeFromCoin" @change="fetchExchangeRate" :popper-append-to-body="false">
              <template #prefix>
                <img :src="getCion(exchangeInfo.exchangeFromCoin)" alt="" />
              </template>
              <template v-for="(item, index) in networkList">
                <el-option :key="index" :label="item.coinName" :value="item.coinName" v-if="item.coinName != 'USDT' && item.isExchange">
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
        </div>
      </div>
      <div class="withdraw_item">
        <div class="withdraw_item_lable exchange_item_lable">
          <p>
            <span> {{ $t("YOU GET") }} </span> <span class="required">*</span>
          </p>
        </div>
        <div class="withdraw_addr_input exchange_addr_input">
          <div class="exhange_icon">
            <img :src="getCion('USDT')" alt="" />
            <span>USDT</span>
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
        </div>
      </div>
    </div>
    <div class="module_info">
      <div class="item_info">
        <p class="label">{{ $t("Payment Provider") }}</p>
        <p class="info_tag">{{ $t("user.zeroFee") }}</p>
      </div>
      <div class="item_info">
        <p class="label">{{ $t("user.exchangeRate") }}</p>
        <p class="info">
          {{ $t("xxxxxxx") }}
        </p>
      </div>
    </div>
    <div class="module_info">
      <div class="item_info">
        <p class="label">{{ $t("Total（including fee）") }}</p>
        <p class="info font1">100 USD</p>
      </div>
      <div class="item_info">
        <p class="label">{{ $t("You Will Get") }}</p>
        <p class="info font2">98.54 USDT</p>
      </div>
    </div>
    <div class="notice_box">
      <span class="label">NOTICE:</span>
      <span class="tip">Depending on the blockchain, the deposit may take a few minutes to 1 hour to arrive.</span>
    </div>
    <div class="form-rember">
      <span class="form-rember-rectangle" @click="showRememberFun">
        <span v-show="showRemember" class="form-rember-rectangle-fill"></span>
      </span>
      <div class="form-rember-text">
        <el-tooltip
          class="item"
          effect="dark"
          content="Disclaimer: The above third party services can be used to purchase crypto that can be used to play on Bitzing. By registering on their platform, you are also accepting to their terms of service and will be required to pass their KYC process, which runs independently to ours."
          placement="top"
        >
          <p>{{ $t("I have read and agree to the disclaimer.") }}</p>
        </el-tooltip>
      </div>
    </div>
    <div class="handle_btn" @click="submitFunc">第三方支付的名称</div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import bigNumber from "bignumber.js";
import { timeForStr } from "@/utils";
import {} from "@/services/api/user";
export default {
  name: "rechargeBuyCrypto",
  props: {},
  data() {
    return {
      showRemember: false,
      exchangeInfo: {
        exchangeFromAmount: null,
        exchangeToAmount: null,
        exchangeFromCoin: "USDT",
        exchangeToCoin: "ETH",
        exchangeRate: 0,
      },
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
  },
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    getCion(coin) {
      const headerStore = useUserStore();
      return headerStore.getCoin(coin);
    },
    showRememberFun() {
      this.showRemember = !this.showRemember;
    },
    submitFunc() {},
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
    margin-top: 0.625rem;
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
    line-height: 1.6;
    text-align: left;
    color: #a9a4b4;
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
}
</style>
