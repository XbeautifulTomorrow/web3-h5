<template>
  <div class="war_game_wrapper">
    <div class="banner_box"></div>
    <div class="tag_items">
      <div class="tag_item active">TOKEN WAR</div>
      <div class="tag_item">HISTORY</div>
    </div>
    <div class="war_game_panel">
      <div class="war_game_user panel_bg">
        <div class="basic_info">
          <div class="user_num">8 Players</div>
          <div class="watcher_num">
            <img src="@/assets/svg/home/warGame/icon_watching.svg" alt="" />
            <span>11 Watcher</span>
          </div>
        </div>
        <div class="user_list_box">
          <div class="user_item">
            <div class="user_badge">
              <img src="@/assets/svg/user/coin/icon_eth.svg" alt="" />
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
                    <div class="user_name">123789156</div>
                    <div class="buy">
                      <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                      <span>500</span>
                    </div>
                  </div>
                </div>
                <div class="tickets_box">
                  <span class="ratio">10%</span>
                  <span class="reward_id">Reward ID:1-500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lottery_panel panel_bg">
        <div class="prize_pool">
          <div class="round">Current Round</div>
          <div class="prize_box">
            <div class="title">Your Unclaimed Winnings</div>
            <div class="prize_val">
              <div class="prize" @click="stopRotate()">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>10000</span>
              </div>
              <div class="claim_btn" @click="rotateSvg()">CLAIM</div>
            </div>
          </div>
        </div>
        <div class="war_game_box">
          <svg id="war_container"></svg>
          <div class="round_prize">
            <div class="round_num">Round 15</div>
            <div class="round_prize_val">
              <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
              <span>10000</span>
            </div>
          </div>
        </div>
        <div class="countdown_box">
          <img src="@/assets/svg/home/warGame/icon_countdown.svg" alt="" />
          <div class="progress_bar"></div>
          <div class="countdown">03:05.25</div>
        </div>
      </div>
      <div class="round_info_panel">
        <div class="round_info panel_bg">
          <div class="round_num">Round 15</div>
          <div class="info">
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>1.25</span>
              </div>
              <div class="info_title">Winner Bonus</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_players.svg" alt="" />
                <span>1.25</span>
              </div>
              <div class="info_title">Player</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/user/icon_usdt_gold.svg" alt="" />
                <span>5</span>
              </div>
              <div class="info_title">Your Tickets</div>
            </div>
            <div class="info_item">
              <div class="info_val">
                <img src="@/assets/svg/home/warGame/icon_win.svg" alt="" />
                <span>1.25%</span>
              </div>
              <div class="info_title">Your Win Chance</div>
            </div>
          </div>
        </div>
        <div class="connect_box panel_bg">
          <div class="not_connect">
            <div class="enter_war">ENTER WAR</div>
          </div>
        </div>
      </div>
    </div>
    <div class="introduce_panel">
      <div class="introduce_box">
        <div class="introduce_title">Here's How It Works</div>
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
          <div class="step_item">
            <img src="@/assets/svg/home/warGame/icon_connect.svg" alt="" />
            <div class="round">1</div>
            <div class="description">
              确保您的Bitzing账号有足够的余额参加游戏
            </div>
          </div>
          <div class="step_item">
            <img src="@/assets/svg/home/warGame/icon_share.svg" alt="" />
            <div class="round">2</div>
            <div class="description">
              输入您想要投入的弹药量并等待抽奖开始，10000弹药=1 ETH
            </div>
          </div>
          <div class="step_item">
            <img src="@/assets/svg/home/warGame/icon_invite_users.svg" alt="" />
            <div class="round">3</div>
            <div class="description">
              当人数大于1且倒计时结束时将开始抽奖，在那之前，你可以去尝试盲盒或一元购等任何事情
            </div>
          </div>
          <div class="step_item">
            <img src="@/assets/svg/home/warGame/icon_calculate.svg" alt="" />
            <div class="round">4</div>
            <div class="description">回来领取胜利果实</div>
          </div>
        </div>
      </div>
      <div class="faq_panel">
        <div class="faq_item">
          <div class="faq_item_title">开战条件</div>
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
          <div class="faq_item_title">战斗结果</div>
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
          <div class="faq_item_title">血战到底</div>
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
          <div class="faq_item_title">100%透明公正，公平性可验证</div>
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
          <div class="special_instructions" v-html="`对于进阶用户，您可以通过${clickHere()}自行验证公平性。`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import * as d3 from "d3";
