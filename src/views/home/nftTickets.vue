<template>
  <div class="ntf-tickets">
    <div class="home-public-title">
      <div class="title_text">COMPETITION</div>
      <div class="title_description">Enter now for a chance to win a blue-chip NFT.</div>
    </div>
    <ul class="boxes-content">
      <template v-for="(item, index) in tickets">
        <li class="ntf-tickets-list" @click="handleTickets(item)" v-if="index < 5" :key="`tickets-${index}`">
          <div class="img-box">
            <img class="tickets-boxs-list-img" :src="item.nftImage" alt="" />
            <div class="type-box">
              <div class="time" v-if="item.orderType == 'LIMITED_TIME'">
                <img src="@/assets/svg/home/icon_time.svg" alt="">
                <span>Comming soon</span>
                <!-- <span v-if="dateDiff(item && item.endTime) > 1">
                  {{ `${Math.ceil(dateDiff(item && item.endTime))} DAY LEFT` }}
                </span>
                <countDown v-else v-slot="timeObj" :end="item && item.endTime">
                  {{ `${timeObj.hh}:${timeObj.mm}:${timeObj.ss} LEFT` }}
                </countDown> -->
              </div>
              <div class="price" v-else>
                <img src="@/assets/svg/home/icon_price.svg" alt="">
                <span>Comming soon</span>
                <!-- <span>
                  {{
                    `${new bigNumber(item.limitNum || 0).minus(item.numberOfTicketsSold || 0).toString()} TICKETS LEFT`
                  }}
                </span> -->
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
            <span class="boxes-button-name">ENTER NOW</span>
          </div>
          <div class="sold-box">
            {{ `${item.numberOfTicketsSold || 0} Ticket${(item.numberOfTicketsSold || 0) > 1 ? 's' : ''} sold` }}
          </div>
        </li>
      </template>
    </ul>
    <!-- <div class="ntf-tickets-all">
      <span>View all competitions</span>
      <img src="@/assets/svg/home/icon_more.svg" alt="" />
    </div> -->
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
import { ElMessage } from "element-plus";

import { mapStores } from "pinia";
import { useUserStore } from "@/store/user.js";

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
          price: '11.11',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_2.png"),
          tokenId: "6492",
          seriesName: 'Bored Ape Yacht Club',
          price: '62.5',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_3.png"),
          tokenId: '8518',
          seriesName: 'Azuki',
          price: '80',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
        {
          nftImage: require("@/assets/img/airdrop/nft_4.png"),
          tokenId: '9643',
          seriesName: 'Bored Ape Yacht Club',
          price: '66',
          currency: 'ETH',
          numberOfTicketsSold: 0
        },
      ],
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
    handleTickets(event) {
      if (this.isLogin && this.userInfo?.id) {
        ElMessage.warning("Comming soon");
        return
        // eslint-disable-next-line no-unreachable
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
      this.showConnect = false;
      if (this.userInfo) {
        this.getTheUserBalanceInfo();
      } else if (this.regInfo) {
        console.log(this.regInfo);
      }
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