<template>
  <div>
    <div class="my_promotions_wrapper" v-if="!isDetailPage">
      <div class="promotions_panel">
        <div class="promotions_box">
          <div class="promotions_l">
            <img src="@/assets/svg/user/icon_Promotions.svg" alt="" />
            <div class="title_text">{{ $t("user.promotions") }}</div>
          </div>
        </div>
        <template v-if="dataLists">
          <div class="promotions_item-box" v-if="dataLists?.length">
            <div class="promotions_item" v-for="item in dataLists" :key="item.id">
              <img
                :src="item.banner"
                alt=""
                class="banner"
              />
              <p class="name">{{ item.name }}</p>
              <p class="tip">
                {{ item.shortWord }}
                <!-- Join Bitzing and get a <span style="color: #fad54d; font-weight: bold">200%</span> Bonus up to
                <span style="color: #fad54d; font-weight: bold">10</span> ETH -->
              </p>
              <div class="handler_btn">
                <p class="btn active" v-if="item.activityType == 'WELCOME_BONUS'" @click="goDetail(item)">{{ $t("user.deposit") }}</p>
                <p class="btn active" v-else-if="item.activityType == 'OPEN_BOX_WIN_POINTS'" @click="goPage('raffleBoxesList')">
                  {{ $t("user.unboxNow") }}
                </p>
                <p class="btn active" v-else-if="item.activityType == 'TREASURES_WIN_POINTS'" @click="goPage('treasureDraw')">
                  {{ $t("home.nftTicketBtn") }}
                </p>
                <p class="btn" @click="goDetail(item)">
                  <b class="new_dot" v-if="item.activityType == 'WELCOME_BONUS'&&(newStatus.welcomeBounsStatus || newStatus.welcomeBounsReceiveStatus)"></b>
                  {{ $t("user.readMore") }}
                </p>
              </div>
            </div>
          </div>
          <div class="no_date" v-else>
            <span>{{ $t("user.noDataPromotions") }}</span>
          </div>
        </template>
      </div>
    </div>
    <PromotionsDetails v-else @hide="isDetailPage = false" :details="details" @depositFunc="depositFunc"></PromotionsDetails>
  </div>
</template>
<script>
import emitter from "@/utils/event-bus.js";
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import PromotionsDetails from "./promotionsDetails";
import { getActivityLists } from "@/services/api/user";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat } from "@/utils";
export default {
  name: "myPromotions",
  components: { PromotionsDetails },
  data() {
    return {
      userPoints: null,
      isDetailPage: false,
      dataLists: null,
      details: {},
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
    newStatus() {
      const headerStore = useHeaderStore();
      return headerStore.newStatus;
    },
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    goPage(path) {
      this.$router.push({ path: `/${path}` });
    },
    goDetail(item) {
      this.details = item;
      this.isDetailPage = true;
    },
    // 积分余额
    async getActivityListsFunc() {
      const res = await getActivityLists();
      if (res && res.code == 200) {
        this.dataLists = res.data;
      }
    },
    depositFunc() {
      emitter.emit("pageTypeChange", "recharge");
    },
  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.getActivityListsFunc();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/promotions.scss";
</style>
