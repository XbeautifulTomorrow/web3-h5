<template>
  <div>
    <div class="buy_panel">
      <div :class="['user_usd_box', screenWidth <= 950 ? 'panel_bg' : '']">
        <p class="buy_title">{{ $t("tokenWar.dispatchSoldiers") }}</p>
        <div class="user_usd_balance">
          <div class="title">{{ $t("tokenWar.yourBalance") }}</div>
          <div class="val">
            <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            <span>
              {{ formatUsd(usdBalance) }}
            </span>
          </div>
        </div>
        <div class="buy_input_box">
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
                <span>{{ $t("tokenWar.addText") }}</span>
              </div>
            </template>
          </el-input>
          <div class="config_box" v-if="screenWidth <= 950">
            <div class="auto_config">
              <img
                v-if="autoConfig.autoBuyStatus == 'CLOSE'"
                @click="changeAuto()"
                src="@/assets/svg/home/warGame/bg/config_auto.svg"
                alt=""
              />
              <div class="auto" @click="changeAuto()" v-else>
                <div class="auto_num">{{ autoConfig?.autoActualNumber }}</div>
                <div class="aotu_val">
                  <span>{{ formatUsd(autoConfig?.autoBuyAmount) }}</span>
                  <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                </div>
              </div>
            </div>
            <div class="lock_config">
              <img
                v-if="autoConfig.lockWinRateStatus == 'CLOSE'"
                @click="changeLock(2)"
                src="@/assets/svg/home/warGame/bg/config_lock.svg"
                alt=""
              />
              <div @click="changeLock(2)" v-else class="lock">
                <span
                  class="status"
                  v-if="autoConfig.lockWinRateStatus == 'CLOSE'"
                >
                  {{ $t("tokenWar.close") }}
                </span>
                <span
                  class="status"
                  v-else-if="autoConfig.lockWinRateStatus == 'OPEN'"
                >
                  {{ $t("tokenWar.open") }}
                </span>
                <span class="status" v-else>{{ $t("tokenWar.auto") }}</span>
                <span class="rate">
                  {{
                    accurateDecimal(
                      new bigNumber(autoConfig?.lockWinRate || 0).multipliedBy(
                        100
                      ),
                      2
                    )
                  }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="input_error"></div>
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
          <span>{{ $t("tokenWar.autoWar") }}</span>
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
            <div class="title">{{ $t("tokenWar.remainingNum") }}</div>
            <div class="val">{{ autoConfig?.autoActualNumber || "--" }}</div>
          </div>
          <div class="auto_item">
            <div class="title">{{ $t("tokenWar.singleInvest") }}</div>
            <div class="val" v-if="autoConfig?.autoBuyAmount">
              <span>
                {{ formatUsd(autoConfig?.autoBuyAmount) }}
              </span>
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            </div>
            <div class="val" v-else>--</div>
          </div>
          <div class="auto_item">
            <div class="title">{{ $t("tokenWar.joinOpportunity") }}</div>
            <div class="val">
              <span
                class="last"
                v-html="
                  $t('tokenWar.lastNumSec', {
                    num: `<span style='${customizeStyle}'>${autoConfig?.autoBuyTime}</span>`,
                  })
                "
              ></span>
            </div>
          </div>
          <div class="auto_item">
            <div class="title">{{ $t("tokenWar.minLoot") }}</div>
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
          <span>{{ $t("tokenWar.lockWinRate") }}</span>
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
              <span v-if="autoConfig.lockWinRateStatus == 'CLOSE'">
                {{ $t("tokenWar.close") }}
              </span>
              <span v-else-if="autoConfig.lockWinRateStatus == 'OPEN'">
                {{ $t("tokenWar.open") }}
              </span>
              <span v-else>{{ $t("tokenWar.auto") }}</span>
            </div>
            <div class="btns">
              <div class="btn_left" @click="changeLock(2)"></div>
              <div class="btn_center" @click="changeLock(2)"></div>
              <div class="btn_right" @click="changeLock(3)"></div>
            </div>
          </div>
        </div>
        <div v-if="autoConfig.lockWinRateStatus != 'CLOSE'">
          <div class="auto_item">
            <div class="title">{{ $t("tokenWar.targetWinRate") }}</div>
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
            <div class="title">{{ $t("tokenWar.maxInvest") }}</div>
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
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import {
  accurateDecimal,
  formatUsd,
  handleWindowResize,
  deepClone,
} from "@/utils";
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
    warInfo: {
      type: Object,
      default: null,
    },
    userData: {
      type: Object,
      default: null,
    },
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
      customizeStyle: null,
      screenWidth: null,
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
    /**
     * @description 最高参与金额用户
     */
    maxBonus() {
      const { joinDataList } = this.warInfo;

      if (!joinDataList || !joinDataList.length > 0) return null;
      let wars = deepClone(joinDataList);

      for (var i = 0; i < wars.length - 1; i++) {
        for (var j = 0; j < wars.length - 1 - i; j++) {
          if (Number(wars[j].buyPrice) > Number(wars[j + 1].buyPrice)) {
            var temp = wars[j];
            wars[j] = wars[j + 1];
            wars[j + 1] = temp;
          }
        }
      }

      return wars[wars.length - 1];
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
      if (!this.userInfo?.id || !this.isLogin) {
        this.$emit("showLogin");
        return;
      }

      if (this.status != "INIT") return;

      const {
        buyNum,
        usdBalance,
        systemConfig: { singlePrice },
        maxBonus,
        userInfo,
        userData,
      } = this;

      // 血战到底购买提示
      const { bigPrizeStatus, joinDataList } = this.warInfo;

      if (bigPrizeStatus == "TRUE") {
        if (joinDataList.findIndex((e) => e.userId == userInfo?.id) > -1) {
          const maxNum = Number(
            new bigNumber(maxBonus.buyPrice).minus(userData?.buyPrice || 0)
          );

          if (maxBonus.userId != userInfo?.id && maxNum > Number(buyNum)) {
            this.$message.error(t("tokenWar.buyTips", { num: maxNum }));
            return;
          }
        }
      }

      if (Number(buyNum) > Number(usdBalance)) {
        this.$message.error(t("lottery.tips5"));
        return;
      }

      if (!Number(buyNum || 0) || !Number(buyNum || 0) > 0) {
        this.$message.error(t("tokenWar.numErrorTips", { num: singlePrice }));
        return;
      }

      const res = await warBuy({ buyPrice: buyNum });
      if (res.code == 200) {
        this.getTheUserBalanceInfo();
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
      if (!this.userInfo?.id || !this.isLogin) {
        this.$emit("showLogin");
        return;
      }

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
          this.fetchAutoConfig();
        }
      }
    },
    // 锁定胜率设置
    async changeLock(event) {
      if (!this.userInfo?.id || !this.isLogin) {
        this.$emit("showLogin");
        return;
      }

      if (event == 1) {
        if (this.autoConfig.lockWinRateStatus == "CLOSE") return;
        // 关闭
        const res = await setAutoConfig({
          ...this.autoConfig,
          lockWinRateStatus: "CLOSE",
        });

        if (res.code == 200) {
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

    this.customizeStyle =
      "-webkit-text-fill-color: transparent;font-weight: bold;";
  },
  mounted() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
  },
  watch: {
    config(newV) {
      if (!newV) return;
      if (this.userInfo?.id && this.isLogin) {
        this.fetchAutoConfig();
      }
    },
    status(newV) {
      if (newV == "INIT") {
        if (this.userInfo?.id && this.isLogin) {
          this.fetchAutoConfig();
        }
      }
    },
    isLogin() {
      if (this.userInfo?.id && this.isLogin) {
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
