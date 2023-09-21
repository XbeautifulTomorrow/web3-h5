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
        <div class="promotions_item-box">
          <div class="promotions_item" v-for="item in dataLists" :key="item.id">
            <img
              src="https://x-pool.s3.ap-southeast-1.amazonaws.com/prd/mystery/IMAGE/2023-09-19/4e3bc9801cc845cfaec7bc6dad7571eb.webp"
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
              <p class="btn" @click="goDetail(item)">{{ $t("user.readMore") }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PromotionsDetails v-else @hide="isDetailPage = false" :details="details"></PromotionsDetails>
  </div>
</template>
<script>
import { i18n } from "@/locales";
const { t } = i18n.global;
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
      dataLists: [],
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
