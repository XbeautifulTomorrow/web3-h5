<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">{{ $t("home.nftTicketTitle") }}</div>
      <div class="title_description">{{ $t("home.nftTicketTips") }}</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in ticketList">
        <li class="ntf-tickets-item" @click="handleTickets(item)" v-if="index < 5" :key="`tickets-${index}`">
          <div class="img-box">
            <Image fit="cover" class="nft_img" :src="item.nftImage" />
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" @onEnd="fetchCheckAllOrders()" :time="item.endTime">
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
import { getCheckAllOrders } from "@/services/api/oneBuy";

import Login from "../login/index.vue";
import Register from "../register/index.vue";
import Forgot from "../forgot/index.vue";
import Modify from "@/views/Airdrop/components/modify.vue";
import Image from "@/components/imageView";
export default {
  name: 'NtfTickets',
  components: {
    Login,
    Register,
    Forgot,
    Modify,
    countDown,
    Image
  },
  data() {
    return {
      pageType: null,
      ticketList: []
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
    // 获取一元购列表
    async fetchCheckAllOrders() {
      const res = await getCheckAllOrders({ page: 1, size: 5 })
      if (res && res.code == 200) {
        this.ticketList = res.data.records;
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
  },
  created() {
    this.fetchCheckAllOrders();
  }
};
</script>
<style lang="scss" scoped>
@import "./components/nftTickets.scss";
</style>