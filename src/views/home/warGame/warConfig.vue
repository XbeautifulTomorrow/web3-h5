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
          <span>自动参战</span>
          <el-tooltip
            popper-class="tips_box"
            effect="dark"
            content="开启此选项后，如果您尚未加入本局游戏，同时本局战利品大于最低战利品，且剩余时间少于设置的时间时，您将会自动投入相应的兵力以加入游戏。"
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
              placeholder="自定义"
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
                v-model.number="autoConfig.autoBuyAmount"
                :min="startNum"
                :max="endNum"
                :step="stepNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              v-model.number="autoConfig.autoBuyAmount"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">投入兵力</div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="autoConfig.autoBuyTime"
                :min="1"
                :max="100"
                :step="1"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num time"
              type="number"
              v-model.number="autoConfig.autoBuyTime"
              placeholder=""
            >
              <template #append>
                <div class="time_box">秒</div>
              </template>
            </el-input>
          </div>
          <div class="config_title">入场时机</div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="autoConfig.lowBounsPool"
                :min="startNum"
                :max="endNum"
                :step="stepNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              v-model.number="autoConfig.lowBounsPool"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">最低战利品</div>
        </div>
        <div class="config_btns">
          <div class="btn_cancel" @click="handleClose()">CANCEL</div>
          <div class="btn_confirm" @click="submitData()">OK</div>
        </div>
      </div>
      <div class="public-dialog-content form-content" v-if="type == 'lock'">
        <p class="buy_title">
          <span>锁定胜率</span>
          <el-tooltip
            popper-class="tips_box"
            effect="dark"
            content="开启此选项后，如果您参与了本局游戏，那么当您的胜率低于目标胜率时，会自动增加兵力以保证胜率与目标胜率一致，直到投入金额达到最大兵力为止。开启自动后，每一局都将自动开启锁定胜率。"
          >
            <img src="@/assets/svg/home/warGame/icon_help.svg" alt="" />
          </el-tooltip>
        </p>
        <div class="lock_status">
          <div class="status_title">锁定开关</div>
          <div class="rounds_num">
            <div
              :class="[
                'rounds_item',
                autoConfig.lockWinRateStatus == 'OPEN' ? 'active' : '',
              ]"
              @click="chooseLock('OPEN')"
            >
              仅一次
            </div>
            <div
              :class="[
                'rounds_item',
                autoConfig.lockWinRateStatus == 'AUTO' ? 'active' : '',
              ]"
              @click="chooseLock('AUTO')"
            >
              自动
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
                v-model.number="autoConfig.lockWinRate"
                :min="1"
                :max="100"
                :step="1"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num time"
              type="number"
              v-model.number="autoConfig.lockWinRate"
              placeholder=""
            >
              <template #append>
                <div class="time_box">%</div>
              </template>
            </el-input>
          </div>
          <div class="config_title">目标胜率</div>
          <div class="config_item">
            <div class="config_slider_box">
              <div class="slider_bar">
                <div></div>
                <div></div>
              </div>
              <el-slider
                class="config_slider"
                v-model.number="autoConfig.lockMaxAmount"
                :min="balanceStartNum"
                :max="usdBalance"
                :step="balanceStartNum"
                :show-tooltip="false"
              />
            </div>
            <el-input
              class="config_num"
              type="number"
              v-model.number="autoConfig.lockMaxAmount"
              placeholder=""
            >
              <template #append>
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              </template>
            </el-input>
          </div>
          <div class="config_title">最大投入兵力</div>
        </div>
        <div class="config_btns">
          <div class="btn_cancel" @click="handleClose()">CANCEL</div>
          <div class="btn_confirm" @click="submitData()">OK</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapStores } from "pinia";
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
      autoConfig: {
        autoBuyAmount: 0, //自动购买金额
        autoBuyNumber: 0, //自动局数
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
    ...mapStores(useUserStore, useHeaderStore),
    usdBalance() {
      const headerStore = useHeaderStore();
      return headerStore.usdBalance;
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin;
    },
    // 开始数值
    startNum() {
      const { usdBalance } = this;
      const num = new bigNumber(usdBalance).div(1000);
      return Math.floor(Number(num));
    },
    // 结束数值
    endNum() {
      const { usdBalance } = this;
      const num = new bigNumber(usdBalance).div(10);
      return Math.floor(Number(num));
    },
    // 每段数值
    stepNum() {
      const { startNum, endNum } = this;
      const num = new bigNumber(startNum).minus(endNum).div(100);
      return Number(num);
    },
    // 余额开始数值
    balanceStartNum() {
      const { usdBalance } = this;
      const num = new bigNumber(usdBalance).div(100);
      return Math.floor(Number(num));
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
          new bigNumber(rate?.lockWinRate || 0).multipliedBy(100)
        );

        const params = {
          ...deepClone(this.autoConfig),
          ...deepClone(res.data),
          lockWinRate: winRate,
        };
        this.autoConfig = params;
        if (
          this.type == "lock" &&
          this.autoConfig.lockWinRateStatus == "CLOSE"
        ) {
          this.autoConfig.lockWinRateStatus = "OPEN";
        }
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

      let res = null;
      let params = autoConfig;

      if (type == "auto") {
        params.autoBuyStatus = "OPEN";
      }

      const rate = deepClone(autoConfig);

      params.lockWinRate = Number(
        new bigNumber(rate.lockWinRate).dividedBy(100)
      );

      res = await setAutoConfig({
        ...params,
      });

      if (res.code == 200) {
        this.$message.success("Operation successfully!");
        this.handleClose();
      }
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

      if (!newV) return;

      if (autoChoose == 5) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        this.timer = setTimeout(() => {
          this.customize = Math.floor(newV);
          this.autoConfig.autoBuyNumber = Math.floor(newV);
        }, 300);
      }
    },
    "autoConfig.autoBuyAmount": function (newV) {
      if (!newV) return;

      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      this.numTimer = setTimeout(() => {
        this.autoConfig.autoBuyAmount = Math.floor(newV);
      }, 300);
    },
    "autoConfig.autoBuyTime": function (newV) {
      if (!newV) return;

      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      this.numTimer = setTimeout(() => {
        this.autoConfig.autoBuyTime = Math.floor(newV);
      }, 300);
    },
    "autoConfig.lowBounsPool": function (newV) {
      if (!newV) return;

      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      this.numTimer = setTimeout(() => {
        this.autoConfig.lowBounsPool = Math.floor(newV);
      }, 300);
    },
    "autoConfig.lockWinRate": function (newV) {
      if (!newV) return;

      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      this.numTimer = setTimeout(() => {
        this.autoConfig.lockWinRate = Math.floor(newV);
      }, 300);
    },
    "autoConfig.lockMaxAmount": function (newV) {
      if (!newV) return;

      if (this.numTimer) {
        clearTimeout(this.numTimer);
        this.numTimer = null;
      }

      this.numTimer = setTimeout(() => {
        this.autoConfig.lockMaxAmount = Math.floor(newV);
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
