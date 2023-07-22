<template>
  <div class="wrapper_bg">
    <div class="ntf_tickets_info_wrapper">
      <div class="nft_details">
        <div class="nft_details_l border_bg">
          <Image fit="cover" class="nft_img" :src="nftInfo && nftInfo.img" />
          <div class="tips_round" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'"
            :class="[nftInfo && nftInfo.orderType == 'LIMITED_TIME' ? 'time' : 'price']">
            <div v-if="nftInfo && nftInfo.orderType == 'LIMITED_TIME'">
              <img src="@/assets/svg/home/icon_info_time_white.svg" alt="">
              <span v-if="dateDiff(nftInfo && nftInfo.endTime) > 1">
                {{ `${Math.ceil(dateDiff(nftInfo && nftInfo.endTime))} DAY LEFT` }}
              </span>
              <countDown v-else v-slot="timeObj" @onEnd="loadInterface()" :time="nftInfo && nftInfo.endTime">
                {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
              </countDown>
            </div>
            <div v-else>
              <img src="@/assets/svg/home/icon_info_price_white.svg" alt="">
              <span>{{ `${nftInfo && nftInfo.maximumPurchaseQuantity} TICKETS LEFT` }}</span>
            </div>
          </div>
          <div class="tips_round finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
            <span>COMPLETED</span>
          </div>
          <div class="tips_round aborted" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
            <span>ABORTED</span>
          </div>
          <div class="tips_round cancel" v-else>
            <span>CANCELLED</span>
          </div>
        </div>
        <div class="nft_details_r_bg border_bg">
          <div class="nft_details_r">
            <div class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</div>
            <div class="nft_activity">
              <div class="price">
                <span class="title">Market Value：</span>
                <span class="val">{{ `${nftInfo && nftInfo.totalPrice} ETH` }}</span>
              </div>
              <div class="time" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_info_price.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_info_time.svg" alt="">
                <div v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" class="time-text">
                  {{ `${nftInfo && nftInfo.maximumPurchaseQuantity || 0} TICKETS LEFT` }}
                </div>
                <div v-else class="time-text">{{ `CLOSE: ${dateFormat(nftInfo && nftInfo.endTime)}` }}</div>
              </div>
              <div class="finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_drawn.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_drawn.svg" alt="">
                <div class="time-text">COMPLETED</div>
              </div>
              <div class="aborted" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_aborted.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_aborted.svg" alt="">
                <div class="time-text">ABORTED</div>
              </div>
              <div class="cancel" v-else>
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_cancel.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_cancel.svg" alt="">
                <div class="time-text">CANCELLED</div>
              </div>
            </div>
            <div class="creator">
              <div class="created">
                <span class="title">Created by</span>
                <span>{{ nftInfo && nftInfo.projectParty || "Unnamed" }}</span>
              </div>
              <div class="owner">
                <span class="title">Owner：</span>
                <span>{{ nftInfo && nftInfo.owner }}</span>
              </div>
            </div>
            <div class="buy_relevant" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
              <div class="enter_relevant">
                <div class="title">ENTER COMPETITION</div>
                <div class="buy_tips">
                  You used <span>{{ drawnInfo && drawnInfo.userNum || 0 }}</span> of <span>
                    {{ nftInfo && new bigNumber(maxBuyNum || 0).plus(drawnInfo && drawnInfo.userNum || 0) }}
                  </span> tickets
                </div>
              </div>
              <div class="buy_box">
                <div class="buy_tips">Purchase limited NFT to enter：</div>
                <el-input :disabled="!maxBuyNum > 0" v-model.number="buyVotes" style="width: 100%;" class="buy_input"
                  type="number" min="0" :max="maxBuyNum" :placeholder="buyText(nftInfo)">
                </el-input>
              </div>
              <div class="payment_box">
                <el-button v-if="dateDiff(nftInfo && nftInfo.endTime) > 0 && maxBuyNum > 0" style="width: 100%;"
                  class="submit_payment" type="primary" @click="submitPayment()">
                  <span v-if="buyVotes > 1">{{ `Purchase ${buyVotes || 0} tickets for ${buyPrice} ` }}</span>
                  <span v-else>{{ `Purchase ${buyVotes || 0} ticket for ${buyPrice}` }}&nbsp;</span>
                  <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
                </el-button>
                <el-button disabled v-else style="width: 100%;" class="submit_payment" type="primary">
                  <span v-if="nftInfo.orderType == 'LIMITED_TIME'">
                    Waiting for the result...
                  </span>
                  <span v-else>
                    Competition is over, waiting for the results...
                  </span>
                </el-button>
              </div>
            </div>
            <div class="nft_end" v-else>
              <div class="winning_interval"></div>
              <div class="winning_box" v-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <div class="winning_text">
                  <span>WINNER</span>
                </div>
                <div class="avatar">
                  <img :src="drawnInfo && drawnInfo.userImg || avatarImg" alt="">
                </div>
                <div class="user_name">
                  {{ drawnInfo && drawnInfo.winningAddress || drawnInfo && drawnInfo.winningAddressId }}
                </div>
                <div class="tickets_num">
                  {{ `${drawnInfo && drawnInfo.winningAddressNum || 0} Tickets` }}
                </div>
                <div class="safety_box">
                  <img class="safety_img" src="@/assets/svg/home/icon_safety.svg" alt="">
                  <div class="safety_text">
                    <span>THIS TRANSACTION IS</span>
                    <span>PROVABLY FAIR</span>
                  </div>
                  <div class="chain_link">
                    <span @click="openLenk(nftInfo)">Verify Faimess</span>
                    <span>[Advanced Users]</span>
                  </div>
                </div>
              </div>
              <div class="return_box" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
                The competition did not reach its sell-out target and your purchased tickets have been refunded to the
                balance, worth
                <span>
                  {{ new bigNumber(nftInfo && nftInfo.price || 0).multipliedBy(drawnInfo && drawnInfo.userNum || 0) }}
                </span>
                ETH
              </div>
              <div class="return_box" v-else>
                The holder of <span>{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</span> canceled this
                competition.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nft_buy_info">
        <div class="nft_buy_info_l border_bg">
          <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
            <el-tab-pane label="ACTIVITY" name="activity"></el-tab-pane>
            <el-tab-pane :label="`PARTICIPANTS(${participantsTotal})`" name="participants"></el-tab-pane>
          </el-tabs>
          <c-scrollbar class="choose_nft" width="100%" height="48.25rem">
            <div class="buy_list">
              <div class="buy_item" v-for="(item, index) in buyData" :key="index">
                <div class="buy_item_l">
                  <img :src="item.userImg || avatarImg">
                </div>
                <div class="buy_item_r" :class="[activeType == 'participants' && 'participants']">
                  <div class="buy_info">
                    <div class="buy_name">{{ item.address || item.userId }}</div>
                    <div class="buy_time" v-if="activeType != 'participants'">{{ timeFormat(item.time) }}</div>
                  </div>
                  <div class="buy_other">
                    <div class="buy_val">{{ `${item.total} TICKETS` }} </div>
                    <div class="buy_id" v-if="activeType != 'participants'">
                      {{ `Reward ID：${item.startNum}-${item.endNum}` }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="load_more" v-if="total > 20 && !finished" @click="nextPage()">
              <div class="load_btn">
                <span>Show more</span>
                <img src="@/assets/svg/user/icon_more.svg" alt="">
              </div>
            </div>
          </c-scrollbar>
        </div>
        <div class="nft_buy_info_r border_bg">
          <div class="description_box">
            <div class="description_text">DESCRIPTION</div>
            <div class="nft_info">
              <span>Enter now for a chance to win</span>
              <span class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}`
              }}</span>
            </div>
            <div class="nft_description" v-html="detailData && detailData.description"></div>
          </div>
          <div class="traits_box">
            <div class="traits_text">TRAITS</div>
            <div class="traits_list">
              <div class="traits_item" v-for="(item, index) in attrData" :key="index">
                <div class="traits_item_top">
                  <el-tooltip popper-class="tips_box" effect="dark" placement="top">
                    <template #content>
                      <span>
                        {{ item.attrName }}
                      </span>
                    </template>
                    <div class="traits_item_name">{{ item.attrName }}</div>
                  </el-tooltip>
                  <div class="traits_item_num">
                    <img src="@/assets/svg/home/nft_tickets_attr.svg" alt="">
                    <span>{{ item.attrNum }}</span>
                  </div>
                </div>
                <div class="traits_item_val">{{ item.attrValue }}</div>
              </div>
            </div>
          </div>
          <div class="invite_box" v-if="inviteDrop.length > 0">
            <div class="invite_text">SHARE THIS COMPETITION</div>
            <div class="choose_invite_code">
              <div>Choose referrals code</div>
              <el-select v-model="inviteVal">
                <el-option v-for="(item, index) in inviteDrop" :key="index" :label="item.inviteCode"
                  :value="item.inviteCode" />
              </el-select>
              <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInviteLink(inviteVal)" alt="">
              <img src="@/assets/svg/airdrop/icon_twitter_btn.svg" @click="shareInviteLink(inviteVal)" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="ending_soon_box" v-if="endingSoon.length > 0">
        <div class="ending_soon_text">ENDING SOON</div>
        <div class="ending_soon_list">
          <div class="ending_soon_item" @click="enterNow(item)" v-for="(item, index) in endingSoon" :key="index">
            <div class="image_box">
              <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
                <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
                <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
                <span v-if="item.orderType == 'LIMITED_TIME'">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{ `${Math.ceil(dateDiff(nftInfo && nftInfo.endTime))} DAY LEFT` }}
                  </span>
                  <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                    {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                  </countDown>
                </span>
                <span v-else>{{ `${item.limitNum} TICKETS LEFT` }}</span>
              </div>
              <div class="image_tag text-ellipsis">#{{ item && item.tokenId }}</div>
              <Image fit="cover" class="nft_img" :src="item && item.nftImage" />
            </div>
            <div class="nft_name">
              <span>{{ item && item.seriesName }}</span>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft_price">{{ item && item.price }}ETH</div>
            <div class="buy_btn">
              <span>ENTER NOW</span>
            </div>
            <div class="remaining_votes">{{ `${item && item.limitNum || 0} TICKETS SOLD` }}</div>
          </div>
        </div>
      </div>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>
<script>
import {
  getOneBuyInfo,
  buyNftBalance,
  getAListOfActivities,
  getAListOfParticipants,
  getEndingSoon,
  getLottery,
  getNftAttrRate
} from "@/services/api/oneBuy";
import {
  rebatesFindList,
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";

import { CScrollbar } from "c-scrollbar";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Image from "@/components/imageView";
import {
  openUrl, onCopy, dateDiff, timeFormat
} from "@/utils";
export default {
  name: 'ntfTicketsInfo',
  components: {
    countDown,
    CScrollbar,
    Login,
    Register,
    Forgot,
    Modify,
    Image
  },
  data() {
    return {
      pageType: null, //登录相关
      orderId: null,
      nftInfo: {},
      inviteVal: null,
      inviteDrop: [],
      detailData: null,
      attrData: [],
      endingSoon: [],
      buyVotes: 1,
      activeType: "activity",
      buyData: [],
      participantsTotal: 0,
      page: 1,
      size: 20,
      total: 0,
      finished: false,
      timer: null,
      drawnInfo: null,
      avatarImg: require("@/assets/svg/user/default_avatar.svg")
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
    buyPrice() {
      const { buyVotes, nftInfo } = this;
      if (!buyVotes) return 0;
      if (!nftInfo || !nftInfo.price) return 0;
      return new bigNumber(buyVotes).multipliedBy(nftInfo.price) || 0;
    },
    // 剩余时间
    duration() {
      const { currentTime } = useUserStore();
      if (currentTime) {
        const endstamp = new Date(this.nftInfo.endTime).getTime();
        let end = String(endstamp).length >= 13 ? +endstamp : +endstamp * 1000;
        end -= new Date(currentTime).getTime();
        return end;
      }
      const timestamp = new Date(this.nftInfo.endTime).getTime();
      const time = this.isMiniSecond ? Math.round(+timestamp / 1000) : Math.round(+timestamp);
      return time;
    },
    // 计算可购买最大票数
    maxBuyNum() {
      if (!this.nftInfo) return 0;
      const { nftInfo: { totalPrice, price, orderType, maximumPurchaseQuantity }, drawnInfo } = this;

      let maxNum = 0; // 可购买最大票数
      if (orderType == "LIMITED_TIME") {
        if (!totalPrice) return 0;
        if (!price) return 0;
        maxNum = Number(Math.ceil(new bigNumber(totalPrice).dividedBy(price).dividedBy(4).minus(drawnInfo && drawnInfo.userNum || 0)));
      } else {
        if (!maximumPurchaseQuantity) return 0;
        maxNum = Number(Math.ceil(new bigNumber(totalPrice).dividedBy(price).dividedBy(4).minus(drawnInfo && drawnInfo.userNum || 0)));

        // 如果余票不足最大票数，取余票数量
        if (Number(maxNum) > Number(maximumPurchaseQuantity)) {
          maxNum = maximumPurchaseQuantity
        }
      }

      return maxNum
    }
  },
  methods: {
    onCopy: onCopy,
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    // 获取Nft信息
    async fetchOneBuyInfo() {
      const res = await getOneBuyInfo({
        orderNumber: this.orderId
      });
      if (res && res.code == 200) {
        this.nftInfo = res.data;
        this.detailData = this.nftInfo && JSON.parse(this.nftInfo.detail);
        const userStore = useUserStore();
        const { userInfo } = userStore;
        this.fetchNftAttrRate();

        if (this.isLogin && this.userInfo?.id) {
          const resDrawn = await getLottery({
            orderNumber: this.orderId,
            userId: userInfo?.id || null
          })

          if (resDrawn && resDrawn.code == 200) {
            this.drawnInfo = resDrawn.data;
          }
        }

      }
    },
    // 购买提示
    buyText(event) {
      const { maximumPurchaseQuantity, orderType } = event;
      let hintText = null;

      if (this.maxBuyNum > 0) {
        hintText = null;
      } else {
        hintText = 'You cannot purchase more tickets.';
      }

      if (orderType == "LIMITED_PRICE") {
        if (!Number(maximumPurchaseQuantity) > 0) {
          hintText = 'Tickets are sold out.';
        }
      }

      return hintText;
    },
    // 获取即将结束的一元购活动
    async fetchEndingSoon() {
      const res = await getEndingSoon({ id: this.orderId, page: 1, size: 6 });
      if (res && res.code == 200) {
        this.endingSoon = res.data.records;
      }
    },
    handleChange() {
      this.buyData = [];
      this.fetchBuyRecord();
    },
    // 购买一元购门票
    async submitPayment() {
      if (!this.isLogin || !this.userInfo?.id) {
        this.pageType = "login";
        return
      }

      const { orderId, buyVotes } = this;

      if (!buyVotes || buyVotes < 1) {
        this.$message.error("Please enter the amount you would like to purchase.");
        return
      }

      const res = await buyNftBalance({
        orderNumber: orderId,
        num: buyVotes
      });

      if (res && res.code == 200) {
        this.$message.success("Successful purchase!");
        this.buyVotes = null;
        this.fetchOneBuyInfo();
        this.getTheUserBalanceInfo();
        this.fetchBuyRecord();
      }

    },
    async getTheUserBalanceInfo() {
      const headerStore = useHeaderStore();
      headerStore.getTheUserBalanceApi();
    },
    // 最新购买
    async fetchBuyRecord(isSearch = true) {
      const { size, orderId } = this;
      let _page = this.page;
      if (isSearch) {
        this.finished = false;
        this.page = 1;
        _page = 1;
      }

      let res = null;
      if (this.activeType == "activity") {
        res = await getAListOfActivities({
          page: _page,
          size: size,
          orderNumber: orderId
        });
      } else {
        res = await getAListOfParticipants({
          page: _page,
          size: size,
          orderNumber: orderId
        });

        this.fetchUserBuyRecord();
      }

      if (res && res.code == 200) {
        this.total = res.data.total;

        if (isSearch) {
          this.buyData = res.data.records;
          return
        }

        if (res.data.records.length == 0) {
          this.finished = true;
        }

        this.buyData.push.apply(this.buyData, res.data.records);
      }
    },
    // 获取参与者总数
    async fetchUserBuyRecord() {
      const { page, size, orderId } = this;
      const res = await getAListOfParticipants({
        page: page,
        size: size,
        orderNumber: orderId
      });
      if (res && res.code == 200) {
        this.participantsTotal = res.data.total;
      }
    },
    // 获取NFT属性
    async fetchNftAttrRate() {
      const { nftInfo } = this;
      const res = await getNftAttrRate({
        contractAddress: nftInfo.contractAddress
      });
      if (res && res.code == 200) {
        this.attrData = res.data;
      }
    },
    // 加载更多
    nextPage() {
      this.page++;
      this.fetchBuyRecord(false)
    },
    // 邀请资产列表
    async fetchRebatesFindList() {
      const res = await rebatesFindList();
      if (res && res.code == 200) {
        this.inviteDrop = res.data;
        if (this.inviteDrop.length > 0) {
          this.inviteVal = this.inviteDrop[0].inviteCode;
        }
      }
    },
    // 参加赛事
    enterNow(event) {
      let routeData = this.$router.resolve({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      openUrl(routeData.href)
    },
    /*
     * 时间戳的 yyyy-MM-dd HH:mm:ss 格式化
     */
    dateFormat(event) {
      let date = new Date(event);
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      let hour = date.getHours()
      let minu = date.getMinutes()
      let sec = date.getSeconds()

      month = month >= 10 ? month : '0' + month
      day = day >= 10 ? day : '0' + day
      hour = hour >= 10 ? hour : '0' + hour
      minu = minu >= 10 ? minu : '0' + minu
      sec = sec >= 10 ? sec : '0' + sec

      return `${year}-${month}-${day} ${hour}:${minu}:${sec}`
    },
    /**
     * @description: 格式化地址
     */
    formatAddr(event) {
      if (!event) return "";
      var reg = /^(\S{6})\S+(\S{4})$/;
      return event.replace(reg, "$1...$2");
    },
    /**
     * @description: 打开链上
     */
    openLenk(event) {
      let chainLink = process.env.VUE_APP_CHAIN_MUMBAI_ADDR;
      if (event.chainType == "OKT_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_OKT_TEST_ADDR;
      } else if (event.chainType == "BSC_TEST") {
        chainLink = process.env.VUE_APP_CHAIN_BSC_TEST_ADDR;
      }

      openUrl(`${chainLink}${event.txid}`);
    },
    /**
     * @description: 加载接口
     */
    loadInterface() {
      this.fetchOneBuyInfo();
      this.fetchBuyRecord();
      this.fetchEndingSoon();
      if (this.isLogin && this.userInfo?.id) {
        this.fetchUserBuyRecord();
        this.fetchRebatesFindList(); // 邀请
      }
    },
    durationFormatter(diff) {
      // 按照传入的格式生成一个simpledateformate对象
      let nd = 1000 * 24 * 60 * 60; // 一天的毫秒数
      let nh = 1000 * 60 * 60;// 一小时的毫秒数
      let nm = 1000 * 60; // 一分钟的毫秒数
      let ns = 1000; // 一秒钟的毫秒数;

      let dd = diff / nd;// 计算差多少天
      // eslint-disable-next-line no-unused-vars
      let hh = diff % nd / nh;// 计算差多少小时
      // eslint-disable-next-line no-unused-vars
      let mm = diff % nd % nh / nm;// 计算差多少分钟
      // eslint-disable-next-line no-unused-vars
      let ss = diff % nd % nh % nm / ns;// 计算差多少秒//输出结果
      return { dd, hh, mm, ss };
    },
    // 复制邀请链接
    copyInviteLink(event) {
      const currentLink = window.location;
      let link = currentLink.origin + "/NftTicketsInfo/" + event + "?id=" + this.orderId;
      onCopy(link);
    },
    // 分享邀请链接到推特
    shareInviteLink(event) {
      const series = `⚡️ WIN AN ${this.nftInfo.name} in BITZING ⚡️\n`;
      let description = null;
      if (this.nftInfo.orderType == 'LIMITED_TIME') {
        description = `${this.nftInfo.name} #${this.nftInfo.tokenId} SWEEPSTAKES draws in `
        const { dd, hh } = this.durationFormatter(this.duration);
        if (dd <= 1 && hh <= 1) {
          // 一小时以内
          description += `in an hour!⏳\n`;
        } else if (dd <= 1 && hh > 1) {
          // 一小时以上，一天以内
          description += `${Math.floor(hh)} hours!⏳\n`;
        } else if (dd == 1 && hh > 1) {
          // 两天以内
          description += `${Math.floor(dd)} day ${Math.floor(hh)} hours!⏳\n`;
        } else if (dd > 1 && hh <= 1) {
          // 两天以上整数没有小时
          description += `${Math.floor(dd)} days⏳\n`;
        } else {
          // 两天以上
          description += `${Math.floor(dd)} days ${Math.floor(hh)} hours!⏳\n`;
        }

      } else {
        description = `${this.nftInfo.name} #${this.nftInfo.tokenId} will sell out with ${this.nftInfo.maximumPurchaseQuantity || 0} TICKETS left.\n`;
      }
      const inviteLink = `Enter HERE:`;
      const currentLink = window.location;
      let link = currentLink.origin + "/NftTicketsInfo/" + event + "?id=" + this.orderId;

      let inviteText = series;
      inviteText += description;

      inviteText += inviteLink;

      // 构建推特的分享链接
      var twitterUrl = "https://twitter.com/share?text=" + encodeURIComponent(inviteText) + "&url=" + link;
      // 在新窗口中打开推特分享链接
      openUrl(twitterUrl);
    },
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
  },
  watch: {
    buyVotes: function (newVal) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (newVal == 0 || !newVal) return;

      this.timer = setTimeout(() => {
        if (newVal > this.maxBuyNum) {
          this.buyVotes = this.maxBuyNum;
        }

        this.$forceUpdate();
      }, 300);
    },
    isLogin() {
      this.loadInterface();
    }
  },
  created() {
    // 获取一元购 ID
    const { id } = this.$route.query;
    this.orderId = id;

    this.loadInterface();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTicketsInfo.scss";
</style>
<style lang="scss">
.el-select__popper {
  border: none !important;
  background-color: #1d0f36 !important;

  .el-scrollbar__view {
    margin: 0.625rem 0 !important;
    padding: 0 !important;
  }

  .el-select-dropdown__item {
    color: #a9a4b4;
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    height: auto;

    &.selected {
      color: white;
    }

    &:hover,
    &.hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

.tips_box {
  max-width: 90%;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.3125rem;
  background-color: #2c115b !important;
  box-sizing: border-box;

  .tips_title {
    font-family: 'Medium';
    font-size: 0.875rem;
    line-height: 1.3;
    text-align: left;
    color: #a9a4b4;
  }

  .tips_text {
    font-family: 'Medium';
    font-size: 0.875rem;
    line-height: 1.3;
    text-align: left;
    color: white;
    word-break: break-all;
  }

  .el-popper__arrow::before {
    background-color: #2c115b !important;
  }
}
</style>