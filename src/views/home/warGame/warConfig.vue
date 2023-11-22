<template>
  <div>
    <el-dialog
      v-model="show"
      destroy-on-close
      :show-close="false"
      :align-center="true"
      class="public-dialog"
      width="31.875rem"
      :before-close="handleClose"
    >
      <div class="public-dialog-content form-content" v-if="type == 'auto'">
        <p class="buy_title">
          <span>{{ $t("tokenWar.autoWar") }}</span>
          <el-tooltip
            popper-class="tips_box"
            effect="dark"
            :content="$t('tokenWar.autoTips')"
          >
            <img src="@/assets/svg/home/warGame/icon_help.svg" alt="" />
          </el-tooltip>
        </p>
        <div class="rounds_num">
          <div
            :class="['rounds_item', autoChoose == 1 ? 'active' : '']"
            @click="chooseAutoRound(1, 10)"
          >
            10
          </div>
          <div
            :class="['rounds_item', autoChoose == 2 ? 'active' : '']"
            @click="chooseAutoRound(2, 20)"
          >
            20
          </div>
          <div
            :class="['rounds_item', autoChoose == 3 ? 'active' : '']"
            @click="chooseAutoRound(3, 50)"
          >
            50
          </div>
          <div
            :class="['rounds_item', autoChoose == 4 ? 'active' : '']"
            @click="chooseAutoRound(4, 100)"
          >
            100
          </div>
          <div
            :class="['rounds_item', autoChoose == 5 ? 'active' : '']"
            @click="chooseAutoRound(5, 0)"
          >
            <el-input
              class="rounds_val"
              type="number"
              v-model.number="customize"
              :placeholder="$t('tokenWar.customize')"
            >
            </el-input>
          </div>
        </div>
        <div class="interval"></div>
        <div class="config_box">
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="autoBuyAmount"
                @change="changeNum"
                :min="0"
                :max="endNum"
                :step="stepNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              @focus="isChangeNum = true"
              v-model.number="autoConfig.autoBuyAmount"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">{{ $t("tokenWar.dedicateTroops") }}</div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="autoBuyTime"
                @change="changeNum"
                :min="1"
                :max="100"
                :step="1"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num time"
              type="number"
              @focus="isChangeNum = true"
              v-model.number="autoConfig.autoBuyTime"
              placeholder=""
            >
              <template #append>
                <div class="time_box">{{ $t("tokenWar.second") }}</div>
              </template>
            </el-input>
          </div>
          <div class="config_title">{{ $t("tokenWar.entryTime") }}</div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="lowBounsPool"
                @change="changeNum"
                :min="0"
                :max="endNum"
                :step="stepNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              @focus="isChangeNum = true"
              v-model.number="autoConfig.lowBounsPool"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">{{ $t("tokenWar.minLoot") }}</div>
        </div>
        <div class="config_btns">
          <div class="btn_cancel" @click="handleClose()">
            {{ $t("common.cancelUpper") }}
          </div>
          <div class="btn_confirm" @click="submitData()">
            {{ $t("login.ok") }}
          </div>
        </div>
      </div>
      <div class="public-dialog-content form-content" v-if="type == 'lock'">
        <p class="buy_title">
          <span>{{ $t("tokenWar.lockWinRate") }}</span>
          <el-tooltip
            popper-class="tips_box"
            effect="dark"
            :content="$t('tokenWar.lockTips')"
          >
            <img src="@/assets/svg/home/warGame/icon_help.svg" alt="" />
          </el-tooltip>
        </p>
        <div class="lock_status">
          <div class="status_title">{{ $t("tokenWar.mode") }}</div>
          <div class="rounds_num">
            <div
              :class="[
                'rounds_item',
                autoConfig.lockWinRateStatus == 'CLOSE' ? 'active' : '',
              ]"
              @click="chooseLock('CLOSE')"
            >
              {{ $t("tokenWar.close") }}
            </div>
            <div
              :class="[
                'rounds_item',
                autoConfig.lockWinRateStatus == 'OPEN' ? 'active' : '',
              ]"
              @click="chooseLock('OPEN')"
            >
              {{ $t("tokenWar.onlyOnce") }}
            </div>
            <div
              :class="[
                'rounds_item',
                autoConfig.lockWinRateStatus == 'AUTO' ? 'active' : '',
              ]"
              @click="chooseLock('AUTO')"
            >
              {{ $t("tokenWar.auto") }}
            </div>
          </div>
        </div>
        <div class="interval"></div>
        <div class="config_box">
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="lockWinRate"
                @change="changeNum"
                :min="1"
                :max="100"
                :step="1"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num time"
              type="number"
              @focus="isChangeNum = true"
              v-model.number="autoConfig.lockWinRate"
              placeholder=""
            >
              <template #append>
                <div class="time_box">%</div>
              </template>
            </el-input>
          </div>
          <div class="config_title">
            {{ $t("tokenWar.targetWinRate") }}
          </div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="lockMaxAmount"
                @change="changeNum"
                :min="0"
                :max="Math.floor(usdBalance)"
                :step="balanceStartNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              @focus="isChangeNum = true"
              v-model.number="autoConfig.lockMaxAmount"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">
            {{ $t("tokenWar.maxInvest") }}
          </div>
        </div>
        <div class="config_btns">
          <div class="btn_cancel" @click="handleClose()">
            {{ $t("common.cancelUpper") }}
          </div>
          <div class="btn_confirm" @click="submitData()">
            {{ $t("login.ok") }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import { deepClone, accurateDecimal } from "@/utils";
import { getAutoConfig, setAutoConfig } from "@/services/api/tokenWar";
import bigNumber from "bignumber.js";

export default {
  name: "WarConfig",
  props: {
    type: {
      type: String, //  auto | lock
      default: "",
    },
    config: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show: true,
      isChangeNum: false,
      autoBuyAmount: 0, //自动购买金额
      autoBuyTime: 0, //几秒入局
      lockMaxAmount: 0, //最大投注
      lockWinRate: 1, //胜率
      lowBounsPool: 0, //最低奖池

      autoConfig: {
        autoBuyAmount: 0, //自动购买金额
        autoBuyNumber: 10, //自动局数
        autoBuyStatus: "CLOSE", //自动状态：OPEN,CLOSE
        autoBuyTime: 0, //几秒入局
        lockMaxAmount: 0, //最大投注
        lockWinRate: 1, //胜率
        lockWinRateStatus: "CLOSE", //锁定状态：OPEN, CLOSE, AUTO
        lowBounsPool: 0, //最低奖池
      },
      autoChoose: 1,
      customize: null,

      timer: null,
      numTimer: null,
    };
  },
  computed: {
    usdBalance() {
      const headerStore = useHeaderStore();
      return headerStore.usdBalance;
    },
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    // 结束数值
    endNum() {
      const { usdBalance } = this;
      const num = new bigNumber(usdBalance).div(10);
      return Math.floor(Number(num));
    },
    // 每段数值
    stepNum() {
      const { endNum } = this;
      const num = new bigNumber(endNum).div(100);
      return Number(num);
    },
    // 余额开始数值
    balanceStartNum() {
      const { usdBalance } = this;
      const num = new bigNumber(usdBalance).div(100);
      return Number(num);
    },
  },
  methods: {
    bigNumber: bigNumber,
    accurateDecimal: accurateDecimal,
    // 获取自动配置
    async fetchAutoConfig() {
      const res = await getAutoConfig();
      if (res.code == 200) {
        const rate = deepClone(res.data);

        const winRate = Number(
          new bigNumber(rate?.lockWinRate || 0).multipliedBy(100),
        );

        const params = {
          ...deepClone(this.autoConfig),
          ...deepClone(res.data),
          lockWinRate: winRate,
        };

        if (!rate?.autoBuyNumber) {
          this.autoChoose = 1;
          params.autoBuyNumber = 10;
        } else if (rate?.autoBuyNumber == 10) {
          this.autoChoose = 1;
        } else if (rate?.autoBuyNumber == 20) {
          this.autoChoose = 2;
        } else if (rate?.autoBuyNumber == 50) {
          this.autoChoose = 3;
        } else if (rate?.autoBuyNumber == 100) {
          this.autoChoose = 4;
        } else {
          this.autoChoose = 5;
          this.customize = rate?.autoBuyNumber;
        }

        params.autoBuyNumber = rate?.autoBuyNumber;

        if (this.type == "lock" && params.lockWinRateStatus == "CLOSE") {
          params.lockWinRateStatus = "OPEN";
        }
        this.autoConfig = params;
      }
    },
    // 选择自动局数
    chooseAutoRound(type, num) {
      this.autoChoose = type;
      if (type != 5) {
        this.autoConfig.autoBuyNumber = num;
      }
    },
    // 选择锁定类型
    chooseLock(type) {
      this.autoConfig.lockWinRateStatus = type;
    },
    async submitData() {
      const { type, autoConfig } = this;

      if (type == "auto" && !autoConfig.autoBuyNumber) {
        this.$message.error(this.$t("tokenWar.lockErrorTips"));
        return;
      }

      let res = null;
      let params = autoConfig;

      if (type == "auto") {
        params.autoBuyStatus = "OPEN";
      }

      const rate = deepClone(autoConfig);

      params.lockWinRate = Number(
        new bigNumber(rate.lockWinRate).dividedBy(100),
      );

      // 删除剩余局数
      delete params.autoActualNumber;

      res = await setAutoConfig({
        ...params,
      });

      if (res.code == 200) {
        this.handleClose();
      }
    },
    changeNum() {
      this.isChangeNum = false;
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialogFun", this.type);
    },
  },
  created() {
    this.fetchAutoConfig();
  },
  watch: {
    customize(newV) {
      const { autoChoose } = this;

      if (autoChoose == 5) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        this.autoConfig.autoBuyNumber = Math.floor(newV);

        if (!newV) return;
        this.timer = setTimeout(() => {
          this.customize = newV <= 1000 ? Math.floor(newV) : 1000;
        }, 300);
      }
    },
    // 滑块
    autoBuyAmount: function (newV) {
      if (this.isChangeNum) return;

      this.autoConfig.autoBuyAmount = Math.floor(newV);
      this.$forceUpdate();
    },
    "autoConfig.autoBuyAmount": function (newV) {
      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      if (!newV) return;
      if (!this.isChangeNum) return;

      const { endNum } = this;

      if (newV >= endNum) {
        this.autoBuyAmount = endNum;
      } else {
        this.autoBuyAmount = newV > 0 ? Math.floor(newV) : 0;
      }

      if (!newV) return;

      this.$forceUpdate();
      this.numTimer = setTimeout(() => {
        this.autoConfig.autoBuyAmount = newV > 0 ? Math.floor(newV) : 0;
      }, 300);
    },
    // 滑块
    autoBuyTime: function (newV) {
      if (this.isChangeNum) return;

      this.autoConfig.autoBuyTime = Math.floor(newV);
      this.$forceUpdate();
    },
    "autoConfig.autoBuyTime": function (newV) {
      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      if (newV >= 100) {
        this.autoBuyTime = 100;
      } else {
        this.autoBuyTime = newV > 0 ? Math.floor(newV) : 0;
      }

      if (!newV) return;

      this.$forceUpdate();
      this.numTimer = setTimeout(() => {
        this.autoConfig.autoBuyTime = newV > 0 ? Math.floor(newV) : 0;
      }, 300);
    },
    // 滑块
    lowBounsPool: function (newV) {
      if (this.isChangeNum) return;

      this.autoConfig.lowBounsPool = Math.floor(newV);
      this.$forceUpdate();
    },
    "autoConfig.lowBounsPool": function (newV) {
      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      const { endNum } = this;

      if (newV >= endNum) {
        this.lowBounsPool = endNum;
      } else {
        this.lowBounsPool = newV > 0 ? Math.floor(newV) : 0;
      }

      if (!newV) return;

      this.$forceUpdate();
      this.numTimer = setTimeout(() => {
        this.autoConfig.lowBounsPool = newV > 0 ? Math.floor(newV) : 0;
      }, 300);
    },
    // 滑块
    lockWinRate: function (newV) {
      if (this.isChangeNum) return;

      this.autoConfig.lockWinRate = Math.floor(newV);
      this.$forceUpdate();
    },
    "autoConfig.lockWinRate": function (newV) {
      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      if (newV >= 100) {
        this.lockWinRate = 100;
      } else {
        this.lockWinRate = newV > 0 ? Math.floor(newV) : 0;
      }

      if (!newV) return;

      this.$forceUpdate();
      this.numTimer = setTimeout(() => {
        if (newV > 100) {
          this.autoConfig.lockWinRate = 100;
        } else {
          this.autoConfig.lockWinRate = newV > 0 ? Math.floor(newV) : 0;
        }
      }, 300);
    },
    // 滑块
    lockMaxAmount: function (newV) {
      if (this.isChangeNum) return;

      this.autoConfig.lockMaxAmount = Math.floor(newV);
      this.$forceUpdate();
    },
    "autoConfig.lockMaxAmount": function (newV) {
      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      const { usdBalance } = this;

      if (newV >= usdBalance) {
        this.lockMaxAmount = usdBalance;
      } else {
        this.lockMaxAmount = newV > 0 ? Math.floor(newV) : 0;
      }

      if (!newV) return;

      this.numTimer = setTimeout(() => {
        this.autoConfig.lockMaxAmount = newV > 0 ? Math.floor(newV) : 0;
      }, 300);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/warConfig.scss";
</style>
<style lang="scss">
.tips_box {
  width: 24.125rem;
  padding: 0.75rem !important;
  border-radius: 0.5rem;
  background-color: #101828 !important;
  box-sizing: border-box;

  & > spen {
    font-family: "Inter";
    font-size: 0.75rem;
    line-height: 1.5;
    text-align: left;
    color: #a9a4b4;
  }

  .el-popper__arrow::before {
    background-color: #101828 !important;
  }
}

@media screen and (max-width: 950px) {
  .tips_box {
    width: auto;
    max-width: 90%;
  }
}
</style>
