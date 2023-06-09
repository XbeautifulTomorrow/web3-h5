<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.nftTicketTitle") }}</div>
      <div class="title_description">{{ $t("home.nftTicketTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="ntf-tickets-list" @click="handleTickets(item)" v-if="index < 5" :key="`tickets-${index}`">
          <div class="img-box">
            <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" :time="currentTime" :end="item && item.endTime">
                  {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                </countDown>
              </div>
              <div class="price" v-else>
                <img src="@/assets/svg/home/icon_price.svg" alt="">
                <span>
                  {{
                    `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0).toString()} TICKETS LEFT`
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="nft-name">
            <div class="nft-name-l">
              <div class="name-text text-ellipsis">{{ item.seriesName || "-" }}</div>
              <img src="@/assets/svg/home/icon_certified.svg" alt="">
            </div>
            <div class="nft-name-r text-ellipsis">{{ `#${item.tokenId}` }}</div>
          </div>
          <div class="price-box">
            {{ `${item.price} ETH` }}
          </div>
          <div class="boxes-button">
            <span class="boxes-button-name">{{ $t("home.nftTicketBtn") }}</span>
          </div>
          <div class="sold-box" v-if="item.numberOfTicketsSold > 1">
            {{ $t("home.ticketsSold", { num: item.numberOfTicketsSold || 0 }) }}
          </div>
          <div class="sold-box" v-else>
            {{ $t("home.ticketSold", { num: item.numberOfTicketsSold || 0 }) }}
          </div>
        </li>
      </template>
    </ul>
    <div class="ntf-tickets-all" @click="openAll()">
      <span>View all competitions</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div>
    <Login v-if="pageType === 'login'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Register v-if="pageType === 'register'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Forgot v-if="pageType === 'forgot'" @closeDialogFun="closeDialogFun" @changeTypeFun="changeTypeFun" />
    <Modify v-if="pageType === 'modify'" @onModify="closeDialogFun" @closeDialogFun="closeDialogFun"></Modify>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import countDown from '@/components/countDown';
import { dateDiff } from "@/utils";

import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";
import { getSetting } from "@/services/api/invite";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
export default {
  name: 'NtfTickets',
  props: ['ticketList'],
  components: {
    Login,
    Register,
    Forgot,
    Modify,
    // eslint-disable-next-line vue/no-unused-components
    countDown
  },
  data() {
    return {
      pageType: null,
      tickets: [
        {
          nftImage: require("@/assets/img/airdrop/nft_1.png"),
          tokenId: "24336",
          orderType: "LIMITED_TIME",
          seriesName: 'Mutant Ape Yacht Club',
          price: '6.9',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_2.png"),
          tokenId: "6492",
          seriesName: 'Bored Ape Yacht Club',
          price: '48.99',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_3.png"),
          tokenId: '8518',
          seriesName: 'Azuki',
          price: '10.0275',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_4.png"),
          tokenId: '9643',
          seriesName: 'Bored Ape Yacht Club',
          price: '38.027',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
      ],
      currentTime: null
    };
  },
  computed: {
    ...mapStores(useUserStore),
    isLogin() {
      const { isLogin } = this.userStore;
      return isLogin
    },
    userInfo() {
      const { userInfo } = this.userStore;
      return userInfo;
    },
  },
  methods: {
    dateDiff: dateDiff,
    bigNumber: bigNumber,
    // 设置
    async fetchSetting() {
      const res = await getSetting({
        coin: "ETH"
      });

      if (res && res.code == 200) {
        this.currentTime = res.localDateTime;
        this.$forceUpdate();
      }
    },
    handleTickets(event) {
      if (this.isLogin && this.userInfo?.id) {
        this.$router.push({ name: "NftTicketsInfo", query: { id: event.orderNumber } });
      } else {
        this.changeTypeFun('login');
      }
    },
    openAll() {
      this.$router.push({ name: "NftTicketsList" });
    },
    closeDialogFun() {
      this.pageType = "";
    },
    changeTypeFun(page) {
      this.pageType = page;
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>