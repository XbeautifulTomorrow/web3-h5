<template>
  <div class="war_game_wrapper">
    <div class="war_game_panel">
      <div class="bloody_battle">
        <img src="@/assets/svg/home/warGame/bg/heading_bg.svg" alt="" />
        <div class="bloody_battle_box">
          <div class="war_title">{{ $t("tokenWar.endWar") }}</div>
          <div class="total_bonus">
            <div class="unit">$</div>
            <div class="val">{{ formatUsd(warInfo?.totalBigPrize) }}</div>
          </div>
        </div>
      </div>
      <div class="war_game_user panel_bg">
        <div class="basic_info">
          <div class="user_num">
            {{ $t("tokenWar.playersNum", { num: warData.length }) }}
          </div>
          <div class="watcher_num">
            <img src="@/assets/svg/home/warGame/icon_watching.svg" alt="" />
            <span>{{ $t("tokenWar.watcher", { num: watcherNum }) }}</span>
          </div>
        </div>
        <div :class="['user_list_box', showTooltips ? 'active' : '']">
          <c-scrollbar
            class="choose_nft"
            width="100%"
            trigger="hover"
            :vBarStyle="{ 'background-color': 'rgb(29, 15, 54, 1)' }"
            :vThumbStyle="{ 'background-color': 'rgb(109, 101, 130, 1)' }"
            :height="screenWidth > 950 ? '35.75rem' : '19rem'"
          >
            <div
              :class="[
                'user_item',
                tooltips?.userId == item.userId ? 'hover' : '',
              ]"
              v-for="(item, index) in warData"
              @click="showWarUser(item)"
              :key="index"
            >
              <div class="user_badge">
                <img :src="getRank(item.buyPrice)" alt="" />
              </div>
              <div class="user_info">
                <div class="info_box">
                  <div class="avatar">
                    <img
                      class="avatar_img"
                      src="@/assets/svg/user/default_avatar.svg"
                      alt=""
                    />
                    <div class="buy_info">
                      <div class="user_name">{{ item.userName || "--" }}</div>
                      <div class="buy">
                        <img
                          src="@/assets/svg/user/icon_usdt_gold.svg"
                          alt=""
                        />
                        <span>{{ item.buyPrice }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="tickets_box">
                    <span class="ratio">
                      {{ getWinningRate(item.buyPrice) }}%
                    </span>
                    <span class="reward_id">
                      {{
                        $t("tokenWar.rewardId", {
                          start: item.startNumber,
                          end: item.endNumber,
                        })
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </c-scrollbar>
        </div>
      </div>
      <div class="lottery_panel panel_bg">
        <div class="prize_pool">
          <div class="round">
            <div class="round_title">{{ $t("tokenWar.currentRound") }}</div>
            <div class="round_val">{{ warInfo?.id || "--" }}</div>
          </div>
          <div
            class="history_btn"
            @click="
              () => {
                $emit('toHistory');
              }
            "
          >
            <img src="@/assets/svg/home/warGame/icon_history.svg" alt="" />
            <span v-if="screenWidth > 950">{{ $t("tokenWar.history") }}</span>
          </div>
        </div>
        <div class="war_game_box">
          <svg id="war_container" width="450" height="450"></svg>
          <div
            class="outer_ring"
            :style="{
              pointerEvents: currentStatus == 'WAIT' ? 'auto' : 'none',
            }"
            v-if="currentStatus == 'WAIT' || currentStatus == 'WIN'"
          ></div>
          <div
            class="win_pointer"
            v-if="currentStatus == 'WAIT' || currentStatus == 'WIN'"
          ></div>
          <div class="round_prize">
            <div class="round_num" v-if="currentStatus != 'WIN'">
              {{ $t("tokenWar.roundId", { num: warInfo?.id || "--" }) }}
            </div>
            <div class="win_user" v-else>
              <div class="win_bg">
                <img src="@/assets/svg/user/default_avatar.svg" alt="" />
              </div>
              <span v-if="userInfo?.id == winInfo?.winerUserId">YUO WIN</span>
              <span v-else>{{ winInfo?.winerUserName || "--" }}</span>
            </div>
            <div
              :class="['round_prize_val', currentStatus == 'WIN' ? 'win' : '']"
            >
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span v-if="currentStatus != 'WIN'">
                {{ formatUsd(warInfo?.totalBonus) }}
              </span>
              <span v-else>
                {{
                  $t("tokenWar.win", {
                    income: formatUsd(winInfo?.winerIncome),
                    rate: accurateDecimal(winInfo?.winerMultipleRate || 0, 2),
                  })
                }}
              </span>
            </div>
            <div
              :class="[
                'round_prize_status',
                currentStatus == 'WAIT' ? 'cancel' : '',
              ]"
            >
              <span v-if="currentStatus == 'WAIT'">
                {{ $t("tokenWar.waitHint") }}
              </span>
              <span v-if="currentStatus == 'CANCEL'">
                {{ $t("tokenWar.lostSituation") }}
              </span>
              <span v-if="currentStatus == 'WIN'" class="win_id">
                {{ $t("tokenWar.winnerId", { num: winInfo?.openId || "--" }) }}
              </span>
              <span
                v-if="currentStatus == 'WIN' && !isHistory"
                class="next_round"
              >
                {{
                  $t("tokenWar.nextRound", { time: `00${seconds}`.slice(-2) })
                }}
              </span>
            </div>
          </div>
        </div>
        <div
          :class="[
            'countdown_box',
            currentStatus == 'INIT'
              ? ''
              : currentStatus == 'WAIT'
              ? 'battle'
              : 'next',
          ]"
          v-if="!isHistory"
        >
          <div class="percentage_box">
            <div class="time">
              <img
                v-if="currentStatus == 'INIT'"
                src="@/assets/svg/home/warGame/progress/icon_war.svg"
              />
              <img
                v-else-if="currentStatus == 'WAIT'"
                src="@/assets/svg/home/warGame/progress/icon_battle.svg"
              />
              <img
                v-else
                src="@/assets/svg/home/warGame/progress/icon_next.svg"
              />
            </div>
            <div
              :class="[
                'progress_bar',
                currentStatus == 'INIT'
                  ? 'init'
                  : currentStatus == 'WAIT'
                  ? 'wait'
                  : 'next',
              ]"
            >
              <el-progress
                :percentage="percentage"
                :stroke-width="getRatio().fontSize * 0.75"
                striped
                striped-flow
                :duration="10"
                :color="
                  currentStatus == 'INIT'
                    ? '#fad54d'
                    : currentStatus == 'WAIT'
                    ? '#c72ae9'
                    : '#b3b9c4'
                "
                :show-text="false"
              />
            </div>
          </div>
          <div class="countdown">
            <countDown
              v-if="currentStatus == 'INIT'"
              v-slot="timeObj"
              @onEnd="startLottery()"
              @onCountDown="getPercentage"
              :time="warTime.countdownTime"
            >
              {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}` }}
            </countDown>
            <div v-else-if="currentStatus == 'WAIT'" class="dot">
              <span class="dot-ani"></span>
            </div>
            <div v-else>{{ "00:00:" + `00${seconds}`.slice(-2) }}</div>
          </div>
        </div>
      </div>
      <div class="round_info_panel">
        <div class="round_info panel_bg">
          <div class="round_num">
            {{ $t("tokenWar.roundId", { num: warInfo?.id || "--" }) }}
          </div>
          <div class="info">
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>{{ formatUsd(warInfo?.totalBonus) }}</span>
              </div>
              <div class="info_title">
                {{ $t("tokenWar.winnerBonus") }}
              </div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_players.svg" alt="" />
                <span>{{ warData.length }}</span>
              </div>
              <div class="info_title">
                {{ $t("tokenWar.players") }}
              </div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_troops.svg" alt="" />
                <span>{{ userData?.tickerNumber || 0 }}</span>
              </div>
              <div class="info_title">
                {{ $t("tokenWar.yourSoldiers") }}
              </div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_win.svg" alt="" />
                <span>{{ `${getWinningRate(userData?.buyPrice || 0)}` }}%</span>
              </div>
              <div class="info_title">
                {{ $t("tokenWar.yourWinChance") }}
              </div>
            </div>
          </div>
        </div>
        <div :class="['connect_box', screenWidth > 950 ? 'panel_bg' : '']">
          <div class="not_connect" v-if="isHistory">
            <div class="enter_war" @click="handleBack()">
              {{ $t("tokenWar.backText") }}
            </div>
          </div>
          <war-buy
            v-else
            :status="currentStatus"
            @showDialogFun="handlePopups"
            @showLogin="pageType = 'login'"
            :config="cahngeConfig"
            :warInfo="warInfo"
            :userData="userData"
          ></war-buy>
        </div>
      </div>
      <div class="faq_btn" @click="showFAQ()" v-if="screenWidth <= 950">
        <img src="@/assets/svg/home/warGame/button/icon_help.svg" alt="" />
        <span>How Does It Work?</span>
      </div>
    </div>
    <div class="introduce_panel" v-if="screenWidth > 950 || isFAQ">
      <div class="introduce_bg">
        <div class="introduce_box">
          <div class="introduce_title">
            <span>{{ $t("tokenWar.illustrateTitle") }}</span>
            <img
              v-if="screenWidth <= 950"
              class="back_btn"
              src="@/assets/svg/home/warGame/icon_back.svg"
              alt=""
              @click="isFAQ = false"
            />
          </div>
          <img
            class="introduce_divider"
            src="@/assets/svg/home/warGame/bg/introduce_divider.svg"
            alt=""
          />
          <div class="introduce_description">
            <p>{{ $t("tokenWar.illustrateText1") }}</p>
            <p>{{ $t("tokenWar.illustrateText2") }}</p>
            <p>{{ $t("tokenWar.illustrateText3") }}</p>
            <p>{{ $t("tokenWar.illustrateText4") }}</p>
          </div>
          <div class="step_box">
            <div class="step_arrow" v-if="screenWidth > 950">
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
            </div>
            <div class="step_item">
              <div class="step_img img_1">
                <img src="@/assets/svg/home/warGame/icon_connect.svg" alt="" />
              </div>
              <div class="round">01</div>
              <div class="description">{{ $t("tokenWar.stepText1") }}</div>
            </div>
            <img
              v-if="screenWidth <= 950"
              class="step_arrow_img"
              src="@/assets/svg/home/warGame/icon_arrow.svg"
              alt=""
            />
            <div class="step_item">
              <div class="step_img img_2">
                <img src="@/assets/svg/home/warGame/icon_share.svg" alt="" />
              </div>
              <div class="round">02</div>
              <div class="description">{{ $t("tokenWar.stepText2") }}</div>
            </div>
            <img
              v-if="screenWidth <= 950"
              class="step_arrow_img"
              src="@/assets/svg/home/warGame/icon_arrow.svg"
              alt=""
            />
            <div class="step_item">
              <div class="step_img img_3">
                <img
                  src="@/assets/svg/home/warGame/icon_invite_users.svg"
                  alt=""
                />
              </div>
              <div class="round">03</div>
              <div class="description">{{ $t("tokenWar.stepText3") }}</div>
            </div>
            <img
              v-if="screenWidth <= 950"
              class="step_arrow_img"
              src="@/assets/svg/home/warGame/icon_arrow.svg"
              alt=""
            />
            <div class="step_item">
              <div class="step_img img_4">
                <img
                  src="@/assets/svg/home/warGame/icon_calculate.svg"
                  alt=""
                />
              </div>
              <div class="round">04</div>
              <div class="description">{{ $t("tokenWar.stepText4") }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="faq_panel">
        <div class="faq_bg">
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>{{ $t("tokenWar.warConditions") }}</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>{{ $t("tokenWar.warConditionText1") }}</li>
                <li>{{ $t("tokenWar.warConditionText2") }}</li>
                <li>{{ $t("tokenWar.warConditionText3") }}</li>
                <li>{{ $t("tokenWar.warConditionText4") }}</li>
                <li>{{ $t("tokenWar.warConditionText5") }}</li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>{{ $t("tokenWar.results") }}</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>{{ $t("tokenWar.resultText1") }}</li>
                <li>{{ $t("tokenWar.resultText2") }}</li>
                <li>{{ $t("tokenWar.resultText3") }}</li>
                <li>{{ $t("tokenWar.resultText4") }}</li>
                <li>{{ $t("tokenWar.resultText5") }}</li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>{{ $t("tokenWar.endWar") }}</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>{{ $t("tokenWar.endWarText1") }}</li>
                <li>{{ $t("tokenWar.endWarText2") }}</li>
                <li>{{ $t("tokenWar.endWarText3") }}</li>
                <li>{{ $t("tokenWar.endWarText4") }}</li>
                <li>{{ $t("tokenWar.endWarText5") }}</li>
                <li>{{ $t("tokenWar.endWarText6") }}</li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>{{ $t("tokenWar.fairness") }}</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>{{ $t("tokenWar.fairnessText1") }}</li>
                <li>{{ $t("tokenWar.fairnessText2") }}</li>
                <li>{{ $t("tokenWar.fairnessText3") }}</li>
                <li>{{ $t("tokenWar.fairnessText4") }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <war-config
      :type="operationType"
      v-if="operationType"
      @closeDialogFun="handleClose"
    ></war-config>
    <war-must-read
      v-if="pageType == 'must_read'"
      @closeDialogFun="handlePopups"
      @changeTypeFun="changeTypeFun"
    ></war-must-read>
    <war-winning
      :winInfo="winUser"
      :warData="warData"
      :config="config"
      v-if="pageType == 'war_win'"
      @closeReceiveFun="changeTypeFun"
      @closeDialogFun="closeDialogFun"
    ></war-winning>
    <war-user-info
      :id="warUserId"
      v-if="pageType == 'user_info'"
      @closeDialogFun="closeDialogFun"
    ></war-user-info>
    <Login
      v-if="pageType === 'login'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Register
      v-if="pageType === 'register'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Forgot
      v-if="pageType === 'forgot'"
      @closeDialogFun="closeDialogFun"
      @changeTypeFun="changeTypeFun"
    />
    <Modify
      v-if="pageType === 'modify'"
      @onModify="closeDialogFun"
      @closeDialogFun="closeDialogFun"
    ></Modify>
    <Recharge
      v-if="pageType === 'recharge'"
      @closeDialogFun="closeDialogFun"
    ></Recharge>
    <createVerification
      v-if="pageType === 'auth'"
      @closeDialogFun="changeNameFun"
    >
    </createVerification>
    <div class="tooltips_box" :style="style" v-if="showTooltips">
      <div class="tooltip_badge">
        <img :src="getRank(tooltips?.buyPrice)" alt="" />
      </div>
      <div class="war_data_box">
        <div class="box_avatar">
          <div class="user_name">{{ tooltips?.userName || "--" }}</div>
          <span class="ratio"> {{ getWinningRate(tooltips?.buyPrice) }}% </span>
        </div>
        <div class="box_tickets">
          <div class="buy">
            <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
            <span>{{ tooltips?.buyPrice }}</span>
          </div>
          <span class="reward_id">
            {{
              `Reward ID:${tooltips?.startNumber || "-"}-${
                tooltips?.endNumber || ""
              }`
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import config from "@/services/env";
import { getCommonData, getConfig } from "@/services/api/tokenWar";
import * as d3 from "d3";
import {
  accurateDecimal,
  decryptCBC,
  setSessionStore,
  getSessionStore,
  getLocalStore,
  easeIn,
  easeOut,
  handleWindowResize,
  formatUsd,
  deepClone,
} from "@/utils";
import { userColor } from "./components/config";
import bigNumber from "bignumber.js";

import warBuy from "./warBuy.vue";
import warConfig from "./warConfig.vue";
import warMustRead from "./warMustRead.vue";
import warWinning from "./warWinning.vue";
import warUserInfo from "./warUserInfo.vue";
import countDown from "@/components/countDown";
// scrollbar
import { CScrollbar } from "c-scrollbar";

/** LOGIN */
import Login from "@/views/login/index.vue";
import Register from "@/views/register/index.vue";
import Forgot from "@/views/forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Recharge from "@/views/user/recharge.vue";
import createVerification from "@/views/user/createVerification.vue";

export default {
  name: "TokenWar",
  props: {
    warHistory: {
      type: Object,
      default: null,
    },
    isHistory: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    warBuy,
    warConfig,
    countDown,
    warMustRead,
    warWinning,
    warUserInfo,
    CScrollbar,
    Login,
    Register,
    Forgot,
    Modify,
    Recharge,
    createVerification,
  },
  data() {
    return {
      pageType: "", // 登录相关
      currentStatus: "INIT", // INIT / WAIT / CANCEL / WIN
      eventSource: null, // SSE推送对象
      warInfo: null, // 游戏信息
      warData: [], // 下注数据
      userData: {}, // 用户信息
      winInfo: {}, // 中奖信息
      winUser: {}, // 登录用户中奖
      watcherNum: 0, // 观众人数
      isWaiting: false, // 获取开奖状态
      rewardAmount: 0, // 未领取奖励

      percentage: 0, // 倒计时百分比
      warTime: {
        // 倒计时相关
        serverTime: null,
        countdownTime: null,
      },

      // buy
      showBuy: false,
      operationType: "", // auto | lock
      cahngeConfig: "", // auto | lock

      svgGraphics: null, // svg对象
      countdown: 0,
      seconds: 0,
      nextTimer: null,

      // 旋转参数
      startTime: null, // 旋转开始时间
      maxSpeed: 20, // 最大速度
      startHoldTime: 2000, // 加速持续时间
      timeStartPoint: 0, // 时间段的起点
      endHoldTime: 3000, // 减速持续时间
      svgAngle: 0, // 旋转角度
      progress: 0, // 动画循环总次数，用来计算fps
      endTime: null, // 减速开始时间
      endDeg: 0, // 减速角度
      winUserId: null, // 中奖者id
      timer: null,

      //tooltips
      screenWidth: null,
      showTooltips: false,
      tooltips: null,
      style: {},

      //war user
      warUserId: null,
      config: null,

      isFAQ: false,

      rankLevel: {},
      level: {},
      tooltip: {},
    };
  },
  computed: {
    userInfo() {
      const userStore = useUserStore();
      return userStore.userInfo;
    },
    isLogin() {
      const userStore = useUserStore();
      return userStore.isLogin;
    },
    /**
     * @description 用户总计参与金额
     */
    totalBonus() {
      const { warData } = this;
      let bonus = 0;
      for (let i = 0; i < warData.length; i++) {
        bonus += Number(warData[i].buyPrice);
      }
      return bonus;
    },
  },
  methods: {
    formatUsd: formatUsd,
    bigNumber: bigNumber,
    accurateDecimal: accurateDecimal,
    closeDialogFun() {
      this.pageType = "";
      if (this.userInfo?.id && this.isLogin) {
        this.getTheUserBalanceInfo();
      }
    },
    changeNameFun() {
      this.pageType = "modify";
    },
    changeTypeFun(page) {
      if (page == "must_read") {
        this.pageType = "";
        return;
      } else if (page == "war_win") {
        this.pageType = "";
        return;
      }
      this.pageType = page;
    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
      headerStore.fetchTheUserPoint();
      headerStore.fetchGlobalNew();
    },
    // 打开购买
    handleBuy() {
      if (this.userInfo?.id && this.isLogin) {
        const is_must_read = getLocalStore("must_read");
        if (is_must_read == "1") {
          this.showBuy = true;
          return;
        }

        this.pageType = "must_read";
        return;
      }

      this.pageType = "login";
    },
    createSSE() {
      if (window.EventSource) {
        // 根据环境的不同，变更url
        const url = config.api;
        // const url =
        //   config.ENV == "pro" ? "https://sse.bitzing.io/" : config.api;

        let headerParams = {
          "Content-Type": "text/event-stream",
        };

        // 加载TOKEN
        if (localStorage.getItem("certificate")) {
          headerParams["certificate"] = decryptCBC(
            localStorage.getItem("certificate")
          );
        }

        // 初始化创建SSE
        this.eventSource = new EventSourcePolyfill(
          `${url}mystery-web-game/sse/createConnect`,
          {
            // 设置重连时间
            heartbeatTimeout: 60 * 1000,
            // 添加token
            headers: headerParams,
          }
        );
        // 删除标记
        window.sessionStorage.removeItem("currentRound");

        // 初始化SVG
        this.$nextTick(() => {
          this.initSvg();
          this.setSvg();
        });

        this.connectSSE();
      } else {
        console.log("Your browser does not support SSE~");
      }
    },
    connectSSE() {
      let headerParams = {
        "Content-Type": "text/event-stream",
      };

      // 加载TOKEN
      if (localStorage.getItem("certificate")) {
        headerParams["certificate"] = decryptCBC(
          localStorage.getItem("certificate")
        );
      }

      // 连接
      // eslint-disable-next-line no-unused-vars
      this.eventSource.onopen = (e) => {
        // 公共数据
        this.eventSource.addEventListener("COMMON_DATA", (e) => {
          const warGame = JSON.parse(e.data);
          const currentRound = getSessionStore("currentRound");

          // 如果是新的一局
          if (currentRound != warGame.id) {
            this.initRotate();
            // 清理数据
            this.warInfo = null;
            this.warData = [];
            this.winInfo = {};
            this.userData = null;
            this.winUserId = null;
            this.currentStatus = "INIT";
            if (this.nextTimer) {
              clearInterval(this.nextTimer);
              this.nextTimer = null;
              this.seconds = 0;
            }

            this.$forceUpdate();

            setSessionStore("currentRound", warGame.id);

            // 等待页面加载完成
            this.$nextTick(() => {
              this.initSvg();
              this.setSvg();
            });
          }

          this.warInfo = warGame;
          this.warData = this.warInfo.joinDataList;

          if (this.userInfo?.id && this.isLogin) {
            const user = this.warData.find(
              (e) => e.userId == this.userInfo?.id
            );

            if (user) {
              this.userData = user;
            }
          }

          if (this.warData.length > 0) {
            // 等待页面加载完成
            this.$nextTick(() => {
              this.setSvgPath();
              this.setBorderSVG();
            });
          }
        });

        // 中奖推送
        this.eventSource.addEventListener("OPEN_PRIZE", (e) => {
          this.winInfo = JSON.parse(e.data);
          this.winUserId = this.winInfo.winerUserId;
        });

        // 观看人数
        this.eventSource.addEventListener("PEOPLE_NUM", (e) => {
          this.watcherNum = e.data;
        });

        // 结束时间
        this.eventSource.addEventListener("OPEN_TIME", (e) => {
          try {
            this.warTime = JSON.parse(e.data);

            // 强制更新服务器时间
            const { setCurrentTime } = useUserStore();
            setCurrentTime(this.warTime.serverTime);
          } catch (error) {
            this.warTime = {
              serverTime: null,
              countdownTime: null,
            };
          }
        });
      };

      this.eventSource.onerror = (e) => {
        if (e.readyState == EventSource.CLOSED) {
          console.log("SSE connection closed");
        } else if (this.eventSource.readyState == EventSource.CONNECTING) {
          console.log("SSE reconnect");
          //重新设置token
          this.eventSource.headers = headerParams;
        } else {
          console.log("error", e);
        }
      };
    },
    // 创建SVG对象
    initSvg() {
      const { width, translateV } = this.getRatio();

      // 清除内容
      document.getElementById("war_container").innerHTML = null;

      let svg = d3
        .select("#war_container")
        .attr("width", width)
        .attr("height", width);

      this.svgGraphics = svg
        .append("g")
        .attr("transform", `translate( ${translateV}, ${translateV} )`);
    },
    // 初始化SVG
    setSvg() {
      let that = this;
      const { warData, screenWidth } = this;
      let warPath = [{ buyPrice: 1 }];
      if (warData.length > 0) {
        warPath = warData;
      }

      let innerRatio = 9.375;
      let offsetRatio = 11.25;

      if (screenWidth <= 950) {
        innerRatio = 6.75;
        offsetRatio = 8;
      }

      const { fontSize, width, translateV } = this.getRatio();

      const pathWidth = width - translateV * 2;
      const inner = innerRatio * fontSize;
      const offset = offsetRatio * fontSize;

      //设置饼图的半径
      let radius = pathWidth / 2;

      let arc = d3.arc().innerRadius(inner);

      //饼图偏移的终点
      let pointEnd = d3
        .arc()
        .innerRadius(radius - offset)
        .outerRadius(radius - offset);

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.buyPrice;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(this.svgAngle)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(warPath);

      this.svgGraphics
        .append("g")
        .attr("transform", "translate( " + radius + ", " + radius + " )")
        .attr("class", "war")
        .selectAll("path")
        .data(drawData)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          if (warData.length > 0) {
            return userColor[d.index];
          } else {
            return "#434348";
          }
        })
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        })
        .on("click", (e, d) => that.showWarUser(e, d, 2))
        .on("mouseover", arcTween(1, 2))
        .on("mousemove", arcTween(1, 2))
        .on("mouseout", arcTween(2, 2));

      // 鼠标悬停
      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function (event, d) {
          let array = [];
          let ss = d3.select(this);

          array = pointEnd.centroid(d);
          const outer_ring = document.getElementsByClassName("outer_ring");
          if (outerRadius == 1) {
            if (that.warData.length > 0) {
              that.mouseenterFun(d, event);
            }

            if (outer_ring.length > 0) {
              outer_ring[0].classList.add("hover");
            }
            ss.transition()
              .delay(delay)
              .attr(
                "transform",
                "translate( " +
                  Number(array[0]).toFixed(4) +
                  ", " +
                  Number(array[1]).toFixed(4) +
                  " )"
              );
          } else {
            that.showTooltips = false;
            that.tooltips = null;

            if (outer_ring.length > 0) {
              outer_ring[0].classList.remove("hover");
            }

            ss.transition()
              .delay(delay)
              .attr("transform", "translate( " + 0 + ", " + 0 + " )");
          }
        };
      }
    },
    // 动态新增Path路径
    setSvgPath() {
      let that = this;
      const { warData, screenWidth } = this;
      let innerRatio = 9.375;
      let offsetRatio = 11.25;

      if (screenWidth <= 950) {
        innerRatio = 6.75;
        offsetRatio = 8;
      }

      const { fontSize, width, translateV } = this.getRatio();

      const pathWidth = width - translateV * 2;
      const inner = innerRatio * fontSize;
      const offset = offsetRatio * fontSize;

      //设置饼图的半径
      let radius = pathWidth / 2;

      let arc = d3.arc().innerRadius(inner);

      let svg = d3.select("#war_container").select("g").select(".war");

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      //饼图偏移的终点
      let pointEnd = d3
        .arc()
        .innerRadius(radius - offset)
        .outerRadius(radius - offset);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.buyPrice;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(angles)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(warData);

      svg
        .selectAll("path")
        .data(drawData)
        .join("path")
        .attr("fill", function (d) {
          return userColor[d.index];
        })
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        })
        .on("click", (e, d) => that.showWarUser(e, d, 2))
        .on("mouseover", arcTween(1, 2))
        .on("mousemove", arcTween(1, 2))
        .on("mouseout", arcTween(2, 2));

      // 鼠标悬停
      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function (event, d) {
          let array = [];
          let ss = d3.select(this);

          array = pointEnd.centroid(d);
          const outer_ring = document.getElementsByClassName("outer_ring");
          if (outerRadius == 1) {
            that.mouseenterFun(d, event);
            if (outer_ring.length > 0) {
              outer_ring[0].classList.add("hover");
            }
            ss.transition()
              .delay(delay)
              .attr(
                "transform",
                "translate( " +
                  Number(array[0]).toFixed(4) +
                  ", " +
                  Number(array[1]).toFixed(4) +
                  " )"
              );
          } else {
            that.showTooltips = false;
            that.tooltips = null;

            if (outer_ring.length > 0) {
              outer_ring[0].classList.remove("hover");
            }

            ss.transition()
              .delay(delay)
              .attr("transform", "translate( " + 0 + ", " + 0 + " )");
          }
        };
      }
    },
    // 计算中奖时减速旋转总度数
    getSlowDeg() {
      const { warData, svgAngle, winUserId } = this;

      const countDown = 360; // 中奖也旋转1圈
      const currentDeg = 360 - Number(svgAngle || 0); // 加入当前轮剩余度数

      // 旋转所需度数
      let degCount = 0;

      // 度数应该是参加用户的倒序取
      const degArray = [];
      for (let i = warData.length; i > 0; i--) {
        if (warData[i - 1].userId == winUserId) {
          degArray.push(warData[i - 1]);
          break;
        } else {
          degArray.push(warData[i - 1]);
        }
      }

      //累计旋转度数
      for (let i = 0; i < degArray.length; i++) {
        if (degArray[i].userId == winUserId) {
          // 需要再加上一半中奖者所占度数才能到顶点
          degCount += Number(
            new bigNumber(this.getDeg(degArray[i].buyPrice)).div(2)
          );
        } else {
          degCount += this.getDeg(degArray[i].buyPrice);
        }
      }

      //   旋转一圈 + 当前圈剩余+胜利者位置
      degCount = countDown + currentDeg + Math.floor(degCount);
      return degCount;
    },
    // 初始化抽奖
    initRotate() {
      // 旋转参数
      this.startTime = Date.now();
      this.svgAngle = 0;
      this.progress = 0;
      this.endTime = null;
      this.endDeg = 0;
    },
    // 开始抽奖
    startLottery() {
      this.warTime.countdownTime = null;

      // 计时器可能会每秒都触发事件
      if (this.currentStatus != "INIT") return;

      // 当前状态不是未开奖也不转
      if (this.warInfo?.currentStatus != "WAIT") {
        if (this.warInfo.currentStatus == "OPEN") {
          // 加载胜利者数据
          this.winInfo = this.warInfo.warWinBO;

          this.winUserId = this.winInfo.winerUserId;
          this.svgAngle = this.getSlowDeg() % 360;
          this.setSvgPath();

          this.currentStatus = "WIN";
        } else {
          this.currentStatus = "CANCEL";
          this.countDown(1);
        }

        return;
      }

      const { warData } = this;

      if (warData.length > 1) {
        this.currentStatus = "WAIT";
        this.percentage = 100;

        // 开奖函数
        this.timer = setTimeout(this.animation, 1000 / 60);
      } else {
        // 开奖失败
        this.currentStatus = "CANCEL";
        this.countDown(1);
      }
    },
    // 启动旋转和均速旋转
    animation() {
      const {
        startTime, // 旋转开始时间
        maxSpeed, // 最大速度
        startHoldTime, // 加速持续时间
        timeStartPoint, // 时间段的起点
        endHoldTime, // 减速持续时间
        progress, // 动画循环总次数，用来计算fps
      } = this;

      // 当前状态不是等待开奖 中断旋转
      if (this.currentStatus != "WAIT") {
        this.initRotate(); // 重置圆环位置
        return;
      }

      // 有延迟不会更新进度条
      this.percentage = 100;
      this.$forceUpdate();

      // 当前使用的时间段
      const currentTime = Date.now() - startTime;

      // 获取当前帧的速度
      const curSpeed = easeIn(
        currentTime,
        timeStartPoint,
        maxSpeed,
        startHoldTime
      );

      // 旋转角度
      this.svgAngle += curSpeed;

      // 优化结果值，取360度的余数结果即为当前位置
      this.svgAngle = this.svgAngle % 360;

      // svg调整位置（旋转）
      this.setSvgPath();

      // 检测到winUserId有值，此时知道抽到的奖品区间范围，开始实行减速，计算减速总路程
      if (this.winUserId != null) {
        // 计算屏幕刷新帧率（好像没什么用，取到也是0）
        const fps = currentTime / progress;
        this.endTime = Date.now();

        // 开始减速时所处的位置
        this.stopDeg = this.svgAngle;

        let i = 0;
        while (++i) {
          // 结合开始减速时所处的位置和结束时所处的位置计算旋转总路程
          const endDeg = this.getSlowDeg();

          // 计算刚开始第一帧旋转的角度，也就是初始速度
          const curSpeed =
            easeOut(fps, this.stopDeg, endDeg, endHoldTime) - this.stopDeg;

          // 当初始速度与当前旋转最大速度相等，即可获取总共需要旋转的角度
          if (curSpeed >= maxSpeed) {
            this.endDeg = endDeg;
            break;
          }
        }

        // 开始减速
        return this.slowDown();
      }

      this.timer = setTimeout(this.animation, 1000 / 60);
    },
    // 减速旋转
    slowDown() {
      this.timer = setTimeout(() => {
        const currentTime = Date.now() - this.endTime;

        // 当前状态不是等待开奖 中断旋转
        if (this.currentStatus != "WAIT") {
          this.initRotate(); // 重置圆环位置
          return;
        }

        // 减速完成
        if (currentTime >= this.endHoldTime) {
          // 开奖成功
          this.currentStatus = "WIN";
          this.countDown(2);

          //如果中奖者是登录用户
          if (this.winUserId == this.userInfo?.id) {
            this.winUser = deepClone(this.winInfo);
            this.pageType = "war_win";
          }

          this.warTime.countdownTime = null;

          if (this.userInfo?.id && this.isLogin) {
            this.getTheUserBalanceInfo();
          }
          return;
        }

        // 缓出减速
        this.svgAngle =
          easeOut(currentTime, this.stopDeg, this.endDeg, this.endHoldTime) %
          360;

        // svg调整位置（旋转）
        this.setSvgPath();

        this.slowDown();
      }, 1000 / 60);
    },
    // 格式化胜率
    getWinningRate(event) {
      const { totalBonus } = this;
      const amount = Number(event || 0);
      if (!amount || !Number(totalBonus)) return 0;

      const rate = new bigNumber(event)
        .div(Number(totalBonus))
        .multipliedBy(100);

      return accurateDecimal(rate, 2);
    },
    // 处理弹窗事件
    handlePopups(event) {
      if (event == "must_read") {
        this.pageType = "";
        return;
      }

      this.operationType = event;
    },
    // 关闭弹窗
    handleClose(event) {
      this.cahngeConfig = event;
      this.operationType = "";
      setTimeout(() => {
        // 处理完毕后清除类型
        this.cahngeConfig = "";
      }, 300);
    },
    // 取得用户所占度数
    getDeg(event) {
      const {
        warInfo: { totalBonus },
      } = this;

      const rate = Number(new bigNumber(event).div(totalBonus));

      return Number(new bigNumber(360).multipliedBy(rate));
    },
    // 获取进度
    getPercentage(event) {
      const { singleTime } = this.config || { singleTime: 300 };
      let times = singleTime;
      const { bigPrizeStatus } = this.warInfo;

      if (bigPrizeStatus == "TRUE") {
        times = 600;
      }

      let end = Number(new bigNumber(event).div(1000));

      // 计算出百分比
      this.percentage = Number(
        accurateDecimal(new bigNumber(end).div(times).multipliedBy(100), 2)
      );
    },
    // 获取用户颜色
    getColor(event) {
      return userColor[Number(event)];
    },
    // 查询历史信息
    async fetchCommonData() {
      const res = await getCommonData({ id: this.warHistory.id });
      if (res.code == 200) {
        this.warInfo = res.data;
        this.warData = res.data.joinDataList;

        this.initSvg();
        this.setSvg();

        if (this.userInfo?.id && this.isLogin) {
          const user = this.warData.find((e) => e.userId == this.userInfo?.id);

          if (user) {
            this.userData = user;
          }
        }

        // 等待页面加载完成
        this.$nextTick(() => {
          this.setBorderSVG();
        });

        if (this.warInfo.currentStatus == "OPEN") {
          // 加载胜利者数据
          this.winInfo = {
            ...this.warHistory,
          };

          this.winUserId = this.winInfo.winerUserId;
          this.svgAngle = this.getSlowDeg() % 360;
          this.setSvgPath();

          this.currentStatus = "WIN";
        } else if (
          !this.warHistory.currentStatus ||
          this.warHistory.currentStatus == "CANCELED" ||
          this.warHistory.currentStatus == "REFUNDED"
        ) {
          this.currentStatus = "CANCEL";
        }
      }
    },
    // 返回
    handleBack() {
      this.$emit("toWar");
      this.warInfo = null;
      this.warData = [];
      this.winInfo = {};
      this.userData = null;
      this.winUserId = null;

      const is_must_read = getLocalStore("must_read");
      if (is_must_read == "1") {
        this.showBuy = true;
      }

      this.createSSE();
    },
    // 设置等级边框SVG
    setBorderSVG() {
      const { warData } = this;
      // 没有用户就不执行
      if (!warData.length > 0) return;

      for (let i = 0; i < warData.length; i++) {
        let svg = this.getLevel(
          warData[i].buyPrice,
          undefined,
          this.screenWidth
        );
        const docTag = document.getElementsByClassName("user_item")[i];
        // 如果已有边框就跳过本次
        if (docTag.querySelectorAll("svg").length > 0) continue;

        this.renderAsSvg(1, svg, i);
      }
    },
    setTooltip(event, index) {
      if (!document.getElementsByClassName("tooltips_box").length > 0) return;

      let svg = this.getLevel(event.buyPrice, 2);

      const docTag = document.getElementsByClassName("tooltips_box")[0];

      if (docTag.querySelectorAll("svg").length > 0) {
        document
          .getElementsByClassName("tooltips_box")[0]
          .removeChild(docTag.querySelectorAll("svg")[0]);
      }
      this.renderAsSvg(2, svg, index);
    },
    // SVG填色
    async renderAsSvg(type, url, index) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.send();
      xhr.addEventListener("load", async () => {
        const resXml = xhr.responseXML;
        const svgDom = resXml.documentElement.cloneNode(true);

        // 设置样式
        svgDom.style.position = "absolute";
        svgDom.style.top = "0";
        svgDom.style.left = "0";
        svgDom.style.width = "100%";
        svgDom.style.height = "100%";

        // 设置形状
        const paths = svgDom.getElementsByTagName("path");
        for (const item of paths) {
          if (item.attributes.fill?.value == "white") {
            item.attributes.fill.value = this.getColor(index);
          }

          if (item.attributes.stroke?.value == "white") {
            item.attributes.stroke.value = this.getColor(index);
          }
        }

        // 设置线条，矩形
        const rects = svgDom.getElementsByTagName("rect");
        for (const item of rects) {
          if (item.attributes.fill?.value == "white") {
            item.attributes.fill.value = this.getColor(index);
          }

          if (item.attributes.stroke?.value == "white") {
            item.attributes.stroke.value = this.getColor(index);
          }
        }
        if (type == 1) {
          document
            .getElementsByClassName("user_item")
            // eslint-disable-next-line no-unexpected-multiline
            [index].insertAdjacentElement("afterbegin", svgDom);
        } else {
          if (!document.getElementsByClassName("tooltips_box").length > 0)
            return;

          document
            .getElementsByClassName("tooltips_box") // eslint-disable-next-line no-unexpected-multiline
            [0].insertAdjacentElement("afterbegin", svgDom);
        }
      });
      xhr.addEventListener("error", (err) => {
        console.log(err);
      });
    },
    // 悬浮
    mouseenterFun(d, event) {
      if (this.screenWidth <= 950) return;

      this.showTooltips = true;

      if (this.tooltips?.userId != d.data.userId) {
        // 等待页面加载完成
        this.$nextTick(() => {
          this.setTooltip(d.data, d.index);
        });
      }

      this.tooltips = d.data;

      const x = event.pageX || event.clientX + document.body.scroolLeft;
      const y = event.pageY || event.clientY + document.body.scrollTop;
      const top = y + 5;
      const left = x + 5;
      this.style = {
        top: `${top}px`,
        left: `${left}px`,
      };
    },
    // 显示参与信息
    showWarUser(event, data = {}, type = 1) {
      if (!this.warData.length > 0) return;

      if (type == 2) {
        const user = this.warData[data.index];
        this.warUserId = user.userId;
        this.pageType = "user_info";
        return;
      }

      this.warUserId = event.userId;
      this.pageType = "user_info";
    },
    // 倒计时
    countDown(type) {
      const Countdown = type == 1 ? 15 : 12;
      if (!this.nextTimer) {
        this.countdown = Countdown;
        this.seconds = this.countdown;
        this.percentage = Number(
          accurateDecimal(
            new bigNumber(this.seconds).div(Countdown).multipliedBy(100),
            2
          )
        );

        this.nextTimer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 15) {
            this.countdown--;
            if (this.countdown !== 0) {
              this.seconds = this.countdown;
              this.percentage = Number(
                accurateDecimal(
                  new bigNumber(this.seconds).div(Countdown).multipliedBy(100),
                  2
                )
              );
            } else {
              this.seconds = this.countdown;
              this.percentage = Number(
                accurateDecimal(
                  new bigNumber(this.seconds).div(Countdown).multipliedBy(100),
                  2
                )
              );
              clearInterval(this.nextTimer);
              this.countdown = 15;
              this.nextTimer = null;
            }
          }
        }, 1000);
      }
    },
    // 获取配置
    async fetchConfig() {
      const res = await getConfig();
      if (res.code == 200) {
        this.config = res.data;
      }
    },
    // 获取像素比例
    getRatio() {
      const { screenWidth } = this;
      let fontSize = 16;
      let widthRatio = 28.125;
      let translateRatio = 1.5625;
      if (screenWidth > 950 && screenWidth < 1366) {
        fontSize = 10;
      } else if (screenWidth >= 1366 && screenWidth < 1440) {
        fontSize = 12;
      } else if (screenWidth >= 1440 && screenWidth < 1600) {
        fontSize = 14;
      } else {
        fontSize = 16;

        if (screenWidth <= 950) {
          widthRatio = 19.375;
          translateRatio = 1.25;
        }
      }

      const width = widthRatio * fontSize;
      const translateV = translateRatio * fontSize;

      return {
        fontSize: fontSize,
        width: width,
        translateV: translateV,
      };
    },
    showFAQ() {
      this.isFAQ = true;
      window.scrollTo(0, 0);
    },
    // 批量获取图标
    async initIconData() {
      const rankData = import.meta.glob(
        "@/assets/svg/home/warGame/rank/*.svg",
        {
          eager: true,
        }
      );

      // 军衔
      for (const key in rankData) {
        let name = key.split("/").slice(-1)[0].split(".")[0];
        const flie = await rankData[key]();
        this.rankLevel[name] = flie.default;
      }

      const levelData = import.meta.glob(
        "@/assets/svg/home/warGame/level/*.svg",
        {
          eager: true,
        }
      );

      // 等级边框
      for (const key in levelData) {
        let name = key.split("/").slice(-1)[0].split(".")[0];
        const flie = await levelData[key]();
        this.level[name] = flie.default;
      }

      const tooltipData = import.meta.glob(
        "@/assets/svg/home/warGame/tooltip/*.svg",
        {
          eager: true,
        }
      );

      // 提示边框
      for (const key in tooltipData) {
        let name = key.split("/").slice(-1)[0].split(".")[0];
        const flie = await tooltipData[key]();
        this.tooltip[name] = flie.default;
      }

      // 等待图标资源加载完成
      if (this.isHistory) {
        this.showBuy = false;
        this.fetchCommonData();
      } else {
        this.createSSE();
      }
    },
    // 获取军衔
    getRank(evnet) {
      const { rankLevel } = this;
      const amount = Number(evnet || 0);
      if (amount == 0) {
        return rankLevel["rank_1"];
      } else if (amount <= 2) {
        return rankLevel["rank_2"];
      } else if (amount <= 4) {
        return rankLevel["rank_3"];
      } else if (amount <= 6) {
        return rankLevel["rank_4"];
      } else if (amount <= 8) {
        return rankLevel["rank_5"];
      } else if (amount <= 10) {
        return rankLevel["rank_6"];
      } else if (amount <= 25) {
        return rankLevel["rank_7"];
      } else if (amount <= 50) {
        return rankLevel["rank_8"];
      } else if (amount <= 100) {
        return rankLevel["rank_9"];
      } else if (amount <= 250) {
        return rankLevel["rank_10"];
      } else if (amount <= 500) {
        return rankLevel["rank_11"];
      } else if (amount <= 1000) {
        return rankLevel["rank_12"];
      } else if (amount <= 2500) {
        return rankLevel["rank_13"];
      } else if (amount <= 5000) {
        return rankLevel["rank_14"];
      } else if (amount <= 7500) {
        return rankLevel["rank_15"];
      } else if (amount <= 10000) {
        return rankLevel["rank_16"];
      } else if (amount <= 25000) {
        return rankLevel["rank_17"];
      } else if (amount <= 50000) {
        return rankLevel["rank_18"];
      } else if (amount <= 100000) {
        return rankLevel["rank_19"];
      } else if (amount <= 250000) {
        return rankLevel["rank_20"];
      } else if (amount <= 500000) {
        return rankLevel["rank_21"];
      } else if (amount <= 750000) {
        return rankLevel["rank_22"];
      } else {
        return rankLevel["rank_23"];
      }
    },
    getLevel(evnet, type = 1, screen = 1920) {
      const { level, tooltip } = this;

      const amount = Number(evnet || 0);
      if (amount < 10) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_1;
          }

          return level.level_1;
        } else {
          return tooltip.level_1;
        }
      } else if (amount < 50) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_2;
          }

          return level.level_2;
        } else {
          return tooltip.level_2;
        }
      } else if (amount < 1000) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_3;
          }

          return level.level_3;
        } else {
          return tooltip.level_3;
        }
      } else if (amount < 10000) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_4;
          }

          return level.level_4;
        } else {
          return tooltip.level_4;
        }
      } else if (amount < 100000) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_5;
          }

          return level.level_5;
        } else {
          return tooltip.level_5;
        }
      } else if (amount < 1000000) {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_6;
          }

          return level.level_6;
        } else {
          return tooltip.level_6;
        }
      } else {
        if (type == 1) {
          if (screen < 950) {
            return level.level_mobile_7;
          }

          return level.level_7;
        } else {
          return tooltip.level_7;
        }
      }
    },
  },
  beforeUnmount() {
    if (this.eventSource) {
      // 关闭SSE
      this.eventSource.close();
      // 销毁对象
      this.eventSource = null;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  created() {
    const that = this;
    window.screenWidth = document.body.clientWidth;
    that.screenWidth = window.screenWidth;

    const is_must_read = getLocalStore("must_read");
    if (is_must_read == "1") {
      this.showBuy = true;
    } else {
      this.pageType = "must_read";
    }

    this.initIconData();
    this.fetchConfig();
  },
  mounted() {
    const that = this;
    handleWindowResize(() => {
      window.screenWidth = document.body.clientWidth;
      that.screenWidth = window.screenWidth;
    });
  },
  watch: {
    screenWidth(newV) {
      if (!newV) return;

      this.initSvg();
      this.setSvg();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
