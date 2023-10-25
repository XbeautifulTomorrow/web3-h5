<template>
  <el-dialog
    class="dialog_box"
    v-model="dialogVisible"
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
    <div class="content">
      <div v-if="pageType == 1">
        <div class="dialog_title">确认兑换</div>
        <div class="dialog_exchange_box">
          <div class="dialog_sub_exchange">
            <img :src="getCion(exchangeInfo.exchangeFromCoin)" alt="" />
            <p class="txt">消耗</p>
            <p class="val">{{ exchangeInfo.exchangeFromAmount }} {{ exchangeInfo.exchangeFromCoin }}</p>
          </div>
          <div class="exchange_icon"><img src="@/assets/svg/user/icon_swap2.svg" /></div>
          <div class="dialog_sub_exchange">
            <img :src="getCion(exchangeInfo.exchangeToCoin)" alt="" />
            <p class="txt">获得</p>
            <p class="val">{{ exchangeInfo.exchangeToAmount }} {{ exchangeInfo.exchangeToCoin }}</p>
          </div>
        </div>
        <div class="dialog_exchange_info">
          <div class="item_info">
            <p class="label">手续费</p>
            <p class="info_tag">0 手续费</p>
          </div>
          <div class="item_info">
            <p class="label">兑换比例</p>
            <p class="info">
              预估值 {{ `1 ${exchangeInfo.exchangeToCoin} ≈ ${exchangeInfo?.exchangeRate.toFixed(4)} ${exchangeInfo.exchangeFromCoin}` }}
            </p>
          </div>
        </div>
        <div class="tip_box">
          <p class="tip" v-show="seconds < 1"><img src="@/assets/svg/user/warning.svg" />该报价已过期，请重新获取报价。</p>
        </div>

        <div class="handle_btn" @click="exchangeSubmit" v-if="seconds > 0">兑换（{{ seconds }}s）</div>
        <div class="handle_btn dark_btn" v-else @click="refreshFunc">更新报价</div>
      </div>
      <div v-else>
        <div class="dialog_title">Conversion Successful</div>
        <img src="@/assets/svg/user/success.svg" class="status_icon" />
        <div class="dialog_exchange_info">
          <div class="item_info">
            <p class="label">消耗</p>
            <p class="info">
              <span>{{ exchangeInfo.exchangeFromAmount }}</span
              ><img :src="getCion(exchangeInfo.exchangeFromCoin)" class="coin" alt="" />
            </p>
          </div>
          <div class="item_info">
            <p class="label">获得</p>
            <p class="info">
              <span v-priceFormat:4="exchangeInfo.exchangeToAmount"></span><img :src="getCion(result.exchangeToCoin)" class="coin" alt="" />
            </p>
          </div>
          <div class="item_info">
            <p class="label">手续费</p>
            <p class="info_tag">0 手续费</p>
          </div>
          <div class="item_info">
            <p class="label">兑换比例</p>
            <p class="info">
              {{ `1 ${result.exchangeToCoin} = ${result?.exchangeRate.toFixed(4)} ${exchangeInfo.exchangeFromCoin}` }}
            </p>
          </div>
          <div class="item_info">
            <p class="label">兑换时间</p>
            <p class="info">{{ timeForStr(result?.exchangeTime) }}</p>
          </div>
        </div>
        <div class="handle_btn" @click="handleClose">返回</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import bigNumber from "bignumber.js";
import { timeForStr } from "@/utils";
import { flashExchange } from "@/services/api/user";
export default {
  name: "rechargeExchangeResult",
  props: {
    exchangeInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: true,
      pageType: 1, //1兑换前；2兑换后结果
      timer: null,
      seconds: 10,
      result: {
        exchangeToAmount: "",
        exchangeToCoin: "",
        exchangeRate: "",
        exchangeTime: null,
      },
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
  },
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 关闭创建弹窗
    handleClose(e) {
      this.$emit("closeDialogFun", e);
    },
    getCion(coin) {
      return this.$parent.getCion(coin);
    },
    refreshFunc() {
      this.seconds = 10;
      this.$parent.fetchExchangeRate();
    },
    async exchangeSubmit() {
      const res = await flashExchange({
        areaCoin: this.exchangeInfo.exchangeFromCoin,
        coinName: this.exchangeInfo.exchangeToCoin,
        amount: this.exchangeInfo.exchangeFromAmount,
      });
      if (res?.code == 200) {
        this.$parent.renewBalance();
        this.result.exchangeToAmount = res.data.amount;
        this.result.exchangeToCoin = res.data.coin;
        this.result.exchangeRate = res.data.exchangeRate;
        this.result.exchangeTime = res.localDateTime;

        this.pageType = 2;
      }
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      }
    }, 1000);
  },
  created() {},
  unmounted() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
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
</style>
