<template>
  <div>
    <div class="buy_panel">
      <p class="buy_title">Dispatch Soldiers</p>
      <div class="user_usd_balance">
        <div class="title">Your Balance:</div>
        <div class="val">
          <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
          <span>
            {{ formatUsd(usdBalance) }}
          </span>
        </div>
      </div>
      <el-input
        class="buy_input"
        type="number"
        v-model.number="buyNum"
        placeholder=""
      >
        <template #append>
          <div
            :class="['add_btn', status != 'INIT' ? 'disabled' : '']"
            @click="buyTickets()"
          >
            <img
              class="not-select"
              src="@/assets/svg/home/warGame/icon_add.svg"
              alt=""
            />
            <span>ADD</span>
          </div>
        </template>
      </el-input>
      <div class="input_error"></div>
      <div class="choose_box">
        <div class="choose_tips">1 Soldier = 1 USDT</div>
        <div class="choose_items">
          <div class="choose_btn" @click="setAmount(1)">
            <span>+1</span>
          </div>
          <div class="choose_btn" @click="setAmount(10)">
            <span>+10</span>
          </div>
          <div class="choose_btn" @click="setAmount(100)">
            <span>+100</span>
          </div>
          <div class="choose_btn" @click="setAmount(1000)">
            <span>+1000</span>
          </div>
        </div>
      </div>
      <div class="auto_war_box">
        <div class="tips_text">
          <span>自动参战</span>
          <div class="auto_btn">
            <el-switch
              v-model="autoConfig.autoBuyStatus"
              active-value="OPEN"
              inactive-value="CLOSE"
              style="
                --el-switch-on-color: #927a51;
                --el-switch-off-color: rgba(60, 60, 67, 0.8);
              "
            />
            <div class="btn" @click="changeAuto()"></div>
          </div>
        </div>
        <div v-if="autoConfig.autoBuyStatus != 'CLOSE'">
          <div class="auto_item">
            <div class="title">剩余局数</div>
            <div class="val">{{ autoConfig?.autoActualNumber || "--" }}</div>
          </div>
          <div class="auto_item">
            <div class="title">单局投入</div>
            <div class="val" v-if="autoConfig?.autoBuyAmount">
              <span>
                {{ formatUsd(autoConfig?.autoBuyAmount) }}
              </span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
            <div class="val" v-else>--</div>
          </div>
          <div class="auto_item">
            <div class="title">入场时机</div>
            <div class="val">
              <span
                style="
                  color: #a9a4b4;
                  -webkit-text-fill-color: #a9a4b4;
                  font-weight: 400;
                "
                >Last
                <span
                  style="
                    color: white;
                    -webkit-text-fill-color: transparent;
                    font-weight: bold;
                  "
                  >{{ autoConfig?.autoBuyTime }}</span
                >
                sec</span
              >
            </div>
          </div>
          <div class="auto_item">
            <div class="title">最低战利品</div>
            <div class="val">
              <span>
                {{ formatUsd(autoConfig?.lowBounsPool) }}
              </span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="lock_winning_box">
        <div class="tips_text">
          <span>锁定胜率</span>
          <div class="lock_switch">
            <div
              :class="[
                'switch_btn',
                autoConfig.lockWinRateStatus == 'OPEN'
                  ? 'open'
                  : autoConfig.lockWinRateStatus == 'AUTO'
                  ? 'auto'
                  : 'close',
              ]"
            >
              <span v-if="autoConfig.lockWinRateStatus == 'CLOSE'">关</span>
              <span v-else-if="autoConfig.lockWinRateStatus == 'OPEN'">开</span>
              <span v-else>自动</span>
            </div>
            <div class="btns">
              <div class="btn_left" @click="changeLock(1)"></div>
              <div class="btn_center" @click="changeLock(2)"></div>
              <div class="btn_right" @click="changeLock(3)"></div>
            </div>
          </div>
        </div>
        <div v-if="autoConfig.lockWinRateStatus != 'CLOSE'">
          <div class="auto_item">
            <div class="title">目标胜率</div>
            <div class="val" v-if="autoConfig?.lockWinRate">
              {{
                accurateDecimal(
                  new bigNumber(autoConfig?.lockWinRate || 0).multipliedBy(100),
                  2
                )
              }}%
            </div>
            <div class="val" v-else>--</div>
          </div>
          <div class="auto_item">
            <div class="title">最大投入兵力</div>
            <div class="val" v-if="autoConfig?.lockMaxAmount">
              <span>
                {{ autoConfig?.lockMaxAmount }}
              </span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
            <div class="val" v-else>--</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import { accurateDecimal, formatUsd } from "@/utils";
