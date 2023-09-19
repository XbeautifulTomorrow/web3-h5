<template>
  <div class="promotions_details_box">
    <div class="promotions_box">
        <div class="promotions_l">
          <img src="@/assets/svg/icon_right.svg" alt="">
          <div class="name_text">Welcome Offer</div>
        </div>
      </div>
    <div class="promotions_details">
      <img src="https://assets.otherside.xyz/otherdeeds/f2bb8bb6f42a559c48dbb5ae7023769ab88151df3e499297a893417a4eca6fc7.jpg" alt="" class="banner">
      <p class="name">Welcome Offer</p>
      <div class="handler_btn deposit_btn_box">
        <p class="btn active deposit_btn">Deposit</p>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from '@/locales';
const { t } = i18n.global;
import { mapStores } from "pinia";
import { useHeaderStore } from "@/store/header.js";
import { useUserStore } from "@/store/user.js";
import {
  getTheUserPoint,
} from "@/services/api/user";

import bigNumber from "bignumber.js";
import { accurateDecimal, onCopy, timeFormat } from "@/utils";
export default {
  name: "myPromotions",
  data() {
    return {
      userPoints: null,
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
