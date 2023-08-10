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
                {{ $t("home.dayLeft", { day: Math.ceil(dateDiff(nftInfo && nftInfo.endTime)) }) }}
              </span>
              <countDown v-else v-slot="timeObj" @onEnd="loadInterface()" :time="nftInfo && nftInfo.endTime">
                {{ $t("home.timeLeft", { time: `${timeObj.hh}:${timeObj.mm}:${timeObj.ss}` }) }}
              </countDown>
            </div>
            <div v-else>
              <img src="@/assets/svg/home/icon_info_price_white.svg" alt="">
              <span v-if="nftInfo && nftInfo.maximumPurchaseQuantity > 1">{{ $t("home.ticketsLeft", {
                num: nftInfo &&
                  nftInfo.maximumPurchaseQuantity || 0
              }) }}</span>
              <span v-else>{{ $t("home.ticketLeft", { num: nftInfo && nftInfo.maximumPurchaseQuantity || 0 }) }}</span>
            </div>
          </div>
          <div class="tips_round finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
            <span>{{ $t("ticketsInfo.completed") }}</span>
          </div>
          <div class="tips_round aborted" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
            <span>{{ $t("ticketsInfo.aborted") }}</span>
          </div>
          <div class="tips_round cancel" v-else>
            <span>{{ $t("ticketsInfo.cancelled") }}</span>
          </div>
        </div>
        <div class="nft_details_r_bg border_bg">
          <div class="nft_details_r">
            <div class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` }}</div>
            <div class="nft_activity">
              <div class="price_box">
                <div class="price">
                  <span class="title">{{ $t("ticketsInfo.marketValue") }}</span>
                  <span class="val">{{ `${nftInfo && nftInfo.totalPrice} ETH` }}</span>
                </div>
                <div class="floor_price">
                  <span class="title">{{ $t("ticketsInfo.floorPrice") }}</span>
                  <span class="val">{{ `${nftInfo && nftInfo.floorPrice} ETH` }}</span>
                </div>
              </div>
              <div class="time" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_info_price.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_info_time.svg" alt="">
                <div v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" class="time-text">
                  {{ $t("home.ticketsLeft", { num: nftInfo && nftInfo.maximumPurchaseQuantity || 0 }) }}
                </div>
                <div v-else class="time-text">
                  {{ $t("ticketsInfo.close", { time: dateFormat(nftInfo && nftInfo.endTime) }) }}
                </div>
              </div>
              <div class="finish" v-else-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_drawn.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_drawn.svg" alt="">
                <div class="time-text">{{ $t("ticketsInfo.completed") }}</div>
              </div>
              <div class="aborted" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'">
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_aborted.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_aborted.svg" alt="">
                <div class="time-text">{{ $t("ticketsInfo.aborted") }}</div>
              </div>
              <div class="cancel" v-else>
                <img v-if="nftInfo && nftInfo.orderType == 'LIMITED_PRICE'" src="@/assets/svg/home/icon_price_cancel.svg"
                  alt="">
                <img v-else src="@/assets/svg/home/icon_time_cancel.svg" alt="">
                <div class="time-text">{{ $t("ticketsInfo.cancelled") }}</div>
              </div>
            </div>
            <div class="creator">
              <div class="created">
                <span class="title">{{ $t("ticketsInfo.created") }}</span>
                <span>{{ nftInfo && nftInfo.projectParty || "Unnamed" }}</span>
              </div>
              <div class="owner">
                <span class="title">{{ $t("ticketsInfo.owner") }}</span>
                <span>{{ nftInfo && nftInfo.owner }}</span>
              </div>
            </div>
            <div class="buy_relevant" v-if="nftInfo && nftInfo.orderStatus == 'IN_PROGRESS'">
              <div class="enter_relevant">
                <div class="title">{{ $t("ticketsInfo.enterCompetition") }}</div>
                <div class="buy_tips"
                  v-html="$t('ticketsInfo.buyable', { userNum: drawnInfo && drawnInfo.userNum || 0, maxBuyNum: nftInfo && new bigNumber(maxBuyNum || 0).plus(drawnInfo && drawnInfo.userNum || 0) })">
                </div>
              </div>
              <div class="buy_box">
                <div class="buy_tips">{{ $t("ticketsInfo.purchaseNum") }}</div>
                <el-input :disabled="!maxBuyNum > 0" v-model.number="buyVotes" style="width: 100%;" class="buy_input"
                  type="number" min="0" :max="maxBuyNum" :placeholder="buyText(nftInfo)">
                </el-input>
                <div class="choose_nums">
                  <div v-for="(item, index) in numData" :key="index" :class="[
                    'choose_nums_item',
                    buyVotes == item.value && 'active',
                  ]" @click="buyVotes = item.value">
                    <span>{{ item.label }}</span>
                  </div>
                </div>
              </div>
              <div class="payment_box">
                <el-button v-if="dateDiff(nftInfo && nftInfo.endTime) > 0 && maxBuyNum > 0" style="width: 100%;"
                  class="submit_payment" type="primary" @click="submitPayment()">
                  <span v-if="buyVotes > 1">{{ `Purchase ${buyVotes || 0} tickets for ${buyPrice} ` }}</span>
                  <span v-else>{{ $t("ticketsInfo.buyNum", { num: buyVotes || 0, price: buyPrice }) }}</span>
                  <img src="@/assets/svg/user/icon_ethereum.svg" alt="">
                </el-button>
                <el-button disabled v-else style="width: 100%;" class="submit_payment" type="primary">
                  <span v-if="nftInfo.orderType == 'LIMITED_TIME'">
                    {{ $t("ticketsInfo.endHint") }}
                  </span>
                  <span v-else>
                    {{ $t("ticketsInfo.endHint1") }}
                  </span>
                </el-button>
              </div>
            </div>
            <div class="nft_end" v-else>
              <div class="winning_interval"></div>
              <div class="winning_box" v-if="nftInfo && nftInfo.orderStatus == 'DRAWN'">
                <div class="winning_text">
                  <span>{{ $t("ticketsInfo.winner") }}</span>
                </div>
                <div class="avatar">
                  <img :src="drawnInfo && drawnInfo.userImg || avatarImg" alt="">
                </div>
                <div class="user_name">
                  {{ drawnInfo && drawnInfo.winningAddress || drawnInfo && drawnInfo.winningAddressId }}
                </div>
                <div class="tickets_num" v-if="drawnInfo && drawnInfo.winningAddressNum > 1">
                  {{ $t("ticketsInfo.numTickets", { num: drawnInfo && drawnInfo.winningAddressNum || 0 }) }}
                </div>
                <div class="tickets_num" v-else>
                  {{ $t("ticketsInfo.numTicket", { num: drawnInfo && drawnInfo.winningAddressNum || 0 }) }}
                </div>
                <div class="safety_box">
                  <img class="safety_img" src="@/assets/svg/home/icon_safety.svg" alt="">
                  <div class="safety_text">
                    <span>{{ $t("ticketsInfo.verify1") }}</span>
                    <span>{{ $t("ticketsInfo.verify2") }}</span>
                  </div>
                  <div class="chain_link">
                    <span @click="openLenk(nftInfo)">{{ $t("ticketsInfo.verify3") }}</span>
                    <span>{{ $t("ticketsInfo.verify4") }}</span>
                  </div>
                </div>
              </div>
              <div class="return_box" v-else-if="nftInfo && nftInfo.orderStatus == 'CLOSED'"
                v-html="$t('ticketsInfo.closeHint', { num: new bigNumber(nftInfo && nftInfo.price || 0).multipliedBy(drawnInfo && drawnInfo.userNum || 0), coin: 'ETH' })">
              </div>
              <div class="return_box" v-else
                v-html="$t('ticketsInfo.cancelHint', { name: `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}` })">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nft_buy_info">
        <div class="nft_buy_info_l border_bg">
          <el-tabs v-model="activeType" class="type_tabs" @tab-change="handleChange">
            <el-tab-pane :label="$t('ticketsInfo.active')" name="activity"></el-tab-pane>
            <el-tab-pane :label="$t('ticketsInfo.participant', { num: participantsTotal })"
              name="participants"></el-tab-pane>
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
                    <div class="buy_val" v-if="item.total > 1">{{ $t("ticketsInfo.numTickets", { num: item.total }) }}
                    </div>
                    <div class="buy_val" v-else>{{ $t("ticketsInfo.numTicket", { num: item.total }) }} </div>
                    <div class="buy_id" v-if="activeType != 'participants'">
                      {{ $t("ticketsInfo.rewardId", { start: item.startNum, end: item.endNum }) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="load_more" v-if="total > 20 && !finished" @click="nextPage()">
              <div class="load_btn">
                <span>{{ $t("ticketsInfo.more") }}</span>
                <img src="@/assets/svg/user/icon_more.svg" alt="">
              </div>
            </div>
          </c-scrollbar>
        </div>
        <div class="nft_buy_info_r border_bg">
          <div class="description_box">
            <div class="description_text">{{ $t("ticketsInfo.description") }}</div>
            <div class="nft_info">
              <span>{{ $t("ticketsInfo.nftDescription") }}</span>
              <span class="nft_name text-ellipsis">{{ `${nftInfo && nftInfo.name} #${nftInfo && nftInfo.tokenId}`
              }}</span>
            </div>
            <div class="nft_description" v-html="detailData && detailData.description"></div>
          </div>
          <div class="traits_box">
            <div class="traits_text">{{ $t("ticketsInfo.traits") }}</div>
            <div class="traits_list">
              <div class="traits_item" v-for="(item, index) in attrData" :key="index">
                <div class="traits_item_top">
                  <div class="traits_item_name">{{ item.attrName }}</div>
                </div>
                <div class="traits_item_val">
                  <el-tooltip popper-class="tips_box" effect="dark" placement="top">
                    <template #content>
                      <span>{{ item.attrValue }}</span>
                    </template>
                    <div class="item_val">{{ item.attrValue }}</div>
                  </el-tooltip>
                  <span class="item_ratio">{{ new bigNumber(item.attrRate).multipliedBy(100) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="invite_box">
            <div class="invite_text">{{ $t("ticketsInfo.share") }}</div>
            <div class="choose_invite_code">
              <img src="@/assets/svg/user/icon_invite_copy.svg" @click="copyInviteLink(inviteVal)" alt="">
              <img src="@/assets/svg/airdrop/icon_twitter_btn.svg" @click="shareInviteLink(inviteVal)" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="ending_soon_box" v-if="endingSoon.length > 0">
        <div class="ending_soon_text">{{ $t("ticketsInfo.endSoon") }}</div>
        <div class="ending_soon_list">
          <div class="ending_soon_item" @click="enterNow(item)" v-for="(item, index) in endingSoon" :key="index">
            <div class="image_box">
              <div class="tips_round" :class="item.orderType == 'LIMITED_TIME' ? 'time' : 'price'">
                <img v-if="item.orderType == 'LIMITED_TIME'" src="@/assets/svg/home/icon_info_time_white.svg" alt="">
                <img v-else src="@/assets/svg/home/icon_info_price_white.svg" alt="">
                <span v-if="item.orderType == 'LIMITED_TIME'">
                  <span v-if="dateDiff(item && item.endTime) > 1">
                    {{ $t("home.dayLeft", { day: Math.ceil(dateDiff(nftInfo && nftInfo.endTime)) }) }}
                  </span>
                  <countDown v-else v-slot="timeObj" :time="item && item.endTime">
                    {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                  </countDown>
                </span>
                <span v-else>
                  <span v-if="Number(new bigNumber(item.limitNum).minus(item.numberOfTicketsSold || 0)) > 1">
                    {{
                      $t("home.ticketsLeft", {
                        num:
                          new bigNumber(item.limitNum).minus(item.numberOfTicketsSold || 0)
                      }) }}
                  </span>
                  <span v-else>
                    {{ $t("home.ticketLeft", {
                      num: new bigNumber(item.limitNum).minus(item.numberOfTicketsSold
                        || 0)
                    }) }}
                  </span>
                </span>
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
              <span>{{ $t("home.nftTicketBtn") }}</span>
            </div>
            <div class="remaining_votes">
              <span v-if="item && item.numberOfTicketsSold > 1">
                {{ $t("home.ticketsSold", { num: item && item.numberOfTicketsSold || 0 }) }}
              </span>
              <span v-else>
                {{ $t("home.ticketSold", { num: item && item.numberOfTicketsSold || 0 }) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
    <buyConfirm :nftInfo="nftInfo" :orderId="orderId" :inviteCode="inviteVal" :tickets="buyVotes" :price="buyPrice"
      v-if="pageType === 'confirm'" @closeDialogFun="closeDialogFun"></buyConfirm>
    <Recharge v-if="pageType === 'recharge'" @closeDialogFun="closeDialogFun"></Recharge>
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
  getSetting,
} from "@/services/api/invite";
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { useHeaderStore } from "@/store/header.js";

import { i18n } from '@/locales';
const { t } = i18n.global;

import { CScrollbar } from "c-scrollbar";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import buyConfirm from "./buyConfirm.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Image from "@/components/imageView";
import Recharge from "@/views/user/recharge.vue";
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
    Image,
    buyConfirm,
    Recharge
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
    ethBalance() {
      const headerStore = useHeaderStore();
      return headerStore.balance;
    },
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
    },
    numData() {
      return [
        {
          label: "25%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.25))
        },
        {
          label: "50%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.5))
        },
        {
          label: "75%",
          value: Math.floor(new bigNumber(this.maxBuyNum).multipliedBy(0.75))
        },
        {
          label: "Max",
          value: this.maxBuyNum
        },
      ]
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
        hintText = t("ticketsInfo.buyHint");
      }

      if (orderType == "LIMITED_PRICE") {
        if (!Number(maximumPurchaseQuantity) > 0) {
          hintText = t("ticketsInfo.soldOut");
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

      const { orderId, buyVotes, ethBalance, buyPrice } = this;

      if (!buyVotes || buyVotes < 1) {
        this.$message.error(t("ticketsInfo.enterHint"));
        return
      }
      if (Number(ethBalance) < buyPrice) {
        this.$message.error(t("mysteryBox.rechargeHint"));
        this.pageType = 'recharge';
        return
      }

      const res = await buyNftBalance({
        orderNumber: orderId,
        num: buyVotes
      });

      if (res && res.code == 200) {
        this.pageType = 'confirm';
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
        contractAddress: nftInfo.contractAddress,
        tokenId: nftInfo.tokenId
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
    // 默认邀请码
    async fetchSetting() {
      const res = await getSetting({ coin: "ETH" });
      if (res && res.code == 200) {
        this.inviteVal = res.data.defaultInviteCode;
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
        this.fetchSetting(); // 邀请
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
      this.buyVotes = 1;
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