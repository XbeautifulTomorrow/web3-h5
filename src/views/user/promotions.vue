<template>
  <div class="my_promotions_wrapper">
    <div class="promotions_panel" v-if="!isDetailPage">
      <div class="promotions_box">
        <div class="promotions_l">
          <img src="@/assets/svg/user/icon_Promotions.svg" alt="">
          <div class="title_text">{{ $t("user.promotions") }}</div>
        </div>
      </div>
      <div class="promotions_item-box">
          <div class="promotions_item"  v-for="(item,index) in 3" :key="index">
            <img src="https://assets.otherside.xyz/otherdeeds/f2bb8bb6f42a559c48dbb5ae7023769ab88151df3e499297a893417a4eca6fc7.jpg" alt="" class="banner">
              <p class="name">Welcome Offer</p>
              <p class="tip">Join Bitzing and get a <span style="color: #fad54d;font-weight: bold;">200%</span> Bonus up to <span style="color: #fad54d;font-weight: bold;">10</span> ETH</p>
              <div class="handler_btn">
              <p class="btn active">Deposit</p>
              <p class="btn">Read More</p>
            </div>
          </div>
        </div>
    </div>
    <PromotionsDetails  v-else></PromotionsDetails>
  </div>
</template>
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import PromotionsDetails from "./promotionsDetails"
import {
  getTheUserPoint,
} from "@/services/api/user";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat } from "@/utils";
export default {
  name: "myPromotions",
  components:{PromotionsDetails},
  data() {
    return {
      userPoints: null,
      isDetailPage:true,
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
    }
  },
  methods: {
    onCopy: onCopy,
    bigNumber: bigNumber,
    timeFormat: timeFormat,
    accurateDecimal: accurateDecimal,
    // 积分余额
    async fetchTheUserPoint() {
      const res = await getTheUserPoint();
      if (res && res.code == 200) {
        this.userPoints = res.data.balance;
      }
    },

  },
  created() {
    if (this.isLogin && this.userInfo?.id) {
      this.fetchTheUserPoint();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./components/promotions.scss";
</style>