import {
  warBuy,
  getAutoConfig,
  setAutoConfig,
  getConfig,
} from "@/services/api/tokenWar";
import bigNumber from "bignumber.js";
import { i18n } from "@/locales";
const { t } = i18n.global;

export default {
  name: "WarBuy",
  props: {
    config: {
      type: String,
      default: "",
    },
    status: {
      type: String, // INIT / WAIT / CANCEL / WIN
      default: "",
    },
  },
  data() {
    return {
      buyNum: null,
      autoConfig: {
        autoBuyAmount: 0, //自动购买金额
        autoBuyNumber: 0, //自动局数
        autoBuyStatus: "CLOSE", //自动状态：OPEN,CLOSE
        autoBuyTime: 0, //几秒入局
        lockMaxAmount: 0, //最大投注
        lockWinRate: 0, //胜率
        lockWinRateStatus: "CLOSE", //锁定状态：OPEN,CLOSE,AUTO
        lowBounsPool: 0, //最低奖池
      },
      autoChoose: 1,
      customize: 0,
      timer: null,
      systemConfig: null,
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
  },
  methods: {
    formatUsd: formatUsd,
    bigNumber: bigNumber,
    accurateDecimal: accurateDecimal,
    // 更新购买数据
    setAmount(event) {
      this.buyNum = Number(this.buyNum) + Number(event);
    },
    // 购买战争游戏门票
    async buyTickets() {
      const {
        buyNum,
        usdBalance,
        systemConfig: { singlePrice },
      } = this;

      if (this.status != "INIT") return;

      if (Number(buyNum) > Number(usdBalance)) {
        this.$message.error(t("lottery.tips5"));
        return;
      }

      if (!Number(buyNum || 0) || !Number(buyNum || 0) > 0) {
        this.$message.error(
          `The amount added must be greater than ${singlePrice} USDT.`
        );
        return;
      }

      const res = await warBuy({ buyPrice: buyNum });
      if (res.code == 200) {
        this.getTheUserBalanceInfo();
        this.$message.success("Operation successfully!");
        this.buyNum = null;
      }
    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      headerStore.fetchTheUserPoint();
      headerStore.fetchGlobalNew();
    },
    // 获取自动配置
    async fetchAutoConfig() {
      const res = await getAutoConfig();
      if (res.code == 200) {
        this.autoConfig = {
          ...this.autoConfig,
          ...res.data,
        };
      }
    },
    // 自动战争设置
    async changeAuto() {
      const {
        autoConfig: { autoBuyStatus },
      } = this;

      if (autoBuyStatus == "CLOSE") {
        this.$emit("showDialogFun", "auto");
      } else {
        // 关闭
        const res = await setAutoConfig({
          ...this.autoConfig,
          autoBuyStatus: "CLOSE",
        });

        if (res.code == 200) {
          this.$message.success("Operation successfully!");
          this.fetchAutoConfig();
        }
      }
    },
    // 锁定胜率设置
    async changeLock(event) {
      if (event == 1) {
        if (this.autoConfig.lockWinRateStatus == "CLOSE") return;
        // 关闭
        const res = await setAutoConfig({
          ...this.autoConfig,
          lockWinRateStatus: "CLOSE",
        });

        if (res.code == 200) {
          this.$message.success("Operation successfully!");
          this.fetchAutoConfig();
        }
      } else {
        this.$emit("showDialogFun", "lock");
      }
    },
    // 获取配置
    async fetchConfig() {
      const res = await getConfig();
      if (res.code == 200) {
        this.systemConfig = res.data;
      }
    },
  },
  created() {
    if (this.userInfo?.id && this.isLogin) {
      this.fetchAutoConfig();
    }

    this.fetchConfig();
  },
  watch: {
    config(newV) {
      if (!newV) return;
      this.fetchAutoConfig();
    },
    status(newV) {
      if (newV == "INIT") {
        this.fetchAutoConfig();
      }
    },
    buyNum(newV) {
      if (!newV) return;

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        const { singlePrice } = this.systemConfig;
        if (Number(newV) % singlePrice > 1) {
          this.buyNum = Math.floor(Number(newV) - (Number(newV) % singlePrice));
          return;
        }
        this.buyNum = Math.floor(newV);
      }, 300);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/warBuy.scss";
</style>
