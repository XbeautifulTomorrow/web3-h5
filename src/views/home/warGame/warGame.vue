<template>
  <div class="war_game_wrapper">
    <div class="war_game_panel">
      <div class="war_game_user panel_bg">
        <div class="basic_info">
          <div class="user_num">{{ `${warData.length} Players` }}</div>
          <div class="watcher_num">
            <img src="@/assets/svg/home/warGame/icon_watching.svg" alt="" />
            <span>{{ `${watcherNum} Watcher` }}</span>
          </div>
        </div>
        <div class="user_list_box">
          <div class="user_item" v-for="(item, index) in warData" :key="index">
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
                      <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
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
                      `Reward ID:${item.startNumber || "-"}-${
                        item.endNumber || ""
                      }`
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lottery_panel panel_bg">
        <div class="prize_pool">
          <div class="round">
            <div class="round_title">Current Round</div>
            <div class="round_val">{{ warInfo?.id || "--" }}</div>
          </div>
        </div>
        <div class="war_game_box">
          <svg id="war_container" width="450" height="450"></svg>
          <div
            :class="['outer_ring', isHover ? 'hover' : '']"
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
              {{ `Round ${warInfo?.id || "--"}` }}
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
                {{ warInfo?.totalBonus }}
              </span>
              <span v-else>
                {{
                  `${winInfo?.winerIncome || 0} · ${accurateDecimal(
                    winInfo?.winerMultipleRate || 0,
                    2
                  )} x WIN`
                }}
              </span>
            </div>
            <div
              :class="[
                'round_prize_status',
                currentStatus == 'WAIT' ? 'cancel' : '',
              ]"
            >
              <span v-if="currentStatus == 'INIT' || currentStatus == 'WAIT'">
                等待合约计算结果
              </span>
              <span v-if="currentStatus == 'CANCEL'">流局</span>
              <span v-if="currentStatus == 'WIN'" class="win_id">
                {{ `Winner ID: ${winInfo?.openId || "--"}` }}
              </span>
              <span
                v-if="currentStatus == 'WIN' && !isHistory"
                class="next_round"
              >
                {{ `Next Round: 15s` }}
              </span>
            </div>
          </div>
        </div>
        <div class="countdown_box">
          <img src="@/assets/svg/home/warGame/icon_countdown.svg" alt="" />
          <div class="progress_bar">
            <el-progress
              :percentage="percentage"
              :stroke-width="12"
              striped
              striped-flow
              :duration="10"
              :color="'#fad54d'"
              :show-text="false"
            />
            <div class="progress_bg"></div>
          </div>
          <div class="countdown">
            <countDown
              v-slot="timeObj"
              @onEnd="startLottery()"
              @onCountDown="getPercentage"
              :time="warTime.countdownTime"
            >
              {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}` }}
            </countDown>
          </div>
        </div>
      </div>
      <div class="round_info_panel">
        <div class="round_info panel_bg">
          <div class="round_num">{{ `Round ${warInfo?.id || "--"}` }}</div>
          <div class="info">
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>{{ warInfo?.totalBonus }}</span>
              </div>
              <div class="info_title">Winner Bonus</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_players.svg" alt="" />
                <span>{{ warData.length }}</span>
              </div>
              <div class="info_title">Player</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_troops.svg" alt="" />
                <span>{{ userData?.tickerNumber || 0 }}</span>
              </div>
              <div class="info_title">Your Tickets</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_win.svg" alt="" />
                <span>{{ `${getWinningRate(userData?.buyPrice || 0)}` }}%</span>
              </div>
              <div class="info_title">Your Win Chance</div>
            </div>
          </div>
        </div>
        <div class="connect_box panel_bg">
          <div class="not_connect" v-if="!showBuy">
            <div class="enter_war" v-if="!isHistory" @click="handleBuy()">
              ENTER WAR
            </div>
            <div class="enter_war" v-else-if="isHistory" @click="handleBack()">
              Back to Current Round
            </div>
            <div class="enter_war" v-else>ENTER WAR</div>
          </div>
          <war-buy
            v-else
            :status="currentStatus"
            @showDialogFun="handlePopups"
            :config="cahngeConfig"
          ></war-buy>
        </div>
      </div>
    </div>
    <div class="introduce_panel">
      <div class="introduce_bg">
        <div class="introduce_box">
          <div class="introduce_title">Here's How It Works</div>
          <img
            class="introduce_divider"
            src="@/assets/svg/home/warGame/bg/introduce_divider.svg"
            alt=""
          />
          <div class="introduce_description">
            <p>
              投入USDT以获得弹药来让您参加公平抽奖，并赢取USDT获得第一名，您将获得大奖。
            </p>
            <p>至于亚军？将会失去所有投入，但可以获得积分。</p>
            <p>
              每颗弹药都有机会赢得大奖。你拥有的弹药越多，你的中奖几率也就越大！
            </p>
          </div>
          <div class="step_box">
            <div class="step_arrow">
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
              <img src="@/assets/svg/home/warGame/icon_arrow.svg" alt="" />
            </div>
            <div class="step_item">
              <div class="step_img img_1">
                <img src="@/assets/svg/home/warGame/icon_connect.svg" alt="" />
              </div>
              <div class="round">01</div>
              <div class="description">
                确保您的Bitzing账号有足够的余额参加游戏
              </div>
            </div>
            <div class="step_item">
              <div class="step_img img_2">
                <img src="@/assets/svg/home/warGame/icon_share.svg" alt="" />
              </div>
              <div class="round">02</div>
              <div class="description">
                输入您想要投入的弹药量并等待抽奖开始，10000弹药=1 ETH
              </div>
            </div>
            <div class="step_item">
              <div class="step_img img_3">
                <img
                  src="@/assets/svg/home/warGame/icon_invite_users.svg"
                  alt=""
                />
              </div>
              <div class="round">03</div>
              <div class="description">
                当人数大于1且倒计时结束时将开始抽奖，在那之前，你可以去尝试盲盒或一元购等任何事情
              </div>
            </div>
            <div class="step_item">
              <div class="step_img img_4">
                <img
                  src="@/assets/svg/home/warGame/icon_calculate.svg"
                  alt=""
                />
              </div>
              <div class="round">04</div>
              <div class="description">回来领取胜利果实</div>
            </div>
          </div>
        </div>
      </div>
      <div class="faq_panel">
        <div class="faq_bg">
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>开战条件</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>每一局开始时将从3分钟开始倒计时</li>
                <li>
                  当参与人数为0-1时，倒计时结束战斗失败，自动进入下一局，上一局如果有一个人下注，则自动退款
                </li>
                <li>当参与人数为2时，倒计时结束则开始战斗</li>
                <li>当参与人数为3时，倒计时自动变为15秒</li>
                <li>
                  任何情况下，只要有人入场或再次投入，那么如果倒计时低于15秒都会重置到15秒。
                </li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>战斗结果</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>
                  Token
                  War是赢者通吃的游戏，失败者将失去你所有的投入，但会获得Points
                  and tickets.
                </li>
                <li>
                  战斗将在智能合约上进行验证，在开展瞬间，每个参与者都会根据自己参赛的顺序和总金额获得对应的中奖ID
                </li>
                <li>
                  只能合约会在1-最大中奖ID之间进行随机，选中的ID持有者就是最终的胜利者
                </li>
                <li>
                  胜利者将会获得所有
                  参赛者的投入作为奖励（Bitzing扣除5%作为手续费）
                </li>
                <li>
                  每一轮战斗结束后，Bitzing将手续费的20%投入大型活动血战到底中，当条件到达时，将开启一次更加血腥暴力的特殊游戏
                </li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>血战到底</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>
                  当血战到底积累的奖池达到一定程度后，将停止货币战争，转而进行一场惊险刺激的新游戏
                </li>
                <li>血战到底将持续10分钟，所有玩家都可以加入进来。</li>
                <li>
                  每位玩家都有3次购买弹药的机会，任意玩家购买一次弹药都会将血战到底的倒计时增加10秒，但最多不会超过10分钟。
                </li>
                <li>
                  倒计时结束后，弹药最多的玩家将获得奖池金额以及所有其他玩家的弹药（Bitzing扣除总金额的5%作为手续费）。
                </li>
                <li>
                  血战到底结束后，Bitzing会将手续费的20%作为下一轮血战到底的初始奖池。
                </li>
                <li>
                  失败的玩家将失去一切，但会获得Points and tickets 作为安慰。
                </li>
                <li>血战到底极其血腥与残暴，胆小勿入。</li>
              </ul>
            </div>
          </div>
          <div class="faq_item">
            <div class="faq_item_title">
              <img src="@/assets/svg/home/warGame/icon_arrow_mini.svg" alt="" />
              <span>100%透明公正，公平性可验证</span>
            </div>
            <div class="faq_item_description">
              <ul>
                <li>
                  比赛将在区块链上经过验证、审计、符合web3标准的智能合约上运行
                </li>
                <li>不用担心Gas费，Bitzing会为您承担一切的gas成本。</li>
                <li>购买后无法退款，除非未达到开战条件。</li>
                <li>完整的参与者名单可以在游戏页面或智能合约中找到。</li>
                <li>由于血战到底特殊的机制，将无法使用此方法验证公平性。</li>
              </ul>
            </div>
            <div
              class="special_instructions"
              v-html="`对于进阶用户，您可以通过${clickHere()}自行验证公平性。`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自动配置 -->
    <war-config
      :type="operationType"
      v-if="operationType"
      @closeDialogFun="handleClose"
    ></war-config>
    <!-- 战前必读 -->
    <war-must-read
      v-if="pageType == 'must_read'"
      @closeDialogFun="handlePopups"
      @changeTypeFun="changeTypeFun"
    ></war-must-read>
    <!-- 如果中奖者是登录用户 -->
    <war-winning
      v-if="pageType == 'war_win'"
      :winInfo="winInfo"
      @closeReceiveFun="changeTypeFun"
      @closeDialogFun="closeDialogFun"
    ></war-winning>
    <!-- 登录相关 -->
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
  </div>
</template>
  <script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import config from "@/services/env";
import { getCommonData } from "@/services/api/tokenWar";
import * as d3 from "d3";
import {
  accurateDecimal,
  decryptCBC,
  setSessionStore,
  getSessionStore,
  getLocalStore,
  easeIn,
  easeOut,
} from "@/utils";
import { userColor, getRank, getLevel } from "./components/config";
import bigNumber from "bignumber.js";

import warBuy from "./warBuy.vue";
import warConfig from "./warConfig.vue";
import warMustRead from "./warMustRead.vue";
import warWinning from "./warWinning.vue";
import countDown from "@/components/countDown";

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
      timer: null,

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

      isHover: false,
    };
  },
  computed: {
    ...mapStores(useUserStore, useHeaderStore),
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
    getRank: getRank,
    getLevel: getLevel,
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
        this.showBuy = true;
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
            heartbeatTimeout: 60 * 60 * 1000,
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
        console.log("SSE connection succeeded");
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
      const [width, height] = [450, 450];

      // 清除内容
      document.getElementById("war_container").innerHTML = null;

      let svg = d3
        .select("#war_container")
        .attr("width", width)
        .attr("height", height);

      this.svgGraphics = svg
        .append("g")
        .attr("transform", "translate( 25, 25 )");
    },
    // 初始化SVG
    setSvg() {
      const { warData } = this;
      let warPath = [{ buyPrice: 1 }];
      if (warData.length > 0) {
        warPath = warData;
      }

      const [width, height] = [800, 800];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.5) / 2;

      let arc = d3.arc().innerRadius(140);

      //饼图偏移的终点
      let pointEnd = d3
        .arc()
        .innerRadius(radius - 180)
        .outerRadius(radius - 180);

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
        .on("mouseover", arcTween(1, 2))
        .on("mouseout", arcTween(2, 2));

      // 鼠标悬停
      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function () {
          let array = [];
          let ss = d3.select(this);

          ss.transition()
            .delay(delay)
            .attrTween("d", (d) => {
              array = pointEnd.centroid(d);
              const outer_ring = document.getElementsByClassName("outer_ring");
              if (outerRadius == 1) {
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
                if (outer_ring.length > 0) {
                  outer_ring[0].classList.remove("hover");
                }

                ss.transition()
                  .delay(delay)
                  .attr("transform", "translate( " + 0 + ", " + 0 + " )");
              }
            });
        };
      }
    },
    // 动态新增Path路径
    setSvgPath() {
      const { warData } = this;

      const [width, height] = [800, 800];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.5) / 2;

      let arc = d3.arc().innerRadius(140);

      let svg = d3.select("#war_container").select("g").select(".war");

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      //饼图偏移的终点
      let pointEnd = d3
        .arc()
        .innerRadius(radius - 180)
        .outerRadius(radius - 180);

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
        .on("mouseover", arcTween(1, 2))
        .on("mouseout", arcTween(2, 2));

      // 鼠标悬停
      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function () {
          let array = [];
          let ss = d3.select(this);

          ss.transition()
            .delay(delay)
            .attrTween("d", (d) => {
              array = pointEnd.centroid(d);
              const outer_ring = document.getElementsByClassName("outer_ring");
              if (outerRadius == 1) {
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
                if (outer_ring.length > 0) {
                  outer_ring[0].classList.remove("hover");
                }

                ss.transition()
                  .delay(delay)
                  .attr("transform", "translate( " + 0 + ", " + 0 + " )");
              }
            });
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
      if (this.warInfo?.currentStatus != "WAIT") return;

      const { warData } = this;

      if (warData.length > 1) {
        this.currentStatus = "WAIT";
        // 开奖函数
        this.timer = setTimeout(this.animation, 1000 / 60);
      } else {
        // 开奖失败
        this.currentStatus = "CANCEL";
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

          //如果中奖者是登录用户
          if (this.winUserId == this.userInfo?.id) {
            this.pageType = "war_win";
          }

          this.warTime.countdownTime = null;
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
      const { warInfo } = this;
      const amount = Number(event || 0);
      if (!amount || !Number(warInfo?.totalBonus)) return 0;

      const rate = new bigNumber(event)
        .div(Number(warInfo?.totalBonus))
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
    clickHere() {
      let str = `<span style="color:#11cde9;cursor:pointer;">点击这里</span>`;
      return str;
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
      const maxSecond = 300;

      let end = Number(new bigNumber(event).div(1000));

      // 计算出百分比
      this.percentage = Number(
        accurateDecimal(new bigNumber(end).div(maxSecond).multipliedBy(100), 2)
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
          this.currentStatus = "WIN";
          // 加载胜利者数据
          this.winInfo = {
            ...this.warHistory,
          };

          this.winUserId = this.winInfo.winerUserId;
          this.svgAngle = this.getSlowDeg() % 360;
          this.setSvgPath();
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
        let svg = getLevel(warData[i].buyPrice);
        const docTag = document.getElementsByClassName("user_item")[i];
        // 如果已有边框就跳过本次
        if (docTag.querySelectorAll("svg").length > 0) continue;

        this.renderAsSvg(svg, i);
      }
    },
    // SVG填色
    async renderAsSvg(url, index) {
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

        document
          .getElementsByClassName("user_item")
          // eslint-disable-next-line no-unexpected-multiline
          [index].insertAdjacentElement("afterbegin", svgDom);
      });
      xhr.addEventListener("error", (err) => {
        console.log(err);
      });
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
    const is_must_read = getLocalStore("must_read");

    if (is_must_read == "1") {
      this.showBuy = true;
    }

    if (this.isHistory) {
      this.showBuy = false;
      this.fetchCommonData();
    } else {
      this.createSSE();
    }
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
      