export default {
  name: "BannerPage",
  data() {
    return {
      oriData: [
        { x: "A计划", y: 20 },
        { x: "B计划", y: 20 },
        { x: "C计划", y: 20 },
        { x: "D计划", y: 20 },
        { x: "E计划", y: 20 },
        { x: "F计划", y: 20 },
        { x: "G计划", y: 20 },
        { x: "H计划", y: 20 },
        { x: "I计划", y: 20 },
      ],
      svgGraphics: null,
      svgAngle: 0,
      countdown: 0,
      timer: null,
    };
  },
  computed: {
    ...mapStores(useUserStore),
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
    initSvg() {
      const [width, height] = [450, 450];

      let svg = d3
        .select("#war_container")
        .attr("width", width)
        .attr("height", height);

      this.svgGraphics = svg
        .append("g")
        .attr("transform", "translate( 25, 25 )");
    },
    setSvg() {
      const { oriData } = this;
      const [width, height] = [800, 800];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.5) / 2;

      let arc = d3.arc().innerRadius(120);

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.y;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(this.svgAngle)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(oriData);

      let colorScale = d3
        .scaleOrdinal()
        .domain(d3.range(0, oriData.length))
        .range(d3.schemeSet1);

      this.svgGraphics
        .append("g")
        .attr("transform", "translate( " + radius + ", " + radius + " )")
        .attr("class", "war")
        .selectAll("path")
        .data(drawData)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          return colorScale(d.index);
        })
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        })
        .on("mouseover", arcTween(radius + 10, 0))
        .on("mouseout", arcTween(radius, 150));

      function arcTween(outerRadius, delay) {
        // 设置缓动函数,为鼠标事件使用
        return function () {
          d3.select(this)
            .transition()
            .delay(delay)
            .attrTween("d", function (d) {
              let i = d3.interpolate(d.outerRadius, outerRadius);
              return function (t) {
                d.outerRadius = i(t);
                return arc(d);
              };
            });
        };
      }
    },
    setSvgPath() {
      const { oriData } = this;
      const [width, height] = [600, 600];

      //设置饼图的半径
      let radius = (Math.min(width, height) * 0.6) / 2;

      let arc = d3.arc().innerRadius(120);

      let svg = d3.select("#war_container").select("g").select(".war");

      const angles = this.svgAngle * ((Math.PI * 2) / 360);

      let drawData = d3
        .pie()
        .value(function (d) {
          return d.y;
        })
        .sort(null)
        .sortValues(null)
        .startAngle(angles)
        .endAngle(Math.PI * 2 + angles)
        .padAngle(0)(oriData);

      svg
        .selectAll("path")
        .data(drawData)
        .join("path")
        .attr("d", function (d) {
          d.outerRadius = radius;
          return arc(d);
        });
    },
    // 旋转
    rotateSvg() {
      const Countdown = 1000;
      if (!this.timer) {
        this.countdown = Countdown;
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 1000) {
            this.countdown--;
            if (this.countdown !== 0) {
              const angle = Number(Countdown - this.countdown) * 10;
              this.svgAngle = angle > 360 ? angle % 360 : angle;
              this.setSvgPath();
            } else {
              clearInterval(this.timer);
              this.timer = null;
            }
          }
        }, 10);
      }
    },
    stopRotate() {
      clearInterval(this.timer);
      this.timer = null;
    },
    clickHere() {
      let str = `<span style="color:#11cde9;cursor:pointer;" @click="rotateSvg()">点击这里</span>`;
      return str;
    },
  },
  mounted() {
    this.initSvg();
    this.setSvg();
    // setTimeout(() => {
    //   this.oriData.push({ x: "H计划", y: 100 });
    // }, 5000);

    // this.rotateSvg();
  },
  watch: {
    svgAngle() {
      this.setSvgPath();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./components/index.scss";
</style>
    